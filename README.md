# Saudi Household Energy Waste Calculator

A tool for Saudi residents to estimate their current electricity waste and potential savings from upgrading to efficient appliances. Uses real SEC tariff rates (Royal Decree M/169), Saudi regional climate data, and appliance efficiency figures from SEEC and the IEA.

**Live demo:**  https://energy-waste-calculator-jse6.vercel.app/

## What it does

1. You enter your city, home size, and appliance details (ACs, fridge, water heater — age, efficiency, usage hours).
2. It calculates your annual electricity bill using Saudi's tiered residential tariff plus 15% VAT.
3. It calculates what you'd pay with high-efficiency replacements.
4. It shows payback period, 5-year savings projection, and an exportable PDF report.

## Running locally

    npm install
    npm start

## Running tests

    npm run test:ci

## Building for production

    npm run build

## Tech stack

React 18, MUI v5, Chart.js, jsPDF. Built with Create React App.

## Scope and limitations

This tool models air conditioning, refrigeration, and water heating — which together account for the majority of a typical Saudi household's electricity use. It does not currently model lighting, cooking, laundry, or solar generation. See the Methodology section below for full data sources and assumptions.

---

## Calculation Methodology

### Step 1 — Annual kWh per appliance

```
annual_kWh = power_kW × daily_hours × seasonal_days
```

Seasonal days are derived from regional monthly weights:

| City    | Summer (months) | Shoulder | Winter |
|---------|-----------------|----------|--------|
| Riyadh  | 6 (May–Oct)     | 3        | 3      |
| Jeddah  | 7 (Apr–Oct)     | 4        | 1      |
| Dammam  | 6 (Apr–Sep)     | 4        | 2      |
| Mecca   | 8 (Mar–Oct)     | 3        | 1      |

Source: General Authority of Meteorology and Environmental Protection (GAMEP) 30-year climate normals.

### Step 2 — Appliance power draw (kW)

| Appliance        | Old (5+ yrs) | Standard New | Best Efficiency       |
|------------------|--------------|--------------|-----------------------|
| Air Conditioner  | 2.0 kW       | 1.5 kW       | 0.9 kW (inverter)     |
| Refrigerator     | 0.175 kW     | 0.12 kW      | 0.09 kW (modern A++)  |
| Water Heater     | 3.5 kW       | 2.0 kW       | 0.5 kW (solar-assist) |

Sources: Saudi Energy Efficiency Center (SEEC) appliance labelling database; IEA Middle East Efficiency Outlook 2022; Saudi Building Code Chapter 8 (SBC 801).

Notes:
- AC figures are average running power for a 1.5 TR (18,000 BTU) split unit under Saudi summer load.
- Refrigerator figures represent compressor draw at typical duty cycle in an ambient ≥30 °C kitchen.
- Water heater "solar" figure represents the backup electric element's average contribution when a solar collector provides ~70–80% of thermal load.

### Step 3 — SEC tiered billing

Annual kWh totals are billed through SEC's residential four-slab tariff (Royal Decree M/169, 2018 reform):

| Slab              | Rate (SAR/kWh) |
|-------------------|----------------|
| 0–6,000 kWh/yr    | 0.18           |
| 6,001–12,000      | 0.24           |
| 12,001–18,000     | 0.30           |
| 18,001+           | 0.38           |

Commercial tariff uses a three-slab structure (0.26 / 0.32 / 0.40 SAR/kWh at the same boundaries).

The calculator applies each slab boundary sequentially to the total annual kWh, so savings are always valued at the marginal (highest) rate reached — accurately reflecting the true financial impact of load reduction.

### Step 4 — VAT

All bill figures are inclusive of the standard 15% Saudi VAT applied to residential electricity consumption.

### Step 5 — Carbon savings

```
CO₂_saved_kg = energy_saved_kWh × 0.7
```

Emission factor: **0.7 kg CO₂/kWh** — Saudi national grid intensity.  
Source: KACARE (King Abdullah City for Atomic and Renewable Energy); cross-checked with IPCC AR6 Annex II country data (2021).

### Step 6 — Payback period

```
payback_years = total_upgrade_cost_SAR / annual_cost_savings_SAR
```

Upgrade costs used (SAR, 2024 Saudi retail estimates):

| Upgrade                | Cost (SAR) |
|------------------------|------------|
| Standard split AC      | 3,000      |
| Inverter split AC      | 4,500      |
| Standard fridge        | 2,000      |
| Modern high-eff fridge | 3,000      |
| Standard water heater  | 1,800      |
| Solar water heater     | 5,500      |

---

## Tech Stack

| Technology          | Version  | Purpose                        |
|---------------------|----------|--------------------------------|
| React               | 18.2.0   | UI framework                   |
| MUI (Material UI)   | 5.12.1   | Component library & theming    |
| @emotion/react      | 11.10.6  | CSS-in-JS (MUI dependency)     |
| Chart.js            | 4.2.1    | Bar and line charts            |
| react-chartjs-2     | 5.2.0    | React bindings for Chart.js    |
| jsPDF               | 2.5.1    | PDF generation                 |
| html2canvas         | 1.4.1    | DOM-to-canvas for PDF export   |
| @fontsource/poppins | 5.2.5    | Local font (Poppins)           |
| react-scripts       | 5.0.1    | CRA build toolchain            |
| Node.js             | 18+      | Runtime (development)          |

---

## Running Locally

### Prerequisites

- Node.js 18 or later
- npm 9 or later

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd house-energy

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app will open at `http://localhost:3000`.

### Production build

```bash
npm run build
```

Output goes to `build/`. Serve with any static host (Netlify, Vercel, GitHub Pages, etc.).

### Adding your certificate image

Place your certificate image at `public/certificate.png`. The Recognition section on the landing page will display it automatically. Supported formats: PNG, JPG. Recommended width: 800 px or wider.

---

## Known Limitations

- **Three appliance types only.** Lighting, washing machines, televisions, and other loads are not modelled. Total bill estimates will be lower than a real household's full electricity bill.
- **Simplified seasonal model.** The calculator uses monthly averages, not hourly load profiles. Actual AC consumption varies significantly by insulation quality, window-to-wall ratio, and occupancy patterns.
- **Single tariff tier per property type.** Governmental, agricultural, and industrial tariffs are not included.
- **Static upgrade costs.** Replacement cost estimates are 2024 mid-market Saudi retail averages. Actual quotes depend on brand, supplier, and installation labour.
- **No subsidy or rebate modelling.** Current Saudi government rebate schemes (if applicable) are not factored into the payback calculation.
- **Annual billing model.** SEC bills monthly; this calculator aggregates to annual to simplify the user experience. Seasonal cash-flow differences are not shown.

---

## Project Context

This project was submitted as the final project for **Fundamentals of Computer Systems**. The goal was to build a practical tool that quantifies energy waste in Saudi residential buildings and supports informed decision-making around appliance upgrades.

---

## Contributors

- Humza Raja
- Ahmed Lashin
- Ahmed Alghanmi

---

## License

This project is for academic and educational use. All rate data and emission factors are sourced from publicly available government publications and cited inline.
