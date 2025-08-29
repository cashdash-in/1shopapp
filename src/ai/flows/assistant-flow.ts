'use server';
/**
 * @fileOverview A shopping assistant AI flow.
 *
 * - shoppingAssistant - A function that provides shopping advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ShoppingAssistantInputSchema = z.string();
export type ShoppingAssistantInput = z.infer<typeof ShoppingAssistantInputSchema>;

const ShoppingAssistantOutputSchema = z.string();
export type ShoppingAssistantOutput = z.infer<
  typeof ShoppingAssistantOutputSchema
>;

const shoppingAssistantFlow = ai.defineFlow(
  {
    name: 'shoppingAssistantFlow',
    inputSchema: ShoppingAssistantInputSchema,
    outputSchema: ShoppingAssistantOutputSchema,
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      prompt: `You are a helpful assistant. User query: ${prompt}`,
    });

    return llmResponse.text;
  }
);

export async function shoppingAssistant(
  prompt: ShoppingAssistantInput
): Promise<ShoppingAssistantOutput> {
  return await shoppingAssistantFlow(prompt);
}
