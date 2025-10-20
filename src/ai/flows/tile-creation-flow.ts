
'use server';
/**
 * @fileOverview A flow for generating tile metadata from a URL.
 */
import type { TileCreationInput, TileCreationOutput, } from '../schemas';

const AI_DISABLED_ERROR = 'AI functionality is temporarily disabled due to a package installation issue. Please try again later.';

export async function generateTileMetadata(
  input: TileCreationInput
): Promise<TileCreationOutput> {
  throw new Error(AI_DISABLED_ERROR);
}
