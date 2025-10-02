'use server';

import type { PhotoBoothInput, PhotoBoothOutput } from '../schemas';

export async function runPhotoBooth(input: PhotoBoothInput): Promise<PhotoBoothOutput> {
  console.log("Executing Photo Booth WORKAROUND. Returning original image.");

  if (!input.photoDataUri.startsWith('data:image/')) {
      console.error('AI workaround received an invalid data URI.');
      throw new Error('The input was not a valid image format.');
  }

  return {
      imageDataUri: input.photoDataUri,
  };
}
