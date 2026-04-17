// Home sizes
export const homeSizes = {
  small: "Small (< 100 m²)",
  medium: "Medium (100-200 m²)",
  large: "Large (200-300 m²)",
  xlarge: "Extra Large (300+ m²)",
};

// Saudi regions with distinct climate profiles
export const regions = {
  riyadh: {
    label: "Riyadh (Central Region)",
    seasons: { summer: 5, winter: 3, shoulder: 4 },
    defaultAcHours: { summer: 14, winter: 4, shoulder: 8 },
    defaultWaterHeaterHours: { summer: 2, winter: 4, shoulder: 3 },
  },
  jeddah: {
    label: "Jeddah (Western Region)",
    // Coastal & humid — AC runs harder even in "winter" due to humidity
    seasons: { summer: 6, winter: 1, shoulder: 5 },
    defaultAcHours: { summer: 15, winter: 9, shoulder: 12 },
    defaultWaterHeaterHours: { summer: 1, winter: 3, shoulder: 2 },
  },
  dammam: {
    label: "Dammam (Eastern Province)",
    // Gulf coast — long scorching summers, short mild winters
    seasons: { summer: 6, winter: 2, shoulder: 4 },
    defaultAcHours: { summer: 15, winter: 5, shoulder: 9 },
    defaultWaterHeaterHours: { summer: 2, winter: 4, shoulder: 3 },
  },
  mecca: {
    label: "Mecca (Holy Capital)",
    // Hottest and most relentless heat in the Kingdom
    seasons: { summer: 7, winter: 1, shoulder: 4 },
    defaultAcHours: { summer: 16, winter: 8, shoulder: 13 },
    defaultWaterHeaterHours: { summer: 1, winter: 3, shoulder: 2 },
  },
};

// Electricity rates (SAR/kWh) for Saudi Arabia
export const electricityRates = {
  residential: {
    tier1: 0.18, // 0–2000 kWh
    tier2: 0.24, // 2001–4000 kWh
    tier3: 0.30, // 4001–6000 kWh
    tier4: 0.38, // 6001+ kWh
  },
  commercial: {
    tier1: 0.26, // 0–4000 kWh
    tier2: 0.32, // 4001–8000 kWh
    tier3: 0.40, // 8001+ kWh
  },
};

// Default appliance counts based on home size
export const defaultApplianceCounts = {
  small:  { AC: 2, fridge: 1, waterHeater: 1 },
  medium: { AC: 3, fridge: 1, waterHeater: 1 },
  large:  { AC: 4, fridge: 1, waterHeater: 2 },
  xlarge: { AC: 6, fridge: 2, waterHeater: 2 },
};

// Power consumption by appliance type (kW)
export const appliancePower = {
  AC:          { old: 1.8,  new: 1.4, inverter: 1.0 },
  fridge:      { old: 0.8,  new: 0.6, modern:   0.4 },
  waterHeater: { old: 2.0,  new: 1.5, solar:    0.5 },
};

// Cost to replace appliances (SAR)
export const replacementCosts = {
  AC:          { new: 2500, inverter: 3500 },
  fridge:      { new: 2000, modern:   3000 },
  waterHeater: { new: 1500, solar:    4500 },
};

// Kept for backward compatibility — prefer regions[x].seasons
export const seasons = {
  summer:   5,
  winter:   3,
  shoulder: 4,
};

// Carbon emission factor (kg CO2/kWh) for Saudi Arabia
export const carbonFactor = 0.7;
