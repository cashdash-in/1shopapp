
'use server';
/**
 * @fileOverview A flow for finding and comparing ride-sharing options.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns simulated ride options.
 */

import { ai } from '@/ai/genkit';
import {
  RideFinderInputSchema,
  RideFinderOutputSchema,
  type RideFinderInput,
  type RideFinderOutput,
} from '@/ai/schemas';

export async function findRides(
  input: RideFinderInput
): Promise<RideFinderOutput> {
  return await findRidesFlow(input);
}

const rideFinderPrompt = ai.definePrompt({
  name: 'rideFinderPrompt',
  input: { schema: RideFinderInputSchema },
  output: { schema: RideFinderOutputSchema },
  prompt: `You are a ride-sharing price comparison assistant.
    Given a pickup location and a dropoff location, simulate the ride options available from Uber, Ola, and inDrive in India.

    Your response should look like a real API response. Provide 2-3 vehicle options for each service (e.g., Auto, Sedan, SUV).
    For each option, provide:
    - vehicleType: The type of vehicle.
    - eta: A realistic estimated time of arrival (e.g., "5-7 mins").
    - fare: A realistic price in Indian Rupees (e.g., "₹150 - ₹180").
    - surge: A boolean indicating if surge pricing is active. Apply surge pricing randomly and realistically, especially if the prompt implies high demand (e.g., "airport", "midnight").

    Pickup: {{{pickup}}}
    Dropoff: {{{dropoff}}}
    `,
});

const findRidesFlow = ai.defineFlow(
  {
    name: 'findRidesFlow',
    inputSchema: RideFinderInputSchema,
    outputSchema: RideFinderOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await rideFinderPrompt(input);
      return output!;
    } catch (error: any) {
      console.error('Error in findRidesFlow:', error);
      // Re-throw a more user-friendly error to be caught by the client
      throw new Error(
        'The AI service is currently unable to process your request. Please try again later.'
      );
    }
  }
);
