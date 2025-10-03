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
import * as LucideIcons from 'lucide-react';


export async function generateTileMetadata(input: TileCreationInput): Promise<TileCreationOutput> {
    throw new Error("AI functionality is temporarily disabled due to installation issues.");
}

/*
const iconOptions = [
    'ShoppingCart', 'UtensilsCrossed', 'Receipt', 'Plane', 'Shield', 'Landmark', 'Truck', 'Users', 'Newspaper', 'Search', 'Building2', 'Ticket', 'Mail', 'Book', 'Briefcase', 'Film', 'Music', 'PenTool', 'FileText', 'Github', 'Globe', 'Home', 'Heart', 'Headphones', 'Camera', 'Cloud', 'Code', 'CreditCard', 'Database', 'DollarSign', 'Download', 'ExternalLink', 'File', 'Folder', 'Gift', 'Image', 'Instagram', 'Layout', 'Link', 'Lock', 'LogIn', 'LogOut', 'Map', 'MessageCircle', 'Monitor', 'Moon', 'MousePointer', 'Package', 'Palette', 'Phone', 'Play', 'Plus', 'Settings', 'Share2', 'Smile', 'Sun', 'Tag', 'Target', 'ThumbsUp', 'Trash2', 'TrendingUp', 'Twitter', 'Upload', 'Video', 'Wallet', 'Wifi', 'Youtube', 'Zap'
].join(', ');


const tileCreationPrompt = ai.definePrompt({
    name: 'tileCreationPrompt',
    input: { schema: TileCreationInputSchema },
    output: { schema: TileCreationOutputSchema, format: 'json' },
    prompt: `
    You are a web page analyst. Your task is to extract key information from a website to create a visually appealing tile for a dashboard.
    Analyze the content of the provided URL to determine the following:

    1.  **Name**: A concise, user-friendly name for the website. Extract this from the main title, heading, or meta tags. Keep it short and recognizable (e.g., "Hacker News", "Gmail", "The Verge").
    2.  **Icon**: The most relevant icon name from the lucide-react library. The icon should represent the website's primary function or category. Choose from the following list of available icons: ${iconOptions}.
    3.  **Color**: A hex color code that represents the primary brand color of the website. Find this in the site's CSS, logo, or overall design theme.

    URL to analyze: {{{url}}}
    `,
});

const tileCreationFlow = ai.defineFlow(
  {
    name: 'tileCreationFlow',
    inputSchema: TileCreationInputSchema,
    outputSchema: TileCreationOutputSchema,
  },
  async (input) => {
    const { output } = await tileCreationPrompt(input);
    return output!;
  }
);


export async function generateTileMetadata(input: TileCreationInput): Promise<TileCreationOutput> {
    return tileCreationFlow(input);
}
*/
