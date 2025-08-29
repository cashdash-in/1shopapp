'use server';
/**
 * @fileOverview A shopping assistant AI flow.
 *
 * - shoppingAssistant - A function that provides shopping advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This is the schema for the input that the flow expects.
const ShoppingAssistantInputSchema = z.object({
  prompt: z.string(),
});

// This is the actual Genkit flow. It's an internal function.
const shoppingAssistantFlow = ai.defineFlow(
  {
    name: 'shoppingAssistantFlow',
    inputSchema: ShoppingAssistantInputSchema,
    outputSchema: z.string(),
  },
  async ({ prompt }) => {
    const llmResponse = await ai.generate({
      prompt: `You are a helpful assistant. User query: ${prompt}`,
    });
    // In Genkit v1+, we access the text response directly with .text
    return llmResponse.text;
  }
);

// This is the exported function that the UI will call.
// It takes a simple string and calls the flow with the correct object format.
export async function shoppingAssistant(prompt: string): Promise<string> {
  // We call the flow with the expected object.
  const { output } = await shoppingAssistantFlow({ prompt });
  if (!output) {
    return "I'm sorry, I couldn't generate a response.";
  }
  return output;
}
