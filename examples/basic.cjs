'use strict';
const { calculateNetYield } = require('novasia-sea-yield');

// Synthetic example: these rates are caller assumptions, not Thai statutory rates.
const result = calculateNetYield({
  currency: 'USD', region: 'TH', propertyPrice: 185000, acquisitionCosts: 15000,
  grossAnnualRent: 19000, annualCamFee: 1200, annualOtherCosts: 500,
  managementFeeRate: 0.20, maintenanceReserveRate: 0.05,
  taxRate: 0.10, taxBase: 'operating-profit'
});
console.log(result.metrics);
// grossYield: 9.5, netYield: 5.65, annualNetIncome: 11295,
// operatingIncome: 12550, paybackPeriodYears: 17.7
