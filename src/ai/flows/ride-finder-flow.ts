
'use server';
/**
 * @fileOverview A flow for estimating ride-sharing fares using a local simulation.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns simulated ride options.
 */

import type { RideFinderInput, RideFinderOutput, RideOption } from '@/ai/schemas';

// Base fares and per-km rates for different vehicle types
const vehicleConfig = {
    'Uber Go': { base: 50, ratePerKm: 12 },
    'Uber Premier': { base: 70, ratePerKm: 16 },
    'Ola Mini': { base: 45, ratePerKm: 11 },
    'Ola Sedan': { base: 65, ratePerKm: 15 },
    'inDrive': { base: 40, ratePerKm: 10 },
    'Rapido Bike': { base: 25, ratePerKm: 7 },
    'Rapido Auto': { base: 35, ratePerKm: 9 },
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
    
    // 1. Simulate a distance based on the length of the input strings
    const simulatedDistance = (input.pickup.length + input.dropoff.length) / 2; // Average length as a proxy for distance

    // 2. Check if it's peak time to add a surcharge
    const now = new Date();
    const currentHour = now.getHours();
    const isPeakTime = (currentHour >= 8 && currentHour <= 10) || (currentHour >= 17 && currentHour <= 20);
    const peakTimeSurcharge = isPeakTime ? 1.2 : 1.0; // 20% surcharge for peak hours

    const options: RideOption[] = vehicleTypes.map(vehicle => {
        const config = vehicleConfig[vehicle.type as keyof typeof vehicleConfig];
        
        // Calculate a base fare based on simulated distance and vehicle type
        let calculatedFare = config.base + (config.ratePerKm * simulatedDistance);

        // Apply peak time surcharge
        calculatedFare *= peakTimeSurcharge;

        // Add a small random variation to make it look dynamic
        const fareVariation = (Math.random() - 0.5) * 20; // Random value between -10 and +10
        let finalFare = Math.round(calculatedFare + fareVariation);

        // 15% chance of surge pricing on top of everything
        const isSurge = Math.random() < 0.15;
        if (isSurge) {
            const surgeMultiplier = 1.2 + Math.random() * 0.4; // Surge between 1.2x and 1.6x
            finalFare = Math.round(finalFare * surgeMultiplier);
        }

        // Ensure fare is not below a minimum for that vehicle type
        finalFare = Math.max(finalFare, config.base + 20);
        
        // Generate a plausible ETA
        const baseEta = Math.round(simulatedDistance * 1.5); // ETA based on distance
        const eta = `${Math.max(3, baseEta - 2)}-${baseEta + 5} min`;

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
