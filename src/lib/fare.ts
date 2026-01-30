export type FareMatrix = {
  baseFare: number; // in PHP
  baseDistance: number; // in km
  perKm: number; // price per additional km
};

// Based on the LTFRB fare guide effective October 8, 2023.
export const fareMatrix: FareMatrix = {
  baseFare: 13,
  baseDistance: 4,
  perKm: 1.8,
};

/**
 * Calculates the fare based on the distance.
 * @param distance in kilometers
 * @returns the calculated fare
 */
export function calculateFare(distance: number): number {
  if (distance <= 0) {
    return 0;
  }
  if (distance <= fareMatrix.baseDistance) {
    return fareMatrix.baseFare;
  }
  const additionalDistance = distance - fareMatrix.baseDistance;
  // Round up to the next kilometer for additional distance
  return fareMatrix.baseFare + Math.ceil(additionalDistance) * fareMatrix.perKm;
}

/**
 * Calculates the discounted fare for students, seniors, and PWDs.
 * @param distance in kilometers
 * @returns the calculated discounted fare
 */
export function calculateDiscountedFare(distance: number): number {
  const discountedBaseFare = 11.00; // As per LTFRB guide
  const discountPercentage = 0.20;

  if (distance <= 0) {
    return 0;
  }
  if (distance <= fareMatrix.baseDistance) {
    return discountedBaseFare;
  }

  const regularFare = calculateFare(distance);
  // The 20% discount is applied to the regular fare for distances beyond the base.
  const discountedFare = regularFare * (1 - discountPercentage);
  return discountedFare;
}
