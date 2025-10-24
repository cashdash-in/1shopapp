
'use server';
/**
 * @fileOverview A flow for estimating ride-sharing fares.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns estimated ride options.
 */
import type { RideFinderInput, RideFinderOutput, RideOption } from '@/ai/schemas';

// Helper function to generate a random fare within a plausible range
const generateFare = (base: number, range: number): string => {
  const fare = base + Math.random() * range;
  return `₹${fare.toFixed(0)}`;
};

// Helper function to generate a random ETA
const generateEta = (min: number, max: number): string => {
    return `${Math.floor(min + Math.random() * (max - min))} min`;
}

export async function findRides(
  input: RideFinderInput
): Promise<RideFinderOutput> {
  // This is a mock implementation and does not call any real service.
  // It generates realistic-looking data for demonstration purposes.

  const isSurge = Math.random() < 0.2; // 20% chance of surge pricing
  const surgeMultiplier = isSurge ? 1.5 : 1.0;

  const options: RideOption[] = [
    // Uber
    { service: 'Uber', vehicleType: 'Go', fare: generateFare(120 * surgeMultiplier, 30), eta: generateEta(5, 10), surge: isSurge },
    { service: 'Uber', vehicleType: 'Premier', fare: generateFare(160 * surgeMultiplier, 40), eta: generateEta(6, 12), surge: isSurge },
    { service: 'Uber', vehicleType: 'XL', fare: generateFare(200 * surgeMultiplier, 50), eta: generateEta(8, 15), surge: isSurge },
    // Ola
    { service: 'Ola', vehicleType: 'Mini', fare: generateFare(115 * surgeMultiplier, 30), eta: generateEta(5, 10), surge: isSurge },
    { service: 'Ola', vehicleType: 'Sedan', fare: generateFare(155 * surgeMultiplier, 40), eta: generateEta(6, 12), surge: isSurge },
    { service: 'Ola', vehicleType: 'Prime SUV', fare: generateFare(210 * surgeMultiplier, 50), eta: generateEta(8, 15), surge: isSurge },
    // inDrive
    { service: 'inDrive', vehicleType: 'Car', fare: generateFare(110 * surgeMultiplier, 25), eta: generateEta(7, 14), surge: isSurge },
    // Rapido
    { service: 'Rapido', vehicleType: 'Bike', fare: generateFare(60 * surgeMultiplier, 15), eta: generateEta(3, 8), surge: isSurge },
    { service: 'Rapido', vehicleType: 'Auto', fare: generateFare(90 * surgeMultiplier, 20), eta: generateEta(4, 9), surge: isSurge },
  ];

  return Promise.resolve({ options });
}
