const { calculateNetYield } = require('../engine/calculator');

console.log('[Test] Running NovAsia Engine Validation...');
try {
  const result = calculateNetYield({
    propertyPrice: 150000,
    grossAnnualRent: 18000,
    region: 'TH',
    annualCamFee: 1000
  });
  console.log('[Test] Success! Computed Metrics:', result);
} catch (err) {
  console.error('[Test] Failed:', err.message);
  process.exit(1);
}
