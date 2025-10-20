
'use server';
/**
 * @fileOverview A flow for finding and comparing ride-sharing options.
 *
 * - findRides - A function that returns simulated ride-sharing data.
 */
import type { RideFinderInput, RideFinderOutput } from '../schemas';

const AI_DISABLED_ERROR = 'AI functionality is temporarily disabled due to a package installation issue. Please try again later.';

export async function findRides(input: RideFinderInput): Promise<RideFinderOutput> {
    throw new Error(AI_DISABLED_ERROR);
}
