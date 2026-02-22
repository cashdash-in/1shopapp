'use server';
/**
 * @fileOverview A ride-sharing fare estimation and live traffic flow using Genkit.
 *
 * - findRides - A function that takes pickup/dropoff locations and returns AI-generated tentative fare estimates and traffic status.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { RideFinderInput, RideFinderOutput } from '../schemas';

const RideFinderInputSchema = z.object({
  pickup: z.string().describe('The pickup location address.'),
  dropoff: z.string().describe('The drop-off location address.'),
  currentTime: z.string().optional().describe('The current time and day for traffic context.'),
});

const RideOptionSchema = z.object({
  service: z.enum(['Uber', 'Ola', 'inDrive', 'Rapido']),
  vehicleType: z.string().describe('Type of vehicle (e.g., Auto, Bike, Premier, Mini, Prime Sedan).'),
  eta: z.string().describe('Estimated time of arrival (e.g., "5-8 min").'),
  fare: z.string().describe('The estimated fare in INR (e.g., "₹150").'),
  surge: z.boolean().describe('Whether surge pricing is likely active.'),
});

const RideFinderOutputSchema = z.object({
  options: z.array(RideOptionSchema),
  trafficAlerts: z.array(z.string()).describe('A list of 3-4 short, realistic live traffic status updates for this specific route.'),
});

const prompt = ai.definePrompt({
  name: 'rideFinderPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: RideFinderInputSchema },
  output: { schema: RideFinderOutputSchema },
  prompt: `You are a real-time ride-sharing fare and traffic estimator for Indian cities.
  
  Based on the following locations and current time, provide tentative, realistic fare estimates for Uber, Ola, inDrive, and Rapido. 
  Also, provide a set of "Live Traffic Alerts" that describe the road conditions between these two points right now.
  
  Pickup: {{pickup}}
  Drop-off: {{dropoff}}
  Current Time: {{currentTime}}
  
  Instructions:
  1. Calculate realistic INR fares based on estimated distance in Indian metros (like Bangalore, Mumbai, Delhi).
  2. Account for traffic patterns typical for this time of day.
  3. Generate specific traffic alerts like "Congestion near [landmark]", "Smooth flow on [main road]", or "Minor delay due to peak hours".
  4. Ensure multiple vehicle types (Auto, Bike, Cab) are provided for each service where realistic.
  
  Return a structured list of options and traffic alerts.`,
});

const rideFinderFlow = ai.defineFlow(
  {
    name: 'rideFinderFlow',
    inputSchema: RideFinderInputSchema,
    outputSchema: RideFinderOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to generate ride estimates and traffic data.');
    return output;
  }
);

/**
 * Main function to fetch ride estimates and traffic status.
 */
export async function findRides(input: RideFinderInput): Promise<RideFinderOutput> {
  const result = await rideFinderFlow({
    ...input,
    currentTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  });
  return result;
}
