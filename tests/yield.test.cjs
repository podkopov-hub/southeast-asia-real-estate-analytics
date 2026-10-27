'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { calculateNetYield, NovAsiaYieldEngine, REGIONS } = require('../index.js');

const example = () => ({ currency: 'USD', region: 'TH', propertyPrice: 185000, acquisitionCosts: 15000,
  grossAnnualRent: 19000, annualCamFee: 1200, annualOtherCosts: 500,
  managementFeeRate: 0.20, maintenanceReserveRate: 0.05, taxRate: 0.10, taxBase: 'operating-profit' });

test('manual benchmark: all-in basis 200000; net income 11295', () => {
  const result = calculateNetYield(example());
  assert.equal(result.costBasis, 200000);
  assert.deepEqual(result.itemizedDeductions, { managementFee: 3800, maintenanceReserve: 950, camFee: 1200, otherCosts: 500, estimatedTax: 1255 });
  assert.deepEqual(result.metrics, { grossYield: 9.5, netYield: 5.65, annualNetIncome: 11295, operatingIncome: 12550, paybackPeriodYears: 17.7 });
});
test('gross-rent tax base differs from profit tax base', () => {
  const result = calculateNetYield({ ...example(), taxBase: 'gross-rent' });
  assert.equal(result.itemizedDeductions.estimatedTax, 1900);
  assert.equal(result.metrics.annualNetIncome, 10650);
});
test('zero rent is valid and can produce a loss', () => {
  const result = calculateNetYield({ ...example(), grossAnnualRent: 0 });
  assert.equal(result.metrics.annualNetIncome, -1700);
  assert.equal(result.metrics.netYield, -0.85);
  assert.equal(result.metrics.paybackPeriodYears, null);
  assert.equal(result.itemizedDeductions.estimatedTax, 0);
});
test('zero-cost scenario must be explicitly supplied', () => {
  const result = calculateNetYield({ ...example(), acquisitionCosts: 0, annualCamFee: 0, annualOtherCosts: 0, managementFeeRate: 0, maintenanceReserveRate: 0, taxRate: 0 });
  assert.equal(result.metrics.annualNetIncome, 19000);
});
test('negative operating profit is not taxed under the selected profit scenario', () => {
  const result = calculateNetYield({ ...example(), annualCamFee: 25000 });
  assert(result.metrics.annualNetIncome < 0);
  assert.equal(result.itemizedDeductions.estimatedTax, 0);
  assert.equal(result.metrics.paybackPeriodYears, null);
});
test('gross-rent tax can apply even to a loss scenario', () => {
  assert.equal(calculateNetYield({ ...example(), annualCamFee: 25000, taxBase: 'gross-rent' }).itemizedDeductions.estimatedTax, 1900);
});
test('region never changes the arithmetic', () => {
  const th = calculateNetYield(example());
  for (const region of ['ID', 'KH']) assert.deepEqual(calculateNetYield({ ...example(), region }).metrics, th.metrics);
  assert(Object.isFrozen(REGIONS));
});
test('unknown or missing region is rejected, never silently replaced', () => {
  for (const region of [undefined, 'US', '', '__proto__', 'toString']) assert.throws(() => calculateNetYield({ ...example(), region }), /region/);
});
for (const field of ['propertyPrice', 'acquisitionCosts', 'grossAnnualRent', 'annualCamFee', 'annualOtherCosts']) {
  test(field + ': rejects missing, nonfinite, string, negative and unsafe amounts', () => {
    for (const value of [undefined, NaN, Infinity, -Infinity, '1000', null, -1, Number.MAX_SAFE_INTEGER, 1.001]) {
      assert.throws(() => calculateNetYield({ ...example(), [field]: value }), new RegExp(field));
    }
  });
}
test('zero and sub-cent property prices are rejected', () => {
  for (const propertyPrice of [0, 0.001]) assert.throws(() => calculateNetYield({ ...example(), propertyPrice }), /propertyPrice/);
});
for (const field of ['managementFeeRate', 'maintenanceReserveRate', 'taxRate']) {
  test(field + ': explicit decimal fraction required', () => {
    for (const value of [undefined, null, NaN, Infinity, '0.1', -0.01, 1.01, 20]) assert.throws(() => calculateNetYield({ ...example(), [field]: value }), new RegExp(field));
    assert.doesNotThrow(() => calculateNetYield({ ...example(), [field]: 1 }));
  });
}
test('currency and tax basis must be explicit', () => {
  for (const currency of [undefined, '', 'usd', 'USD/THB', 123]) assert.throws(() => calculateNetYield({ ...example(), currency }), /currency/);
  for (const taxBase of [undefined, '', 'country-default']) assert.throws(() => calculateNetYield({ ...example(), taxBase }), /taxBase/);
});
test('input shape and total acquisition cost are guarded', () => {
  for (const input of [null, undefined, [], 'scenario']) assert.throws(() => calculateNetYield(input), /scenario/);
  assert.throws(() => calculateNetYield({ ...example(), propertyPrice: 8e13, acquisitionCosts: 8e13 }), /Total acquisition cost/);
});
test('amounts keep cents and are not rounded before tax is applied', () => {
  const result = calculateNetYield({ ...example(), grossAnnualRent: 1000.01, managementFeeRate: 0.1, maintenanceReserveRate: 0, annualCamFee: 0, annualOtherCosts: 0, taxRate: 0.1 });
  assert.equal(result.metrics.annualNetIncome, 810.01);
  assert.equal(result.itemizedDeductions.managementFee, 100);
});
test('deterministic output and no input mutation', () => {
  const input = Object.freeze(example());
  assert.deepEqual(calculateNetYield(input), calculateNetYield(input));
  assert(!('timestamp' in calculateNetYield(input)));
});
test('class interface and repository compatibility path use the same engine', () => {
  const input = example(); delete input.currency;
  const engine = new NovAsiaYieldEngine({ currency: 'USD' });
  assert.deepEqual(engine.calculateNetYield(input), calculateNetYield(example()));
  assert.deepEqual(engine.getAvailableRegions(), REGIONS);
  assert.equal(require('../engine/calculator.js').calculateNetYield, calculateNetYield);
  assert.throws(() => new NovAsiaYieldEngine({ baseCurrency: 'USD' }), /no FX/);
});
test('Node ESM entry point matches CommonJS', async () => {
  const esm = await import('../index.mjs');
  assert.deepEqual(esm.calculateNetYield(example()), calculateNetYield(example()));
});
test('browser global loads without modules, network or Node dependencies', () => {
  const sandbox = {};
  vm.runInNewContext(fs.readFileSync(require.resolve('../index.js'), 'utf8'), sandbox);
  assert.equal(sandbox.NovAsiaYield.calculateNetYield(example()).metrics.annualNetIncome, 11295);
});
