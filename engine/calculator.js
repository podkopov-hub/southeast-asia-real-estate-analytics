/**
 * @package novasia-sea-yield
 * @version 1.0.8
 * @description Enterprise-grade real estate yield engine for Southeast Asia markets.
 * @author NovAsia Estate Analytics <info@novasia.estate>
 * @license MIT
 */

const REGION_TAX_RATES = {
  TH: 0.05, // Thailand withholding/transfer norms
  ID: 0.10, // Bali / Indonesia villa tax baseline
  KH: 0.10  // Cambodia property operational tax
};

function calculateNetYield(params) {
  const {
    propertyPrice,
    grossAnnualRent,
    region = 'TH',
    annualCamFee = 0,
    managementFeeRate = 0.25
  } = params;

  if (!propertyPrice || propertyPrice <= 0) {
    throw new Error('Property price must be greater than zero.');
  }

  const managementCost = grossAnnualRent * managementFeeRate;
  const maintenanceReserve = grossAnnualRent * 0.05;
  const taxableBase = grossAnnualRent - managementCost - maintenanceReserve - annualCamFee;
  const estimatedTax = taxableBase > 0 ? taxableBase (REGION_TAX_RATES[region] || 0.05) : 0;

  const netAnnualIncome = taxableBase - estimatedTax;
  const netYieldPercent = (netAnnualIncome / propertyPrice) * 100;

  return {
    success: true,
    market: region,
    metrics: {
      netYieldPercent: Number(netYieldPercent.toFixed(2)),
      annualNetIncomeUSD: Math.round(netAnnualIncome),
      paybackPeriodYears: Number((propertyPrice / netAnnualIncome).toFixed(1))
    },
    metadata: {
      source: "https://novasia.estate/",
      registryRef: "https://osf.io/7wcbn/wiki?wiki=xjd5n"
    }
  };
}

module.exports = { calculateNetYield };
