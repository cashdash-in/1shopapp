
'use server';
/**
 * @fileOverview A flow for finding and comparing ride-sharing options.
 *
 * - findRides - A function that returns simulated ride-sharing data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  type RideFinderInput,
  RideFinderInputSchema,
  RideFinderOutputSchema,
  type RideFinderOutput,
} from '../schemas';

export async function findRides(input: RideFinderInput): Promise<RideFinderOutput> {
  return findRidesFlow(input);
}

const rideFinderPrompt = ai.definePrompt({
  name: 'rideFinderPrompt',
  input: { schema: RideFinderInputSchema },
  output: { schema: RideFinderOutputSchema },
  prompt: `
    You are a ride-sharing fare aggregator API. Your task is to generate realistic, dynamic, and varied ride options based on the user's pickup and drop-off locations.

    User Request:
    - Pickup: {{{pickup}}}
    - Drop-off: {{{dropoff}}}

    Your Response MUST include options from Uber, Ola, and inDrive.
    For each service, provide a variety of vehicle types (e.g., Auto, Mini, Sedan, SUV).
    - Fares should be in Indian Rupees (₹) and presented as a realistic range (e.g., "₹120 - ₹150").
    - ETAs (Estimated Time of Arrival) should be varied and plausible (e.g., "2-4 min", "5 min", "6-8 min").
    - Randomly apply surge pricing to one or two options to simulate real-world conditions. When surge is true, make the fare noticeably higher than other similar options.
    - Ensure the output is a valid JSON object adhering to the specified output schema. Do not include any extra text or explanations outside of the JSON structure.
  `,
});

const findRidesFlow = ai.defineFlow(
  {
    name: 'findRidesFlow',
    inputSchema: RideFinderInputSchema,
    outputSchema: RideFinderOutputSchema,
  },
  async (input) => {
    const { output } = await rideFinderPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate ride options.');
    }
    return output;
  }
);
