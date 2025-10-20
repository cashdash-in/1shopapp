'use server';
/**
 * @fileOverview A flow for generating tile metadata from a URL.
 */
// import {ai} from '@/ai/genkit';
// import {
//   TileCreationInputSchema,
//   type TileCreationInput,
//   TileCreationOutputSchema,
//   type TileCreationOutput,
// } from '../schemas';

// const tileCreationPrompt = ai.definePrompt({
//   name: 'tileCreationPrompt',
//   input: {schema: TileCreationInputSchema},
//   output: {schema: TileCreationOutputSchema},
//   prompt: `Analyze the website at the given URL and determine the best metadata for a home screen tile.

// - Website URL: {{url}}
// - Icon Library: lucide-react

// Based on the website's content, title, and branding:
// 1.  **Name**: Provide a short, user-friendly name for the tile (e.g., "HDFC NetBanking", "Myntra Shopping").
// 2.  **Icon**: Choose the most relevant icon from the lucide-react library. The icon name should be in PascalCase (e.g., "ShoppingCart", "Landmark", "Ticket").
// 3.  **Color**: Extract the primary brand color from the website as a hex code (e.g., "#FF6347").

// Return only the JSON object with the name, icon, and color.`,
// });

export async function generateTileMetadata(
  input: any
): Promise<any> {
  // const {output} = await tileCreationPrompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
