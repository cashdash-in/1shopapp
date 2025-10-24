
'use server';
/**
 * @fileOverview A flow for finding and comparing ride-sharing options.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns simulated ride options.
 */

import type { RideFinderInput, RideFinderOutput } from '@/ai/schemas';

// Helper function to generate a random integer within a range
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to generate a believable fare
const generateFare = (base: number) => {
    const randomFactor = 1 + (Math.random() - 0.5) * 0.4; // +/- 20%
    const rawFare = base * randomFactor;
    return `₹${Math.round(rawFare / 5) * 5}`; // Round to nearest 5
}

export async function findRides(
  input: RideFinderInput
): Promise<RideFinderOutput> {
  // This is a non-AI simulation. It generates realistic-looking data without external calls.
  console.log(`Simulating rides for pickup: "${input.pickup}" and dropoff: "${input.dropoff}"`);

  const services = {
    Uber: [
      { vehicleType: 'Auto', baseFare: 120 },
      { vehicleType: 'Go', baseFare: 180 },
      { vehicleType: 'Premier', baseFare: 250 },
    ],
    Ola: [
      { vehicleType: 'Auto', baseFare: 115 },
      { vehicleType: 'Mini', baseFare: 170 },
      { vehicleTye: 'Sedan', baseFare: 240 },
    ],
    inDrive: [
        { vehicleType: 'Auto', baseFare: 110 },
        { vehicleType: 'Car', baseFare: 160 },
    ],
    Rapido: [
        { vehicleType: 'Auto', baseFare: 100 },
        { vehicleType: 'Bike', baseFare: 80 },
    ]
  };

  const options: RideFinderOutput['options'] = [];

  for (const [serviceName, vehicles] of Object.entries(services)) {
    for (const vehicle of vehicles) {
      // Simulate 1 to 3 options for each service
      const numberOfOptions = getRandomInt(1,2);
      for (let i = 0; i < numberOfOptions; i++) {
          // Don't add duplicates of the same vehicle type for a service
          if (options.some(o => o.service === serviceName && o.vehicleType === vehicle.vehicleType)) continue;

           options.push({
                service: serviceName as 'Uber' | 'Ola' | 'inDrive',
                vehicleType: vehicle.vehicleType,
                eta: `${getRandomInt(2, 15)} min`,
                fare: generateFare(vehicle.baseFare),
                surge: Math.random() < 0.2, // 20% chance of surge
            });
      }
    }
  }

  // A short, realistic delay to simulate API calls
  await new Promise(resolve => setTimeout(resolve, 1500));

  return { options };
}
