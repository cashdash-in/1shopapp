import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Global Genkit instance configured with the Google AI (Gemini) plugin.
 * API Key is managed via environment variables (GOOGLE_GENAI_API_KEY or GEMINI_API_KEY).
 * Using v1beta API version to support advanced features like structured output (schemas)
 * which are required for the office assistant and report flows.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiVersion: 'v1beta' }),
  ],
});