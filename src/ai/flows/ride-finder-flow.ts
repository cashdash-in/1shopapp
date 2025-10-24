
'use server';
/**
 * @fileOverview A flow for finding and comparing ride-sharing options.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns simulated ride options.
 */

import type { RideFinderInput, RideFinderOutput } from '@/ai/schemas';

export async function findRides(
  input: RideFinderInput
): Promise<RideFinderOutput> {
  throw new Error('AI functionality is temporarily disabled due to a package installation issue. Please try again later.');
}
