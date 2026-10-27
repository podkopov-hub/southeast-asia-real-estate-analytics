export type Region = 'TH' | 'ID' | 'KH';
export type TaxBase = 'gross-rent' | 'operating-profit';
export interface YieldScenario {
  /** Currency label only; all monetary inputs must already use this currency. */
  currency: string;
  /** Display label only; never selects expense or tax assumptions. */
  region: Region;
  propertyPrice: number;
  acquisitionCosts: number;
  grossAnnualRent: number;
  annualCamFee: number;
  annualOtherCosts: number;
  /** Decimal fraction: 0.20 means 20%. */
  managementFeeRate: number;
  maintenanceReserveRate: number;
  taxRate: number;
  taxBase: TaxBase;
}
export interface YieldResult {
  success: true;
  region: Region;
  market: string;
  currency: string;
  costBasis: number;
  metrics: { grossYield: number; netYield: number; annualNetIncome: number; operatingIncome: number; paybackPeriodYears: number | null };
  itemizedDeductions: { managementFee: number; maintenanceReserve: number; camFee: number; otherCosts: number; estimatedTax: number };
  assumptions: Omit<YieldScenario, 'currency' | 'region'>;
  metadata: { methodologySource: string; scope: string };
}
export declare function calculateNetYield(input: YieldScenario): YieldResult;
export declare class NovAsiaYieldEngine {
  constructor(options?: { currency?: string });
  currency: string | undefined;
  calculateNetYield(input: Omit<YieldScenario, 'currency'> & { currency?: string }): YieldResult;
  getAvailableRegions(): Readonly<Record<Region, string>>;
}
export declare const REGIONS: Readonly<Record<Region, string>>;
declare const api: { calculateNetYield: typeof calculateNetYield; NovAsiaYieldEngine: typeof NovAsiaYieldEngine; REGIONS: typeof REGIONS };
export default api;
