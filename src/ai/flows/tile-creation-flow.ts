'use server';
/**
 * @fileOverview A flow for generating tile metadata from a URL using Genkit.
 *
 * - generateTileMetadata - A function that takes a URL and returns a name, icon, and color.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TileCreationInputSchema = z.object({
  url: z.string().describe('The URL of the website to create a tile for.'),
});
export type TileCreationInput = z.infer<typeof TileCreationInputSchema>;

const TileCreationOutputSchema = z.object({
  name: z.string().describe('A short, catchy name for the tile.'),
  icon: z.string().describe('A Lucide icon name that represents the site.'),
  color: z.string().describe('A brand-appropriate hex color code.'),
});
export type TileCreationOutput = z.infer<typeof TileCreationOutputSchema>;

const prompt = ai.definePrompt({
  name: 'tileCreationPrompt',
  model: 'googleai/gemini-1.5-flash-latest',
  input: { schema: TileCreationInputSchema },
  output: { schema: TileCreationOutputSchema },
  prompt: `You are a design assistant for 1ShopApp. 
  
  Given the URL: {{{url}}}
  
  Suggest a Tile Name, a Lucide Icon name, and a Hex Color that represents this brand. 
  Try to find the actual brand name from the URL if possible.
  
  Lucide icons to pick from include: ShoppingCart, UtensilsCrossed, Receipt, Plane, Shield, Landmark, Truck, Users, Newspaper, Search, Building2, Ticket, Mail, Book, Briefcase, Film, Music, Globe, Home, Heart, Headphones, Camera, Cloud, Code, CreditCard, Database, DollarSign, Download, ExternalLink, File, Folder, Gift, Image, Instagram, Layout, Link, Lock, LogIn, LogOut, Map, MessageCircle, Monitor, Moon, MousePointer, Package, Palette, Phone, Play, Plus, Settings, Share2, Smile, Sun, Tag, Target, ThumbsUp, Trash2, TrendingUp, Twitter, Upload, Video, Wallet, Wifi, Youtube, Zap.`,
});

const tileCreationFlow = ai.defineFlow(
  {
    name: 'tileCreationFlow',
    inputSchema: TileCreationInputSchema,
    outputSchema: TileCreationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to generate tile metadata.');
    return output;
  }
);

export async function generateTileMetadata(input: TileCreationInput): Promise<TileCreationOutput> {
  return tileCreationFlow(input);
}