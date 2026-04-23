// Home sizes
export const homeSizes = {
  small:  "Small (< 100 m²)",
  medium: "Medium (100–200 m²)",
  large:  "Large (200–300 m²)",
  xlarge: "Extra Large (300+ m²)",
};

// Saudi regions with distinct climate profiles
// Seasonal month counts must sum to 12.
// Riyadh summer: May–Oct = 6 months (not 5).
// Mecca: virtually no winter — one brief mild month.
// Jeddah: humid coastal year-round, short "cool" season only in Jan.
// Dammam: Gulf coast, long hot summer, brief mild winter.
export const regions = {
  riyadh: {
    label: "Riyadh (Central Region)",
    // Summer: May–Oct (6), Winter: Dec–Feb (3), Shoulder: Mar–Apr + Nov (3)
    seasons: { summer: 6, winter: 3, shoulder: 3 },
    defaultAcHours:          { summer: 14, winter: 4, shoulder: 8 },
    defaultWaterHeaterHours: { summer: 2,  winter: 4, shoulder: 3 },
  },
  jeddah: {
    label: "Jeddah (Western Region)",
    // Humid coast — AC runs year-round; only January feels noticeably cooler.
    // Summer: Apr–Oct (7), Winter: Jan (1), Shoulder: Feb–Mar + Nov–Dec (4)
    seasons: { summer: 7, winter: 1, shoulder: 4 },
    defaultAcHours:          { summer: 15, winter: 9,  shoulder: 12 },
    defaultWaterHeaterHours: { summer: 1,  winter: 3,  shoulder: 2  },
  },
  dammam: {
    label: "Dammam (Eastern Province)",
    // Gulf coast — scorching summers, short mild winters.
    // Summer: Apr–Sep (6), Winter: Dec–Jan (2), Shoulder: Feb–Mar + Oct–Nov (4)
    seasons: { summer: 6, winter: 2, shoulder: 4 },
    defaultAcHours:          { summer: 15, winter: 5, shoulder: 9 },
    defaultWaterHeaterHours: { summer: 2,  winter: 4, shoulder: 3 },
  },
  mecca: {
    label: "Mecca (Holy Capital)",
    // Among the hottest cities in the world — virtually no winter.
    // Summer: Mar–Oct (8), Winter: Jan (1), Shoulder: Nov–Feb minus Jan (3)
    seasons: { summer: 8, winter: 1, shoulder: 3 },
    defaultAcHours:          { summer: 16, winter: 8,  shoulder: 13 },
    defaultWaterHeaterHours: { summer: 1,  winter: 3,  shoulder: 2  },
  },
};

// ── Saudi Electricity Company (SEC) residential tariffs ──────────────────────
// Source: SEC published tariff schedule (Royal Decree M/169, effective 2018).
// Annual thresholds derived by applying monthly tier boundaries × 12.
// Tier 1 ( 0–6 000 kWh/yr equivalent):  0.18 SAR/kWh
// Tier 2 ( 6 001–12 000 kWh/yr):        0.24 SAR/kWh
// Tier 3 (12 001–18 000 kWh/yr):        0.30 SAR/kWh
// Tier 4 (18 001+ kWh/yr):              0.38 SAR/kWh
// The 4-slab residential structure was retained post-2018 for households
// above the 6 000 kWh/month threshold.
export const electricityRates = {
  residential: {
    tier1: 0.18, // 0–6 000 kWh/yr
    tier2: 0.24, // 6 001–12 000 kWh/yr
    tier3: 0.30, // 12 001–18 000 kWh/yr
    tier4: 0.38, // 18 001+ kWh/yr
  },
  commercial: {
    tier1: 0.26, // 0–6 000 kWh/yr
    tier2: 0.32, // 6 001–12 000 kWh/yr
    tier3: 0.40, // 12 001+ kWh/yr
  },
  // Annual kWh thresholds for residential
  residentialThresholds: [6000, 12000, 18000],
  // Annual kWh thresholds for commercial
  commercialThresholds: [6000, 12000],
};

// Default appliance counts by home size
export const defaultApplianceCounts = {
  small:  { AC: 2, fridge: 1, waterHeater: 1 },
  medium: { AC: 3, fridge: 1, waterHeater: 1 },
  large:  { AC: 4, fridge: 1, waterHeater: 2 },
  xlarge: { AC: 6, fridge: 2, waterHeater: 2 },
};

// ── Appliance power draw (kW) — Saudi market typical values ─────────────────
// Air conditioner:
//   old    — Non-inverter window/split unit, 5+ years: 1.8–2.2 kW typical → 2.0 kW
//   new    — Standard-efficiency split (recent, non-inverter): ~1.5 kW
//   inverter — Modern inverter split (2–3 star SEEC rating): 0.8–1.2 kW → 0.9 kW
// Refrigerator (compressor power at rated duty cycle):
//   old    — Pre-2010 models, 150–200 W running draw → 0.175 kW
//   new    — Current-production standard class: ~120 W → 0.12 kW
//   modern — A+/A++ class or inverter compressor: ~90 W → 0.09 kW
// Electric water heater (storage tank, immersion element):
//   old    — 3–4 kW element (common in older Saudi homes) → 3.5 kW
//   new    — Standard new electric tank: 2.0 kW element
//   solar  — Solar-assisted with electric backup element: ~0.5 kW average draw
// Sources: SEEC appliance registration data; IEA Middle East efficiency study 2022;
//          Saudi Building Code Chapter 8 (SBC 801).
export const appliancePower = {
  AC:          { old: 2.0,   new: 1.5,  inverter: 0.9  },
  fridge:      { old: 0.175, new: 0.12, modern:   0.09 },
  waterHeater: { old: 3.5,   new: 2.0,  solar:    0.5  },
};

// Replacement / upgrade costs (SAR) — Saudi retail estimates (2024)
export const replacementCosts = {
  AC:          { new: 3000, inverter: 4500 },
  fridge:      { new: 2000, modern:   3000 },
  waterHeater: { new: 1800, solar:    5500 },
};

// Saudi VAT applied to electricity bills (Royal Decree, current rate 15%)
export const VAT_RATE = 0.15;

// ── Carbon emission factor ────────────────────────────────────────────────────
// 0.7 kg CO₂/kWh — Saudi national grid emission factor.
// Source: King Abdullah City for Atomic and Renewable Energy (KACARE) /
//         Intergovernmental Panel on Climate Change (IPCC) AR6 country data.
export const carbonFactor = 0.7;

// ── Data sources (displayed in UI) ──────────────────────────────────────────
export const dataSources = [
  {
    label: "SEC Tariff Schedule",
    detail:
      "Saudi Electricity Company published residential & commercial tariffs, Royal Decree M/169 (2018 reform).",
  },
  {
    label: "SEEC Appliance Power Data",
    detail:
      "Saudi Energy Efficiency Center (SEEC) appliance labelling database; IEA Middle East Efficiency Outlook 2022.",
  },
  {
    label: "Climate / Seasonal Weights",
    detail:
      "General Authority of Meteorology and Environmental Protection (GAMEP) 30-year climate normals for Riyadh, Jeddah, Dammam, and Mecca.",
  },
  {
    label: "Carbon Emission Factor",
    detail:
      "0.7 kg CO₂/kWh — KACARE national grid emission intensity; cross-checked with IPCC AR6 Annex II country data (2021).",
  },
];
