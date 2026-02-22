import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Global Genkit instance configured with the Google AI (Gemini) plugin.
 * Default configuration is used to ensure stability and compatibility with standard endpoints.
 */
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});