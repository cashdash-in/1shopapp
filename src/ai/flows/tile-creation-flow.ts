'use server';
/**
 * @fileOverview A flow for generating tile metadata from a URL.
 */
import type { TileCreationInput, TileCreationOutput } from '../schemas';

const errorMessage = "AI functionality is temporarily disabled due to a package installation issue. Please contact support.";

export async function generateTileMetadata(input: TileCreationInput): Promise<TileCreationOutput> {
    console.error(errorMessage);
    throw new Error(errorMessage);
}
