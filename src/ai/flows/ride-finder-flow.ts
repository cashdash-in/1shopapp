'use server';
/**
 * @fileOverview A flow for estimating ride-sharing fares using a local simulation.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns simulated ride options.
 */

import type { RideFinderInput, RideFinderOutput, RideOption } from '@/ai/schemas';

// Base fares for different vehicle types to make simulation more realistic
const baseFares = {
    'Uber Go': 120,
    'Uber Premier': 180,
    'Ola Mini': 110,
    'Ola Sedan': 170,
    'inDrive': 100,
    'Rapido Bike': 60,
    'Rapido Auto': 90,
};

// All possible vehicle types and their services
const vehicleTypes: { service: 'Uber' | 'Ola' | 'inDrive' | 'Rapido'; type: string }[] = [
    { service: 'Uber', type: 'Uber Go' },
    { service: 'Uber', type: 'Uber Premier' },
    { service: 'Ola', type: 'Ola Mini' },
    { service: 'Ola', type: 'Ola Sedan' },
    { service: 'inDrive', type: 'inDrive' },
    { service: 'Rapido', type: 'Rapido Bike' },
    { service: 'Rapido', type: 'Rapido Auto' },
];

export async function findRides(
  input: RideFinderInput
): Promise<RideFinderOutput> {
    const options: RideOption[] = vehicleTypes.map(vehicle => {
        const baseFare = baseFares[vehicle.type as keyof typeof baseFares] || 150;
        
        // Add a random variation between -20 and +40 to the base fare
        const fareVariation = Math.floor(Math.random() * 61) - 20;
        let finalFare = baseFare + fareVariation;

        // 20% chance of surge pricing
        const isSurge = Math.random() < 0.2;
        if (isSurge) {
            // Apply a surge multiplier between 1.2x and 1.5x
            const surgeMultiplier = 1.2 + Math.random() * 0.3;
            finalFare = Math.round(finalFare * surgeMultiplier);
        }

        // Generate a random ETA between 3 and 15 minutes
        const eta = `${Math.floor(Math.random() * 13) + 3}-${Math.floor(Math.random() * 5) + 10} min`;

        return {
            service: vehicle.service,
            vehicleType: vehicle.type,
            eta: eta,
            fare: `₹${finalFare}`,
            surge: isSurge,
        };
    });

    return { options };
}
