'use server';
/**
 * @fileOverview A shopping assistant AI flow.
 *
 * - shoppingAssistant - A function that provides shopping advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ShoppingAssistantInputSchema = z.object({
  prompt: z.string(),
});

export async function shoppingAssistant(prompt: string): Promise<string> {
  const { output } = await shoppingAssistantFlow({ prompt });
  if (!output) {
    return "I'm sorry, I couldn't generate a response.";
  }
  return output;
}

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
    return llmResponse.text;
  }
);
