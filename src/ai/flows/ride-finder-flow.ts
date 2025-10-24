
'use server';
/**
 * @fileOverview A flow for finding and comparing ride-sharing options.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns ride options.
 */

import type { RideFinderInput, RideFinderOutput, RideOption } from '@/ai/schemas';


// This function now generates mock data locally to ensure a reliable simulation.
// It no longer calls an external API.
function generateMockFares(input: RideFinderInput): RideOption[] {
    const services: RideOption['service'][] = ['Uber', 'Ola', 'inDrive', 'Rapido'];
    const vehicleTypes: Record<RideOption['service'], string[]> = {
        Uber: ['Go', 'Premier', 'XL'],
        Ola: ['Mini', 'Sedan', 'Prime SUV'],
        inDrive: ['Car', 'SUV'],
        Rapido: ['Auto', 'Bike'],
    };

    let allOptions: RideOption[] = [];

    services.forEach(service => {
        const numOptions = Math.floor(Math.random() * 3) + 1; // 1 to 3 options per service
        for (let i = 0; i < numOptions; i++) {
            const serviceVehicles = vehicleTypes[service];
            const vehicleType = serviceVehicles[i] || serviceVehicles[0];

            // Generate realistic-looking mock data
            const baseFare = Math.floor(Math.random() * 250) + 100; // Fare between 100 and 350
            const surgeMultiplier = Math.random() < 0.2 ? 1.5 : 1; // 20% chance of surge
            const finalFare = Math.round(baseFare * surgeMultiplier);
            const eta = Math.floor(Math.random() * 10) + 2; // ETA between 2-12 mins

            allOptions.push({
                service: service,
                vehicleType: vehicleType,
                eta: `${eta} min`,
                fare: `₹${finalFare}`,
                surge: surgeMultiplier > 1,
            });
        }
    });

    return allOptions;
}


export async function findRides(
  input: RideFinderInput
): Promise<RideFinderOutput> {
  
  console.log(`Finding rides for pickup: "${input.pickup}" and dropoff: "${input.dropoff}"`);

  // Generate mock data locally for a reliable user experience.
  const options = generateMockFares(input);

  return { options };
}
