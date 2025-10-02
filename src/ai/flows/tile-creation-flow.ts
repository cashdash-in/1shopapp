
'use server';
/**
 * @fileOverview An AI flow for generating tile metadata from a URL.
 *
 * - generateTileMetadata - A function that analyzes a URL and returns a suggested name, icon, and color for a new tile.
 */

import { ai } from '@/ai/genkit';
import { TileCreationInputSchema, TileCreationOutputSchema, type TileCreationInput, type TileCreationOutput } from '../schemas';

// The main function that clients will call.
export async function generateTileMetadata(input: TileCreationInput): Promise<TileCreationOutput> {
  const result = await tileCreationFlow(input);
  return result;
}

const iconOptions = [
    'ShoppingCart', 'UtensilsCrossed', 'Receipt', 'Plane', 'Shield', 'Landmark', 'Truck', 'Users', 'Newspaper', 'Search', 'Building2', 'Ticket', 'Mail', 'Book', 'Briefcase', 'Film', 'Music', 'PenTool', 'FileText', 'Github', 'Globe', 'Home', 'Heart', 'Headphones', 'Camera', 'Cloud', 'Code', 'CreditCard', 'Database', 'DollarSign', 'Download', 'ExternalLink', 'File', 'Folder', 'Gift', 'Image', 'Instagram', 'Layout', 'Link', 'Lock', 'LogIn', 'LogOut', 'Map', 'MessageCircle', 'Monitor', 'Moon', 'MousePointer', 'Package', 'Palette', 'Phone', 'Play', 'Plus', 'Settings', 'Share2', 'Smile', 'Sun', 'Tag', 'Target', 'ThumbsUp', 'Trash2', 'TrendingUp', 'Twitter', 'Upload', 'Video', 'Wallet', 'Wifi', 'Youtube', 'Zap'
];

// Define the prompt for the AI model
const tileCreationPrompt = ai.definePrompt({
  name: 'tileCreationPrompt',
  input: { schema: TileCreationInputSchema },
  output: { schema: TileCreationOutputSchema },
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert at analyzing web pages to extract key information for creating a visually appealing and informative tile in a user dashboard.

Analyze the content of the website at the given URL: {{{url}}}

Based on your analysis, provide the following in the specified JSON format:

1.  **"name"**: A short, recognizable name for the website. This is often the company or brand name found in the title or main heading. For example, for "https://docs.google.com/document/", the name should be "Google Docs".

2.  **"icon"**: The name of a single, highly relevant icon from the 'lucide-react' icon library that best represents the website's purpose. Choose ONLY from the following list: ${iconOptions.join(', ')}. For example, for a shopping site, use "ShoppingCart"; for a travel site, use "Plane"; for a news site, use "Newspaper".

3.  **"color"**: The dominant brand color of the website as a single hex color code (e.g., "#4285F4").
`,
});


// Define the Genkit flow
const tileCreationFlow = ai.defineFlow(
  {
    name: 'tileCreationFlow',
    inputSchema: TileCreationInputSchema,
    outputSchema: TileCreationOutputSchema,
  },
  async (input) => {
    const { output } = await tileCreationPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid output for tile creation.");
    }
    return output;
  }
);
