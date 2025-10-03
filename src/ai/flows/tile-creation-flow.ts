'use server';
/**
 * @fileOverview A flow for generating tile metadata from a URL.
 */
// import { ai } from '@/ai/genkit';
import {
  TileCreationInputSchema,
  TileCreationOutputSchema,
  type TileCreationInput,
  type TileCreationOutput,
} from '../schemas';

// const prompt = ai.definePrompt({
//   name: 'tileCreationPrompt',
//   input: { schema: TileCreationInputSchema },
//   output: { schema: TileCreationOutputSchema, format: 'json' },
//   prompt: `Analyze the website at the given URL and extract the following information:
// 1. A concise, user-friendly name for the website.
// 2. The most relevant icon name from the lucide-react library.
// 3. A hex color code that represents the primary brand color of the website.

// URL: {{{url}}}

// Provide the output in JSON format.`,
// });

export async function generateTileMetadata(
  input: TileCreationInput
): Promise<TileCreationOutput> {
  // const { output } = await prompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
