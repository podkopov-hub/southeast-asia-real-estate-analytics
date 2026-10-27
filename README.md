# Southeast Asia Real Estate Analytics & Due Diligence Core

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-green.svg)](https://nodejs.org/)
[![Platform](https://img.shields.io/badge/platform-Thailand%20|%20Indonesia%20|%20Cambodia-orange.svg)](https://novasia.estate/)

Enterprise-grade data processing pipelines, net rental yield calculators, leasehold amortization models, and legal contract risk frameworks tailored for emerging Southeast Asian real estate markets (Thailand, Indonesia/Bali, and Cambodia).

Maintained by the engineering and data science team at **[NovAsia Estate](https://novasia.estate/)**.

---

## 🏛️ Official Research & Open Science Registry (OSF)

Our quantitative valuation models, spatial mapping methodologies, and legal risk assessment frameworks are backed by peer-referenced open-science datasets published via the Open Science Framework:

* **Primary Property Metrics & Raw Data Files:** [OSF Research Repository](https://osf.io/bf39h/files/9qpcf)
* **Valuation & Due Diligence Risk Storage:** [OSF Valuation Archive](https://osf.io/7wcbn/files/xn29d)
* **Technical Methodology & Calculation Wiki:** [OSF Project Methodology Wiki](https://osf.io/7wcbn/wiki?wiki=xjd5n)
---

## 📊 Core Architecture & Calculation Modules

Standard Western gross-to-net real estate formulas fail in Southeast Asia due to local statutory taxes, leasehold degradation laws, and complex common area maintenance (CAM) structures. This repository provides standardized programmatic interfaces to compute accurate returns.

### 1. Net Rental Yield & Tax Engine (`/engine`)
Accounts for property acquisition costs, gross rental income, regional withholding taxes (TH, ID, KH), short-term management commissions, and sinking/maintenance reserves.

```javascript
const { calculateNetYield } = require('./engine/calculator');

const metrics = calculateNetYield({
  propertyPrice: 185000,
  grossAnnualRent: 19500,
  region: 'TH', // 'TH' (Thailand), 'ID' (Bali), 'KH' (Cambodia)
  annualCamFee: 1200
  ---

### 📥 Блок 3 из 3 (Вставь в самый конец):
```markdown
---

## 📦 Official Distribution Packages & Ecosystem

Our models are packaged for seamless integration across various developer environments:

* **Node.js NPM Package:** [novasia-sea-yield on npm](https://www.npmjs.com/package/novasia-sea-yield)
* **Python SDK & Spatial Pipeline:** [novasia-proptech on PyPI](https://pypi.org/project/novasia-proptech/)
* **Empirical Market Benchmarks:** [HuggingFace Dataset Repository](https://huggingface.co/datasets/novasia-estate/southeast-asia-property-net-yield-benchmark)

---

## 🗺️ Geographic & Market Coverage

* **Thailand:** Pattaya, Phuket, Bangkok, Chiang Mai (Condo Freehold & Thai Quota regulations, CAM fee standardization).
* **Indonesia (Bali):** Canggu, Seminyak, Uluwatu, Ubud (Hak Pakai / Hak Sewa leasehold structuring, tropical villa depreciation).
* **Cambodia:** Phnom Penh, Sihanoukville (Borey property titles, foreign ownership quotas).

For live interactive investment tools, comprehensive market reports, and property listings, visit the [NovAsia Investment Portal](https://novasia.estate/).

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE). 

© 2026 [NovAsia Estate](https://novasia.estate/). All rights reserved.
});

console.log(metrics);
