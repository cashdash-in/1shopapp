
'use server';
/**
 * @fileOverview A flow for finding and comparing ride-sharing options.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns ride options.
 */

import type { RideFinderInput, RideFinderOutput, RideOption } from '@/ai/schemas';


// This function now generates more realistic mock data locally.
function generateMockFares(input: RideFinderInput): RideOption[] {
    const services: RideOption['service'][] = ['Uber', 'Ola', 'inDrive', 'Rapido'];
    
    // Define base fares for different vehicle types to make pricing more realistic
    const baseFares: Record<string, number> = {
        'Go': 120, 'Premier': 180, 'XL': 250, // Uber
        'Mini': 110, 'Sedan': 170, 'Prime SUV': 240, // Ola
        'Car': 150, 'SUV': 220, // inDrive
        'Auto': 80, 'Bike': 50, // Rapido
    };
    
    const vehicleTypes: Record<RideOption['service'], string[]> = {
        Uber: ['Go', 'Premier', 'XL'],
        Ola: ['Mini', 'Sedan', 'Prime SUV'],
        inDrive: ['Car', 'SUV'],
        Rapido: ['Auto', 'Bike'],
    };

    let allOptions: RideOption[] = [];

    services.forEach(service => {
        const serviceVehicles = vehicleTypes[service];
        
        serviceVehicles.forEach(vehicleType => {
            // Add a chance for a vehicle type to not be available
            if (Math.random() < 0.1) return;

            const baseFare = baseFares[vehicleType] || 150;
            // Add a smaller, more controlled random element to the fare
            const fareVariation = Math.floor(Math.random() * 30) - 15; // +/- 15
            
            const surgeMultiplier = Math.random() < 0.2 ? 1.5 : 1; // 20% chance of surge
            const finalFare = Math.round((baseFare + fareVariation) * surgeMultiplier);
            const eta = Math.floor(Math.random() * 10) + 2; // ETA between 2-12 mins

            allOptions.push({
                service: service,
                vehicleType: vehicleType,
                eta: `${eta} min`,
                fare: `₹${finalFare}`,
                surge: surgeMultiplier > 1,
            });
        });
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
