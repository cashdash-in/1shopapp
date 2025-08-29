'use server';
/**
 * @fileOverview A shopping assistant AI flow.
 *
 * - shoppingAssistant - A function that provides shopping advice.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import {NextConfig} from 'next';
import getConfig from 'next/config';

// Initialize Genkit and the Google AI plugin directly within the flow file.
// This ensures the configuration is loaded correctly in the Next.js server environment.
const { serverRuntimeConfig } = getConfig();

const ai = genkit({
  plugins: [googleAI({ apiKey: serverRuntimeConfig.geminiApiKey })],
  enableTracingAndMetrics: true,
});

export async function shoppingAssistant(input: string): Promise<string> {
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
