'use server';
/**
 * @fileOverview A shopping assistant AI flow.
 *
 * - shoppingAssistant - A function that provides shopping advice.
 */

import 'dotenv/config';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit and the Google AI plugin directly within the flow file.
// This ensures the configuration is loaded correctly in the Next.js server environment.
const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY })],
  enableTracingAndMetrics: true,
});

export async function shoppingAssistant(input: string): Promise<string> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-pro',
    prompt: `You are a helpful shopping assistant. Provide a helpful response to the following user query: ${input}`,
  });
  return output || "I'm sorry, I couldn't generate a response.";
}
