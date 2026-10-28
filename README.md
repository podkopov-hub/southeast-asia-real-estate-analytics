# NovAsia SEA Yield

An open-source **rental yield scenario calculator** for Node.js and the browser. Zero runtime dependencies. CommonJS, ESM and TypeScript declarations included.

Compare the same annual income and expense assumptions across a property shortlist. Currency and region are labels: the library never selects a tax rule, invents operating costs or converts currency.

[Try the interactive calculator](https://podkopov-hub.github.io/southeast-asia-real-estate-analytics/) · [npm package](https://www.npmjs.com/package/novasia-sea-yield) · [Report an issue](https://github.com/podkopov-hub/southeast-asia-real-estate-analytics/issues)

## Install

```bash
npm install novasia-sea-yield@2
```

Node.js 22 or newer. No API key, account, tracking or network request is required by the calculation code.

## Quick start

```javascript
const { calculateNetYield } = require('novasia-sea-yield');

const result = calculateNetYield({
  currency: 'USD',
  region: 'TH',
  propertyPrice: 185000,
  acquisitionCosts: 15000,
  grossAnnualRent: 19000,
  annualCamFee: 1200,
  annualOtherCosts: 500,
  managementFeeRate: 0.20,
  maintenanceReserveRate: 0.05,
  taxRate: 0.10,
  taxBase: 'operating-profit'
});

console.log(result.metrics);
// {
//   grossYield: 9.5,
//   netYield: 5.65,
//   annualNetIncome: 11295,
//   operatingIncome: 12550,
//   paybackPeriodYears: 17.7
// }
```

**Every number above is synthetic.** In particular, 10% is an illustrative caller assumption, not a statement of Thai tax law, withholding tax or the liability of any investor.

ESM:

```javascript
import { calculateNetYield } from 'novasia-sea-yield';
```

Browser, pinned to a release:

```html
<script src="https://cdn.jsdelivr.net/npm/novasia-sea-yield@2.0.0/index.js"></script>
<script>
  // Pass the same explicit scenario object as in the Node.js example.
  // const result = NovAsiaYield.calculateNetYield(scenario);
</script>
```

## Inputs

All fields are required. Enter zero explicitly when a cost or rate is intentionally excluded from your scenario; missing values are errors. Amounts must be finite, nonnegative numbers with at most two decimals, all in the same currency. `propertyPrice` must be positive.

| Field | Meaning |
| --- | --- |
| `propertyPrice` | Purchase price in the chosen currency |
| `acquisitionCosts` | Additional purchase costs included in the denominator |
| `grossAnnualRent` | Annual rent assumption supplied by the caller; zero is valid |
| `annualCamFee` | Fixed annual common-area/maintenance charge |
| `annualOtherCosts` | Other annual costs not already counted elsewhere |
| `managementFeeRate` | Fraction of gross annual rent; 0.20 = 20% |
| `maintenanceReserveRate` | Additional reserve as a fraction of gross annual rent |
| `taxRate` | Caller-supplied fraction, 0–1; no statutory rate is built in |
| `taxBase` | `gross-rent` or `operating-profit`, selected by the caller |
| `currency` | Uppercase three-letter label, e.g. USD, THB, IDR; no FX conversion |
| `region` | TH, ID or KH; display label only, identical arithmetic |

Avoid counting the same expense in CAM, reserve and other costs. Negative costs, strings, NaN, infinity, unknown regions and missing assumptions are rejected.

## Methodology

```text
cost basis = property price + acquisition costs
management fee = annual rent × management rate
maintenance reserve = annual rent × reserve rate
operating income = annual rent − management fee − reserve − CAM − other costs
taxable amount = annual rent OR max(operating income, 0), as explicitly selected
estimated tax = taxable amount × supplied tax rate
net annual income = operating income − estimated tax
gross yield (%) = annual rent / cost basis × 100
net yield (%) = net annual income / cost basis × 100
simple payback (years) = cost basis / net annual income, only if income > 0
```

The engine keeps intermediate precision and rounds displayed amounts/yields to two decimals and simple payback to one. Rounded deduction lines can differ by a cent from a total calculated before rounding. This is scenario arithmetic, not a tax filing or settlement calculation.

Simple payback assumes unchanged annual income. It does **not** account for lease expiry, resale proceeds, inflation, financing, capital appreciation, vacancy changes or reinvestment. It is not an amortization schedule, forecast or promise of a return. A leasehold term can be shorter than the displayed payback; that question must be assessed separately.

No empirical dataset, live inventory, tax-law service or external research registry is consumed by this code. A region label does not establish ownership rights, expenses, tax residency or applicable deductions. Verify those inputs for the specific transaction and taxpayer.

For buyer-oriented context, see [NovAsia's guide to rental yield and ownership costs](https://novasia.estate/rental-yield-property-in-asia/). The guide provides context; it is not a machine-readable feed of current statutory rates.

## Version 1 migration

Version 2 intentionally removes hidden country defaults. Supply every expense and tax assumption explicitly, plus currency and acquisition costs. Replace `customManagementFee` with `managementFeeRate` and `customTaxRate` with `taxRate`; these no longer fall back to a country rate. Use `REGIONS` instead of `REGION_DEFAULTS`. The engine class accepts `{ currency: 'USD' }`; `baseCurrency` was removed because no conversion is performed. Outputs no longer contain a generated timestamp. Yield now uses total acquisition cost, not just purchase price.

The repository import `require('./engine/calculator')` remains available as a compatibility path, with the same version 2 input requirements. Existing 1.x npm versions are not overwritten.

## Development

```bash
npm test
npm run build:demo
node examples/basic.cjs
```

Tests assert a hand-worked example, both tax bases, zero-income/loss scenarios, invalid inputs, monetary boundaries, region invariance, deterministic output and CJS/ESM/browser loading. The demo uses the exact same engine, copied by `build:demo` without bundling or dependencies.

## По-русски

Открытый калькулятор сценарной доходности аренды от [NovAsia](https://novasia.estate/). Расходы, налог и способ его расчёта задаёт пользователь. Выбор Таиланда, Бали или Камбоджи меняет только подпись, а не подставляет «местную ставку».

Пример выше содержит условные числа. Результат не подтверждает цену, наличие объекта, право владения, налоговые обязательства или будущую доходность. Срок аренды земли, кредит, продажу объекта и изменение денежного потока нужно оценивать отдельно.

## License

MIT. See [LICENSE](LICENSE). Maintained by NovAsia; contributions and reproducible bug reports are welcome.

## NovAsia ecosystem and research resources

Related NovAsia resources are listed below so readers can explore the wider project. They are separate publications, not runtime dependencies or inputs to this calculator. Their presence does not imply peer review or independent validation of this package.

| Resource | Link |
| --- | --- |
| NovAsia property guides and tools | [NovAsia](https://novasia.estate/) |
| Company open-source profile | [NovAsia Estate on GitHub](https://github.com/novasia-estate/) |
| Open browser utilities | [Price/area normalizer, payment planner and CSV cleaner](https://tools.novasia.estate/) |
| Python package | [novasia-proptech on PyPI](https://pypi.org/project/novasia-proptech/) |
| Dataset repository | [Southeast Asia property net yield benchmark on Hugging Face](https://huggingface.co/datasets/novasia-estate/southeast-asia-property-net-yield-benchmark) |
| Research files | [OSF project files](https://osf.io/bf39h/files/9qpcf) |
| Valuation archive | [OSF archive files](https://osf.io/7wcbn/files/xn29d) |
| Methodology notes | [OSF project wiki](https://osf.io/7wcbn/wiki?wiki=xjd5n) |

Use this repository's calculation code, tests and methodology above to reproduce its results. Consult each linked resource for its own scope, data and license.

## Rental Cashflow Stress Lab — browser and repository extension

**[Open Rental Cashflow Stress Lab](https://podkopov-hub.github.io/southeast-asia-real-estate-analytics/stress-lab.html)** · Built by [NovAsia Estate](https://novasia.estate/).

Compare up to ten explicit occupancy, rent-level and fixed-cost scenarios. The lab calls this repository's existing engine; it retains losses and subtracts your annual debt service only after its simplified tax calculation. It adds an occupancy sensitivity table, approximate break-even thresholds, CSV and JSON exports. This is a substantive extension of this project, not a separate renamed calculator. The published npm version remains 2.0.1; these additions are available from the repository and browser demo.

```js
const Stress = require('./docs/stress.js');
const input = require('./examples/stress.json');
const report = Stress.compare(input.base, input.annualDebtService, input.scenarios);
console.log(report.rows.map(r => [r.name, r.netAfterDebt]));
// Base: 3810; Vacancy shock: -3093; Stronger demand: 8508
```

In this extension `base.grossAnnualRent` means annual rent **at full occupancy**. For each scenario it is multiplied by the rent-level multiplier and then occupancy; the effective collected rent is passed to the core engine. Fixed-cost multipliers apply to CAM and other annual fixed costs only. Rates are unchanged and every assumption is explicit. The default fixture is synthetic, not evidence of any country's rents, costs or taxes.

Break-even solves for nonnegative cash flow after annual debt service under the same simplified tax base. With `F = CAM + other fixed costs`, `D = debt service`, `k = 1 − management rate − reserve rate`, and `t = tax rate`:

- Gross-rent tax: required collected rent is `(F + D) / (k − t)` when the retained margin is positive.
- Operating-profit tax, t < 1: required collected rent is `(F + D / (1 − t)) / k` when k > 0.
- Impossible margins, zero capacity and 100% tax cases are reported explicitly, not converted to a guaranteed yield. Zero fixed costs and zero debt can break even at zero rent.

Thresholds use continuous arithmetic before cent rounding; displayed percentages are approximate. More than 100% occupancy means the required rent exceeds the entered capacity. A zero-profit plateau is not a positive return. Annual debt service is an aggregate cash outflow: no amortization, interest tax deduction, depreciation, resale, appreciation, seasonality or equity-return model is implied. All scenarios share the same currency and acquisition-cost denominator.

Run `npm test` and `npm run build:demo`. Source extension: `docs/stress.js`; three synthetic scenarios: `examples/stress.json`. Exported JSON retains all assumptions and detailed core results. Formula-like text labels are escaped in CSV; numbers including negative cash flow remain numeric.

[Payment Milestone Studio](https://github.com/novasia-estate/payment-milestone-studio) helps schedule acquisition installments, a different stage of the workflow. [Synthetic Hugging Face scenarios](https://huggingface.co/datasets/novasia-estate/southeast-asia-property-net-yield-benchmark) help reproduce simple yield arithmetic. For the publisher and property research, visit [NovAsia Estate](https://novasia.estate/).
