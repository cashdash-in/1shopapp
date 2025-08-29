'use server';
/**
 * @fileOverview A shopping assistant AI flow.
 *
 * - shoppingAssistant - A function that provides shopping advice.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// This is the exported function that the UI will call.
export async function shoppingAssistant(prompt: string): Promise<string> {
    const llmResponse = await ai.generate({
      prompt: `You are a helpful assistant. User query: ${prompt}`,
    });
    return llmResponse.text;
}
