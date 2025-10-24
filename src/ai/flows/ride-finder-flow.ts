
'use server';
/**
 * @fileOverview A flow for finding and comparing ride-sharing options.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns ride options.
 */

import type { RideFinderInput, RideFinderOutput, RideOption } from '@/ai/schemas';


// This function now calls a real, public dummy API to get simulated ride data.
// This demonstrates a complete, working example of fetching data from an external service.
async function getSimulatedFares(input: RideFinderInput): Promise<RideOption[]> {
    try {
        // We use a free, public API designed for testing and prototyping.
        const response = await fetch(`https://dummyjson.com/products/search?q=${input.pickup}+to+${input.dropoff}&limit=8`);
        
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();

        // --- Data Transformation ---
        // The dummy API returns product data, so we need to transform it into our RideOption format.
        // This is a common task when working with external APIs.
        const services: RideOption['service'][] = ['Uber', 'Ola', 'inDrive', 'Rapido'];
        const vehicleTypes = {
            Uber: ['Go', 'Premier', 'XL'],
            Ola: ['Mini', 'Sedan', 'Prime SUV'],
            inDrive: ['Car', 'SUV'],
            Rapido: ['Auto', 'Bike'],
        }

        return data.products.map((product: any, index: number): RideOption => {
            const service = services[index % services.length];
            const serviceVehicles = vehicleTypes[service];
            const vehicleType = serviceVehicles[Math.floor(Math.random() * serviceVehicles.length)];
            
            // Generate realistic-looking mock data based on the product price from the API.
            const baseFare = (product.price % 200) + 100; // Fare between 100 and 300
            const surgeMultiplier = Math.random() < 0.2 ? 1.5 : 1; // 20% chance of surge
            const finalFare = Math.round(baseFare * surgeMultiplier);

            return {
                service: service,
                vehicleType: vehicleType,
                eta: `${Math.floor(Math.random() * 10) + 2} min`, // ETA between 2-12 mins
                fare: `₹${finalFare}`,
                surge: surgeMultiplier > 1,
            };
        });

    } catch (error) {
        console.error("Failed to fetch simulated fares:", error);
        // If the API fails, we return an empty array to prevent the app from crashing.
        return [];
    }
}


export async function findRides(
  input: RideFinderInput
): Promise<RideFinderOutput> {
  
  console.log(`Finding rides for pickup: "${input.pickup}" and dropoff: "${input.dropoff}"`);

  // Call the function to get data from the live (but simulated) API.
  const options = await getSimulatedFares(input);

  // If the API call fails or returns no data, we can provide a fallback or simply return empty.
  if (options.length === 0) {
      console.log("Could not fetch live simulated data. Returning empty.");
  }

  return { options };
}
