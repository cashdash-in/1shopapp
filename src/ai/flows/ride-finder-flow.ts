
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
      { type: 'Uber Go', baseFare: 55, ratePerKm: 14.5, capacity: 4 },
      { type: 'Premier', baseFare: 75, ratePerKm: 18.2, capacity: 4 },
      { type: 'UberXL', baseFare: 110, ratePerKm: 22.5, capacity: 6 },
    ],
  },
  {
    service: 'Ola',
    vehicleTypes: [
      { type: 'Mini', baseFare: 50, ratePerKm: 13.8, capacity: 4 },
      { type: 'Sedan', baseFare: 70, ratePerKm: 17.5, capacity: 4 },
      { type: 'Prime SUV', baseFare: 100, ratePerKm: 21.0, capacity: 6 },
    ],
  },
  {
    service: 'inDrive',
    vehicleTypes: [
      { type: 'Standard', baseFare: 45, ratePerKm: 12.5, capacity: 4 },
    ],
  },
  {
    service: 'Rapido',
    vehicleTypes: [
      { type: 'Bike', baseFare: 25, ratePerKm: 9.5, capacity: 1 },
      { type: 'Auto', baseFare: 45, ratePerKm: 12.0, capacity: 3 },
    ],
  },
] as const;

/**
 * Simulates a realistic distance (in km) based on the input strings.
 * In a real app, this would call a Maps API (Directions Service).
 */
function simulateDistance(pickup: string, dropoff: string): number {
  const combinedLength = pickup.length + dropoff.length;
  // Map string length to a plausible range: 20 chars -> ~5km, 100 chars -> ~25km
  let distance = 2 + (combinedLength / 120) * 28;
  
  // Basic heuristic: if names are short, assume short intra-city trip
  if (combinedLength < 25) distance = Math.min(distance, 8);
  
  return Math.max(2.5, Math.min(35, distance)); 
}

function isPeakTime(): boolean {
    const now = new Date();
    // Indian Standard Time (IST)
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hour = istTime.getHours();
    const day = istTime.getDay(); // 0 is Sunday
    
    // Morning Rush: 8:30 AM - 11 AM
    // Evening Rush: 5:30 PM - 9 PM
    const isWeekday = day >= 1 && day <= 5;
    const isMorningRush = hour >= 8 && hour < 11;
    const isEveningRush = hour >= 17 && hour < 21;
    
    return isWeekday && (isMorningRush || isEveningRush);
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
      
      // 2. Add peak time surcharge (simulating traffic/demand)
      if (peakTime) {
          fare *= 1.35; // 35% peak time surcharge
      } else {
          // Off-peak slight discount simulation
          fare *= 0.95;
      }

      // 3. Service specific variations (Uber is often slightly more expensive in peak)
      if (service.service === 'Uber' && peakTime) fare *= 1.05;
      if (service.service === 'inDrive') fare *= 0.9; // Often cheaper as its bid-based

      // 4. Random fluctuation (+/- 3%)
      fare += (Math.random() - 0.5) * (fare * 0.06);

      // 5. Simulate surge pricing (15% chance)
      const surge = Math.random() < 0.15;
      if (surge) {
        fare *= 1.6; // 60% surge multiplier
      }

      const finalFare = Math.round(fare / 5) * 5; // Round to nearest 5 rupees
      
      // ETA calculation: ~3-5 mins base + 1 min per 2km
      const etaMinutes = 4 + Math.floor(simulatedDistance / 3) + Math.floor(Math.random() * 4);

      options.push({
        service: service.service,
        vehicleType: vehicle.type,
        eta: `${Math.max(3, etaMinutes - 2)}-${etaMinutes + 3} min`,
        fare: `₹${finalFare - 10}-₹${finalFare + 20}`,
        surge: surge,
      });
    }
  }

  return { options };
}
