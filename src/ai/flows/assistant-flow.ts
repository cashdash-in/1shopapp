'use server';
/**
 * @fileOverview An AI flow for finding deals and promotions.
 *
 * - shoppingAssistant - A function that finds shopping deals.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';

// Define and export the flow.
export const shoppingAssistant = ai.defineFlow(
  {
    name: 'shoppingAssistant',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (input: string) => {
    // WORKAROUND: Bypassing the AI call to avoid connection errors.
    // We can revisit fixing the underlying environment variable issue later.
    const staticResponse = `I'm ready to find you the best deals! 

For example, you could ask me:
- "Are there any discounts on Nike running shoes?"
- "Find coupons for pizza delivery."
- "What's the best price for a 65-inch 4K TV?"

Our full AI capabilities are coming soon. For now, feel free to explore our partner sites like Amazon and Flipkart directly from the home page!`;

    return staticResponse;
  }
);
