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

export async function shoppingAssistant(
  input: ShoppingAssistantInput
): Promise<ShoppingAssistantOutput> {
  const { output } = await ai.generate({
    model: 'googleai/gemini-pro',
    prompt: `You are a helpful shopping assistant. Provide a helpful response to the following user query: ${input}`,
  });
  return output || "I'm sorry, I couldn't generate a response.";
}
