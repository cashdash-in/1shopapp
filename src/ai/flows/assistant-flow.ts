'use server';
/**
 * @fileOverview A shopping assistant AI flow.
 *
 * - shoppingAssistant - A function that provides shopping advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ShoppingAssistantInputSchema = z.string();
const ShoppingAssistantOutputSchema = z.string();

export async function shoppingAssistant(input: z.infer<typeof ShoppingAssistantInputSchema>): Promise<z.infer<typeof ShoppingAssistantOutputSchema>> {
  return shoppingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'shoppingAssistantPrompt',
  input: { schema: ShoppingAssistantInputSchema },
  output: { schema: ShoppingAssistantOutputSchema },
  prompt: `You are an expert shopping assistant for an app called 1ShopApp. 
  Your goal is to help users make informed decisions about what to buy and where to buy it.
  The user has access to services like Flipkart, Amazon, Meesho, Swiggy, and Zomato through the app.
  
  When a user asks a question, provide a helpful and concise response. 
  You can recommend products, compare items, suggest where to eat, or give general shopping advice.
  
  User query: {{{prompt}}}.`,
});

const shoppingAssistantFlow = ai.defineFlow(
  {
    name: 'shoppingAssistantFlow',
    inputSchema: ShoppingAssistantInputSchema,
    outputSchema: ShoppingAssistantOutputSchema,
  },
  async (promptText) => {
    const { output } = await prompt(promptText);
    return output!;
  }
);
