'use server';
/**
 * @fileOverview A flow for finding ride-sharing options with realistic simulation logic.
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
 */
function simulateDistance(pickup: string, dropoff: string): number {
  const combinedLength = pickup.length + dropoff.length;
  let distance = 2 + (combinedLength / 120) * 28;
  if (combinedLength < 25) distance = Math.min(distance, 8);
  return Math.max(2.5, Math.min(35, distance)); 
}

/**
 * Checks if current time falls within Indian peak hour windows.
 */
function isPeakTime(): boolean {
    const now = new Date();
    const istTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const hour = istTime.getHours();
    const day = istTime.getDay();
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

  // Traffic Factor: 1.0 (Normal) to 1.8 (Heavy)
  const trafficFactor = peakTime ? 1.4 + Math.random() * 0.4 : 1.0 + Math.random() * 0.2;

  for (const service of services) {
    for (const vehicle of service.vehicleTypes) {
      // Base fare calculation
      let fare = (vehicle.baseFare + (simulatedDistance * vehicle.ratePerKm)) * trafficFactor;
      
      // Service specific variations
      if (service.service === 'Uber' && peakTime) fare *= 1.05;
      if (service.service === 'inDrive') fare *= 0.9;

      // Random fluctuation (+/- 3%)
      fare += (Math.random() - 0.5) * (fare * 0.06);

      // Surge pricing simulation (15% chance)
      const surge = Math.random() < 0.15;
      if (surge) fare *= 1.6;

      const finalFare = Math.round(fare / 5) * 5;
      
      // ETA calculation: ~4 mins base + traffic impact
      const baseEta = 4 + Math.floor(simulatedDistance / 3);
      const trafficDelay = Math.floor((trafficFactor - 1) * 10);
      const etaMinutes = baseEta + trafficDelay + Math.floor(Math.random() * 3);

      options.push({
        service: service.service,
        vehicleType: vehicle.type,
        eta: `${Math.max(3, etaMinutes - 1)}-${etaMinutes + 2} min`,
        fare: `₹${finalFare}`,
        surge: surge,
      });
    }
  }

  return { options };
}
