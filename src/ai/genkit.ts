
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

/**
 * Global Genkit instance configured with Google AI (Gemini).
 * Using the stable legacy plugin to ensure reliable module resolution.
 * API Key is managed via environment variables (GOOGLE_GENAI_API_KEY or GEMINI_API_KEY).
 */
export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
