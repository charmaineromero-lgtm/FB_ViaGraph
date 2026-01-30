/**
 * This file contains fare calculation logic based on the LTFRB fare matrix
 * for Traditional PUJ (Mega Manila), effective October 8, 2023.
 * The data is derived from the JSON provided by the user.
 */

// Rules derived from the provided LTFRB JSON data.
const fareRules = {
  base: {
    first_km_covered: 4,
    regular_fare: 13.0,
  },
  succeeding_km_addon: {
    regular_per_km: 1.8,
  },
  discount_percentage: 0.20,
  rounding: {
    increment: 0.25,
  },
};

/**
 * Rounds a number to the nearest quarter (0.25).
 * e.g., roundToNearestQuarter(14.8) => 14.75
 * e.g., roundToNearestQuarter(18.4) => 18.50
 * @param value The number to round.
 * @returns The rounded number.
 */
function roundToNearestQuarter(value: number): number {
  return Math.round(value / fareRules.rounding.increment) * fareRules.rounding.increment;
}

/**
 * Calculates the regular fare based on the distance, according to LTFRB rules.
 * @param distance in kilometers
 * @returns the calculated and rounded regular fare
 */
export function calculateFare(distance: number): number {
  if (distance <= 0) {
    return 0;
  }
  
  if (distance <= fareRules.base.first_km_covered) {
    // Base fare for the first 4km.
    return fareRules.base.regular_fare;
  }
  
  const additionalDistance = distance - fareRules.base.first_km_covered;
  const rawFare = fareRules.base.regular_fare + (additionalDistance * fareRules.succeeding_km_addon.regular_per_km);
  
  return roundToNearestQuarter(rawFare);
}

/**
 * Calculates the discounted fare for students, seniors, and PWDs.
 * The 20% discount is applied, and the result is rounded to the nearest ₱0.25.
 * @param distance in kilometers
 * @returns the calculated and rounded discounted fare
 */
export function calculateDiscountedFare(distance: number): number {
  if (distance <= 0) {
    return 0;
  }

  // Calculate the raw regular fare *before* rounding
  let rawRegularFare: number;
  if (distance <= fareRules.base.first_km_covered) {
    rawRegularFare = fareRules.base.regular_fare;
  } else {
    const additionalDistance = distance - fareRules.base.first_km_covered;
    rawRegularFare = fareRules.base.regular_fare + (additionalDistance * fareRules.succeeding_km_addon.regular_per_km);
  }

  // Apply 20% discount to the un-rounded regular fare
  const rawDiscountedFare = rawRegularFare * (1 - fareRules.discount_percentage);

  // Round the final discounted value to the nearest quarter
  return roundToNearestQuarter(rawDiscountedFare);
}
