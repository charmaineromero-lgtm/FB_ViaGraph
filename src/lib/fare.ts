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
