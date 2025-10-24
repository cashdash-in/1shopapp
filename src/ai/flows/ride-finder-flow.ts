'use server';
/**
 * @fileOverview A flow for finding ride-sharing options.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns simulated ride options.
 */

import type { RideFinderInput, RideFinderOutput, RideOption } from '../schemas';

const services = [
  {
    service: 'Uber',
    vehicleTypes: [
      { type: 'Uber Go', baseFare: 50, ratePerKm: 12, capacity: 4 },
      { type: 'Premier', baseFare: 70, ratePerKm: 15, capacity: 4 },
      { type: 'UberXL', baseFare: 90, ratePerKm: 18, capacity: 6 },
    ],
  },
  {
    service: 'Ola',
    vehicleTypes: [
      { type: 'Mini', baseFare: 45, ratePerKm: 11, capacity: 4 },
      { type: 'Sedan', baseFare: 65, ratePerKm: 14, capacity: 4 },
      { type: 'Prime SUV', baseFare: 85, ratePerKm: 17, capacity: 6 },
    ],
  },
  {
    service: 'inDrive',
    vehicleTypes: [
      { type: 'Standard', baseFare: 40, ratePerKm: 10, capacity: 4 },
    ],
  },
  {
    service: 'Rapido',
    vehicleTypes: [
      { type: 'Bike', baseFare: 25, ratePerKm: 8, capacity: 1 },
      { type: 'Auto', baseFare: 40, ratePerKm: 10, capacity: 3 },
    ],
  },
] as const;

function simulateDistance(pickup: string, dropoff: string): number {
  // Simple simulation: longer location names imply longer distance
  const combinedLength = pickup.length + dropoff.length;
  // Map string length to a plausible km range, e.g., 20-100 chars -> 3-25 km
  const distance = 3 + (combinedLength / 120) * 22;
  return Math.max(3, Math.min(25, distance)); // Clamp between 3km and 25km
}

function isPeakTime(): boolean {
    const now = new Date();
    // Use Indian Standard Time for simulation
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hour = istTime.getHours();
    // Peak hours: 8-11 AM and 5-9 PM
    return (hour >= 8 && hour < 11) || (hour >= 17 && hour < 21);
}

export async function findRides(
  input: RideFinderInput
): Promise<RideFinderOutput> {
  const { pickup, dropoff } = input;
  const options: RideOption[] = [];
  const simulatedDistance = simulateDistance(pickup, dropoff);
  const peakTime = isPeakTime();

  for (const service of services) {
    for (const vehicle of service.vehicleTypes) {
      // 1. Base fare calculation
      let fare = vehicle.baseFare + (simulatedDistance * vehicle.ratePerKm);
      
      // 2. Add peak time surcharge
      if (peakTime) {
          fare *= 1.25; // 25% peak time surcharge
      }

      // 3. Add small random variation
      fare += Math.random() * 10 - 5; // +/- 5 rupees

      // 4. Simulate surge pricing (20% chance)
      const surge = Math.random() < 0.2;
      if (surge) {
        fare *= 1.5; // 50% surge multiplier
      }

      const finalFare = Math.round(fare / 5) * 5; // Round to nearest 5 rupees
      
      const etaMinutes = 5 + Math.floor(simulatedDistance / 2) + Math.floor(Math.random() * 5);


      options.push({
        service: service.service,
        vehicleType: vehicle.type,
        eta: `${etaMinutes - 2}-${etaMinutes + 3} min`,
        fare: `₹${finalFare - 10}-₹${finalFare + 15}`,
        surge: surge,
      });
    }
  }

  return { options };
}
