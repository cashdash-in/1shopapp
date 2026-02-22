
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Global Genkit instance configured with the modern Google AI (Gemini) plugin.
 * API Key is managed via environment variables (GOOGLE_GENAI_API_KEY or GEMINI_API_KEY).
 */
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
