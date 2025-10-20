'use server';
/**
 * @fileOverview A flow for applying styles to photos.
 * - runPhotoBooth - A function that takes an image and a style and returns a new image.
 */
import type { PhotoBoothInput, PhotoBoothOutput } from '../schemas';

export async function runPhotoBooth(
  input: PhotoBoothInput
): Promise<PhotoBoothOutput> {
  throw new Error('AI functionality is temporarily disabled due to a package installation issue. Please try again later.');
}
