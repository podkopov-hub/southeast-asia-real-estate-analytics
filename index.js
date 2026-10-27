/* NovAsia SEA Yield — MIT. Scenario arithmetic, not country-specific tax advice. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NovAsiaYield = factory();
})(typeof globalThis === 'undefined' ? this : globalThis, function () {
  'use strict';

  const REGIONS = Object.freeze({ TH: 'Thailand', ID: 'Indonesia / Bali', KH: 'Cambodia' });
  const MONEY_LIMIT = Number.MAX_SAFE_INTEGER / 100;

  function money(value, name, positive) {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new TypeError(name + ' must be a finite number, in the same currency as every other amount.');
    }
    if ((positive ? value <= 0 : value < 0) || value > MONEY_LIMIT) {
      throw new RangeError(name + (positive ? ' must be greater than zero' : ' cannot be negative') + ' and must be within the safe monetary range.');
    }
    if (Math.abs(value * 100 - Math.round(value * 100)) > 0.0001) {
      throw new RangeError(name + ' must have at most two decimal places.');
    }
    return value;
  }

  function rate(value, name) {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(name + ' must be an explicit finite number between 0 and 1.');
    if (value < 0 || value > 1) throw new RangeError(name + ' must be between 0 and 1; use 0.20 for 20%.');
    return value;
  }

  function currencyCode(value) {
    if (typeof value !== 'string' || !/^[A-Z]{3}$/.test(value)) throw new TypeError('currency must be a three-letter uppercase label such as USD, THB or IDR. No currency conversion is performed.');
    return value;
  }

  function round(value, places) {
    if (!Number.isFinite(value)) throw new RangeError('The scenario exceeds the supported numeric range.');
    const result = Number(value.toFixed(places));
    return Object.is(result, -0) ? 0 : result;
  }

  function calculateNetYield(input) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Pass a scenario object with explicit amounts and rates.');
    const currency = currencyCode(input.currency);
    if (!Object.prototype.hasOwnProperty.call(REGIONS, input.region)) throw new RangeError('region must be TH, ID or KH. Region is a label, not a tax or expense preset.');
    const propertyPrice = money(input.propertyPrice, 'propertyPrice', true);
    const acquisitionCosts = money(input.acquisitionCosts, 'acquisitionCosts', false);
    const grossAnnualRent = money(input.grossAnnualRent, 'grossAnnualRent', false);
    const annualCamFee = money(input.annualCamFee, 'annualCamFee', false);
    const annualOtherCosts = money(input.annualOtherCosts, 'annualOtherCosts', false);
    const managementFeeRate = rate(input.managementFeeRate, 'managementFeeRate');
    const maintenanceReserveRate = rate(input.maintenanceReserveRate, 'maintenanceReserveRate');
    const taxRate = rate(input.taxRate, 'taxRate');
    if (!['gross-rent', 'operating-profit'].includes(input.taxBase)) throw new RangeError('taxBase must be gross-rent or operating-profit, selected by the caller.');

    const costBasis = propertyPrice + acquisitionCosts;
    if (costBasis > MONEY_LIMIT) throw new RangeError('Total acquisition cost exceeds the safe monetary range.');
    const managementFee = grossAnnualRent * managementFeeRate;
    const maintenanceReserve = grossAnnualRent * maintenanceReserveRate;
    const operatingIncome = grossAnnualRent - managementFee - maintenanceReserve - annualCamFee - annualOtherCosts;
    const taxableAmount = input.taxBase === 'gross-rent' ? grossAnnualRent : Math.max(operatingIncome, 0);
    const estimatedTax = taxableAmount * taxRate;
    const annualNetIncome = operatingIncome - estimatedTax;

    return {
      success: true,
      region: input.region,
      market: REGIONS[input.region],
      currency,
      costBasis: round(costBasis, 2),
      metrics: {
        grossYield: round(grossAnnualRent / costBasis * 100, 2),
        netYield: round(annualNetIncome / costBasis * 100, 2),
        annualNetIncome: round(annualNetIncome, 2),
        operatingIncome: round(operatingIncome, 2),
        paybackPeriodYears: annualNetIncome > 0 ? round(costBasis / annualNetIncome, 1) : null
      },
      itemizedDeductions: {
        managementFee: round(managementFee, 2),
        maintenanceReserve: round(maintenanceReserve, 2),
        camFee: annualCamFee,
        otherCosts: annualOtherCosts,
        estimatedTax: round(estimatedTax, 2)
      },
      assumptions: {
        propertyPrice, acquisitionCosts, grossAnnualRent, annualCamFee, annualOtherCosts,
        managementFeeRate, maintenanceReserveRate, taxRate, taxBase: input.taxBase
      },
      metadata: {
        methodologySource: 'https://github.com/podkopov-hub/southeast-asia-real-estate-analytics#methodology',
        scope: 'User-supplied annual scenario. No verified market forecast, country tax determination, currency conversion or guarantee.'
      }
    };
  }

  class NovAsiaYieldEngine {
    constructor(options = {}) {
      if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('Engine options must be an object.');
      if (options.baseCurrency !== undefined) throw new TypeError('Version 2 uses currency, not baseCurrency; no FX conversion is performed.');
      this.currency = options.currency === undefined ? undefined : currencyCode(options.currency);
    }
    calculateNetYield(input) {
      if (!input || typeof input !== 'object' || Array.isArray(input)) return calculateNetYield(input);
      return calculateNetYield(Object.assign({}, input, { currency: input.currency === undefined ? this.currency : input.currency }));
    }
    getAvailableRegions() { return REGIONS; }
  }

  return Object.freeze({ calculateNetYield, NovAsiaYieldEngine, REGIONS });
});
