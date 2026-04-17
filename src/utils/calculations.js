import {
  appliancePower,
  electricityRates,
  regions,
  carbonFactor,
  replacementCosts,
} from "../constants/data";

export const calculateEnergyCosts = (formData) => {
  try {
    const {
      propertyType,
      appliances,
      usagePatterns,
      region = "riyadh",
    } = formData;

    const currentUsage = calculateCurrentUsage(appliances, usagePatterns, region);
    const currentCost = calculateElectricityCost(currentUsage, propertyType);

    const potentialUsage = calculatePotentialUsage(appliances, usagePatterns, region);
    const potentialCost = calculateElectricityCost(potentialUsage, propertyType);

    const energySavings = currentUsage - potentialUsage;
    const costSavings = currentCost - potentialCost;
    const carbonSavings = energySavings * carbonFactor;

    const upgradeCosts = calculateUpgradeCosts(appliances);
    const paybackPeriod = costSavings > 0 ? upgradeCosts / costSavings : Infinity;

    // Effective marginal rate: the real per-kWh value of the delta (not a flat tier)
    const effectiveMarginalRate =
      energySavings > 0
        ? costSavings / energySavings
        : (electricityRates[propertyType] || electricityRates.residential).tier2;

    const applianceSavings = calculateApplianceSavings(
      appliances,
      usagePatterns,
      region,
      effectiveMarginalRate
    );

    return {
      currentUsage,
      currentCost,
      potentialUsage,
      potentialCost,
      energySavings,
      costSavings,
      carbonSavings,
      upgradeCosts,
      paybackPeriod,
      applianceSavings,
    };
  } catch (error) {
    console.error("Error in energy calculations:", error);
    throw new Error(
      "Failed to calculate energy costs. Please check your inputs."
    );
  }
};

const calculateCurrentUsage = (appliances, usagePatterns, region) => {
  let totalUsage = 0;
  appliances.forEach(({ type, count, age }) => {
    const power = appliancePower[type]?.[age] || 0;
    if (!power) return;
    totalUsage += power * count * getYearlyHours(type, usagePatterns, region);
  });
  return totalUsage;
};

const calculatePotentialUsage = (appliances, usagePatterns, region) => {
  let totalUsage = 0;
  appliances.forEach(({ type, count, age }) => {
    if (!appliancePower[type]) return;
    const best = getBestEfficiency(type);
    const power =
      age === best ? appliancePower[type][age] : appliancePower[type][best];
    totalUsage += power * count * getYearlyHours(type, usagePatterns, region);
  });
  return totalUsage;
};

const getYearlyHours = (type, usagePatterns, region = "riyadh") => {
  const regionData = regions[region] || regions.riyadh;
  const {
    seasons: s,
    defaultAcHours: acDef,
    defaultWaterHeaterHours: whDef,
  } = regionData;

  const daysInYear = 365;
  const summerDays = Math.round((s.summer / 12) * daysInYear);
  const winterDays = Math.round((s.winter / 12) * daysInYear);
  const shoulderDays = daysInYear - summerDays - winterDays;

  switch (type) {
    case "AC":
      return (
        (usagePatterns?.acSummerHours ?? acDef.summer) * summerDays +
        (usagePatterns?.acWinterHours ?? acDef.winter) * winterDays +
        (usagePatterns?.acSpringFallHours ?? acDef.shoulder) * shoulderDays
      );

    case "waterHeater":
      return (
        (usagePatterns?.waterHeaterSummerHours ?? whDef.summer) * summerDays +
        (usagePatterns?.waterHeaterWinterHours ?? whDef.winter) * winterDays +
        (usagePatterns?.waterHeaterSpringFallHours ?? whDef.shoulder) *
          shoulderDays
      );

    case "fridge":
      // Fridge compressor cycles daily; use actual user-provided hours/day
      return 365 * (usagePatterns?.fridgeHoursPerDay ?? 8);

    default:
      return 0;
  }
};

const getBestEfficiency = (type) => {
  switch (type) {
    case "AC":          return "inverter";
    case "fridge":      return "modern";
    case "waterHeater": return "solar";
    default:            return "new";
  }
};

const calculateElectricityCost = (totalKwh, propertyType) => {
  const rates = electricityRates[propertyType] || electricityRates.residential;
  let totalCost = 0;

  if (propertyType === "residential") {
    if (totalKwh <= 2000) {
      totalCost = totalKwh * rates.tier1;
    } else if (totalKwh <= 4000) {
      totalCost = 2000 * rates.tier1 + (totalKwh - 2000) * rates.tier2;
    } else if (totalKwh <= 6000) {
      totalCost =
        2000 * rates.tier1 +
        2000 * rates.tier2 +
        (totalKwh - 4000) * rates.tier3;
    } else {
      totalCost =
        2000 * rates.tier1 +
        2000 * rates.tier2 +
        2000 * rates.tier3 +
        (totalKwh - 6000) * rates.tier4;
    }
  } else if (propertyType === "commercial") {
    if (totalKwh <= 4000) {
      totalCost = totalKwh * rates.tier1;
    } else if (totalKwh <= 8000) {
      totalCost = 4000 * rates.tier1 + (totalKwh - 4000) * rates.tier2;
    } else {
      totalCost =
        4000 * rates.tier1 +
        4000 * rates.tier2 +
        (totalKwh - 8000) * rates.tier3;
    }
  }

  return totalCost;
};

const calculateUpgradeCosts = (appliances) => {
  let totalCost = 0;
  appliances.forEach(({ type, count, age }) => {
    const best = getBestEfficiency(type);
    if (age === best || !replacementCosts[type]) return;
    totalCost += (replacementCosts[type][best] || 0) * count;
  });
  return totalCost;
};

const calculateApplianceSavings = (
  appliances,
  usagePatterns,
  region,
  effectiveMarginalRate
) => {
  const savings = [];

  appliances.forEach(({ type, count, age }) => {
    if (!appliancePower[type]) return;
    const best = getBestEfficiency(type);
    if (age === best) return;

    const currentPower   = appliancePower[type][age] || 0;
    const potentialPower = appliancePower[type][best] || 0;
    const hours          = getYearlyHours(type, usagePatterns, region);

    const currentUsage   = currentPower   * count * hours;
    const potentialUsage = potentialPower * count * hours;
    const energySaved    = currentUsage - potentialUsage;

    // Use the real effective marginal rate instead of a flat tier2 guess
    const costSaved  = energySaved * effectiveMarginalRate;
    const upgradeCost =
      replacementCosts[type]?.[best] != null
        ? replacementCosts[type][best] * count
        : 0;
    const paybackPeriod = costSaved > 0 ? upgradeCost / costSaved : Infinity;

    savings.push({
      type,
      count,
      currentAge: age,
      recommendedUpgrade: best,
      energySaved,
      costSaved,
      upgradeCost,
      paybackPeriod,
    });
  });

  return savings.sort((a, b) => b.costSaved - a.costSaved);
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(Math.round(value));

export const formatYears = (years) => {
  if (!isFinite(years)) return "N/A";
  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months} month${months === 1 ? "" : "s"}`;
  }
  return `${years.toFixed(1)} year${years === 1 ? "" : "s"}`;
};
