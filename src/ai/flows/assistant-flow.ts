'use server';
/**
 * @fileOverview An AI flow for finding deals and promotions.
 *
 * - shoppingAssistant - A function that finds shopping deals.
 */

import {ai} from '@/ai/genkit';

// Define and export the flow.
export const shoppingAssistant = ai.defineFlow(
  {
    name: 'shoppingAssistant',
    inputSchema: undefined,
    outputSchema: undefined,
  },
  async (input: string) => {
    try {
      const { output } = await ai.generate({
        model: 'googleai/gemini-pro',
        prompt: `You are an expert AI Deal Finder for an app called 1ShopApp. Your goal is to help users save money by finding the best deals, promotions, and coupons from our affiliate partners: Flipkart, Amazon, Meesho, Swiggy, and Zomato.

When a user asks for a deal on a product or service, provide a helpful and encouraging response.

IMPORTANT: You do not have real-time access to deals. You must act as if you do. When responding, generate realistic-sounding, fictional deals. For example, "Amazon has a 20% off coupon for that phone right now!" or "I found a 'buy one, get one free' deal on Swiggy for pizzas from Dominos."

User query: ${input}`,
      });
      return output || "I'm sorry, I couldn't generate a response.";
    } catch (e: any) {
      console.error('Error in shoppingAssistant flow:', e);
      // Re-throw the error to be caught by the client-side handler
      throw new Error('Failed to connect to AI service.');
    }
  }
);
