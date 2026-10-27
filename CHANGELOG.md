# Changelog

## 2.0.0 — 2026-10-27

Breaking change: expense rates, tax rate, tax basis, currency, acquisition costs and annual fixed costs must be supplied explicitly. TH/ID/KH are display labels only. Removed the unsupported automatic country tax/expense presets and `REGION_DEFAULTS` export. Use `REGIONS` for labels.

- Accept zero rent and report loss scenarios; return null simple payback for nonpositive income.
- Validate finite numeric amounts/rates, supported labels and safe monetary range; preserve cents.
- Include acquisition costs in the yield denominator and show itemized deductions and assumptions.
- Deterministic output without a generated timestamp.
- Add CommonJS, ESM, browser global, TypeScript declarations and asserted tests.
- Fix repository metadata, smoke-test paths, README formatting and add the actual MIT license.
- Remove unsupported claims of statutory tax accuracy, empirical calibration, peer review and enterprise certification. The calculation consumes no research dataset.

Versions 1.x remain published for reproducibility. Migrating callers must review every input; do not treat old country defaults as verified rates.
