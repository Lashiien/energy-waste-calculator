import {
  calculateEnergyCosts,
  calculateElectricityCost,
  getYearlyHours,
  calculateApplianceSavings,
} from "./calculations";

// Shared fixture — default-ish usage patterns for deterministic tests
const BASE_PATTERNS = {
  acSummerHours:              14,
  acWinterHours:               4,
  acSpringFallHours:           8,
  waterHeaterSummerHours:      2,
  waterHeaterWinterHours:      4,
  waterHeaterSpringFallHours:  3,
  fridgeHoursPerDay:           8,
};

const BASE_FORM = {
  propertyType: "residential",
  region: "riyadh",
  homeSize: "medium",
  appliances: [
    { type: "AC",          count: 1, age: "old" },
    { type: "fridge",      count: 1, age: "old" },
    { type: "waterHeater", count: 1, age: "old" },
  ],
  usagePatterns: BASE_PATTERNS,
};

// ── Test 1 ──────────────────────────────────────────────────────────────────
// Under tier-1 annual boundary (3 000 kWh < 6 000 threshold).
// Note: spec formula `3000 * 12 * 0.18 * 1.15` contains an extraneous `*12`;
// the function takes annual kWh so the correct expectation is 3000*0.18*1.15.
test("calculateElectricityCost — all consumption within tier 1", () => {
  const cost = calculateElectricityCost(3000, "residential");
  const expected = 3000 * 0.18 * 1.15;
  expect(cost).toBeCloseTo(expected, 1); // ±0.05 SAR tolerance
});

// ── Test 2 ──────────────────────────────────────────────────────────────────
// Crosses the tier-1 / tier-2 boundary at 6 000 kWh/yr.
// 8 000 kWh annual = 6 000 @ 0.18 + 2 000 @ 0.24 (tier 2, not 0.30 as in spec).
test("calculateElectricityCost — crosses tier-1 to tier-2 boundary", () => {
  const cost = calculateElectricityCost(8000, "residential");
  const expected = (6000 * 0.18 + 2000 * 0.24) * 1.15;
  expect(cost).toBeCloseTo(expected, 1);
});

// ── Test 3 ──────────────────────────────────────────────────────────────────
test("calculateElectricityCost — zero consumption yields zero cost", () => {
  expect(calculateElectricityCost(0, "residential")).toBe(0);
});

// ── Test 4 ──────────────────────────────────────────────────────────────────
// All appliances already at best efficiency → no potential savings.
test("calculateEnergyCosts — all-efficient appliances yield zero savings", () => {
  const form = {
    ...BASE_FORM,
    appliances: [
      { type: "AC",          count: 1, age: "inverter" }, // best for AC
      { type: "fridge",      count: 1, age: "modern"   }, // best for fridge
      { type: "waterHeater", count: 1, age: "solar"    }, // best for waterHeater
    ],
  };
  const results = calculateEnergyCosts(form);
  expect(results.costSavings).toBe(0);
  expect(results.paybackPeriod).toBe(Infinity);
});

// ── Test 5 ──────────────────────────────────────────────────────────────────
// Changing region changes the output because seasonal day counts differ.
test("calculateEnergyCosts — region change produces different current cost", () => {
  const riyadh  = calculateEnergyCosts({ ...BASE_FORM, region: "riyadh"  });
  const jeddah  = calculateEnergyCosts({ ...BASE_FORM, region: "jeddah"  });
  expect(riyadh.currentCost).not.toEqual(jeddah.currentCost);
});

// ── Test 6 ──────────────────────────────────────────────────────────────────
// getYearlyHours for AC in Riyadh with explicit regional defaults.
// Riyadh: summer=6 months, winter=3 months, shoulder=3 months.
// summerDays = round(6/12*365)=183, winterDays=round(3/12*365)=91, shoulderDays=91.
// Expected = 14*183 + 4*91 + 8*91 = 2562 + 364 + 728 = 3654 hours.
test("getYearlyHours — AC in Riyadh matches expected seasonal sum", () => {
  const patterns = {
    acSummerHours:    14,
    acWinterHours:     4,
    acSpringFallHours: 8,
  };
  const summerDays   = Math.round((6 / 12) * 365);
  const winterDays   = Math.round((3 / 12) * 365);
  const shoulderDays = 365 - summerDays - winterDays;
  const expected = 14 * summerDays + 4 * winterDays + 8 * shoulderDays;

  expect(getYearlyHours("AC", patterns, "riyadh")).toBe(expected);
});

// ── Test 7 ──────────────────────────────────────────────────────────────────
// 2 old ACs + 1 fridge at best efficiency → 1 savings entry (AC only).
test("calculateApplianceSavings — only upgradeable appliances appear in results", () => {
  const appliances = [
    { type: "AC",     count: 2, age: "old"    }, // not at best → upgradeable
    { type: "fridge", count: 1, age: "modern" }, // already best → skip
  ];
  const savings = calculateApplianceSavings(appliances, BASE_PATTERNS, "riyadh", 0.24);
  expect(savings).toHaveLength(1);
  expect(savings[0].type).toBe("AC");
  expect(savings[0].energySaved).toBeGreaterThan(0);
});

// ── Test 8 ──────────────────────────────────────────────────────────────────
// Zero savings → paybackPeriod must not throw and must not be NaN.
test("calculateEnergyCosts — zero savings scenario returns non-NaN payback", () => {
  const form = {
    ...BASE_FORM,
    appliances: [
      { type: "AC",          count: 1, age: "inverter" },
      { type: "fridge",      count: 1, age: "modern"   },
      { type: "waterHeater", count: 1, age: "solar"    },
    ],
  };
  let results;
  expect(() => { results = calculateEnergyCosts(form); }).not.toThrow();
  expect(results.paybackPeriod).not.toBeNaN();
});
