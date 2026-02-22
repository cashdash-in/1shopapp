import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Global Genkit instance configured with the Google AI (Gemini) plugin.
 * Using v1beta API version to support advanced features like structured output (schemas).
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiVersion: 'v1beta' }),
  ],
});