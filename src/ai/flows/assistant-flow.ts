'use server';
/**
 * @fileOverview A shopping assistant AI flow.
 *
 * - shoppingAssistant - A function that provides shopping advice.
 */

import {ai} from '@/ai/genkit';
import {defineFlow} from 'genkit';
import {z} from 'zod';

// Define the input schema for the flow.
const ShoppingAssistantInputSchema = z.string();

// Define and export the flow.
export const shoppingAssistant = defineFlow(
  {
    name: 'shoppingAssistant',
    inputSchema: ShoppingAssistantInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    try {
      const { output } = await ai.generate({
        model: 'googleai/gemini-pro',
        prompt: `You are a helpful shopping assistant. Provide a helpful response to the following user query: ${input}`,
      });
      return output || "I'm sorry, I couldn't generate a response.";
    } catch (e: any) {
      console.error('Error in shoppingAssistant flow:', e);
      // Re-throw the error to be caught by the client-side handler
      throw new Error('Failed to connect to AI service.');
    }
  }
);
