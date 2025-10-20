'use server';
/**
 * @fileOverview A flow for generating tile metadata from a URL.
 *
 * - generateTileMetadata - A function that takes a URL and returns a name, icon, and color for a tile.
 */
import type { TileCreationInput, TileCreationOutput } from '../schemas';

export async function generateTileMetadata(
  input: TileCreationInput
): Promise<TileCreationOutput> {
  // This error will be caught by the client and displayed to the user.
  throw new Error('AI analysis for new tiles is temporarily disabled due to a package installation issue. Please add tiles manually.');
}
