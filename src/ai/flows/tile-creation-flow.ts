'use server';

import { ai } from '@/ai/genkit';
import { TileCreationInputSchema, TileCreationOutputSchema, type TileCreationInput, type TileCreationOutput } from '../schemas';

export async function generateTileMetadata(input: TileCreationInput): Promise<TileCreationOutput> {
  return generateTileMetadataFlow(input);
}

const generateTileMetadataFlow = ai.defineFlow(
  {
    name: 'generateTileMetadataFlow',
    inputSchema: TileCreationInputSchema,
    outputSchema: TileCreationOutputSchema,
  },
  async (input) => {
    const prompt = ai.definePrompt({
        name: 'tileMetadataPrompt',
        input: { schema: TileCreationInputSchema },
        output: { schema: TileCreationOutputSchema, format: 'json' },
        prompt: `Analyze the website at the given URL and extract the following information:
        
        - A concise, user-friendly 'name' for the website.
        - The name of the most relevant 'icon' from the lucide-react library (e.g., "ShoppingCart", "Briefcase").
        - The primary brand 'color' as a hex code.

        URL: ${input.url}

        Your response must be in the specified JSON format.
        `,
    });
    
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate tile metadata.");
    }
    return output;
  }
);