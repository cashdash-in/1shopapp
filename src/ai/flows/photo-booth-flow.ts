'use server';
/**
 * @fileOverview A flow for applying styles to photos.
 */
import type { PhotoBoothInput, PhotoBoothOutput } from '../schemas';

const errorMessage = 'AI functionality is temporarily disabled due to a package installation issue. Please try again later.';

export async function runPhotoBooth(
  input: PhotoBoothInput
): Promise<PhotoBoothOutput> {
  throw new Error(errorMessage);
}
