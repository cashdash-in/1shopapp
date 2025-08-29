'use server';
/**
 * @fileOverview A shopping assistant AI flow.
 *
 * - shoppingAssistant - A function that provides shopping advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const shoppingAssistant = ai.defineFlow(
  {
    name: 'shoppingAssistant',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (prompt) => {
    const llmResponse = await ai.generate({
      prompt: `You are a helpful assistant. User query: ${prompt}`,
    });

    return llmResponse.text;
  }
);
