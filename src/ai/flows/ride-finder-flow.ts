'use server';
/**
 * @fileOverview A flow for finding and comparing ride-sharing options.
 */
import type { RideFinderInput, RideFinderOutput } from '../schemas';

const errorMessage = 'AI functionality is temporarily disabled due to a package installation issue. Please try again later.';

export async function findRides(
  input: RideFinderInput
): Promise<RideFinderOutput> {
  throw new Error(errorMessage);
}
