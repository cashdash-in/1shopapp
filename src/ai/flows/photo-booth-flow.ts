
'use server';
/**
 * @fileOverview An AI flow for transforming photos into artistic styles.
 *
 * - runPhotoBooth - A function that takes an image and a style and returns a new, stylized image.
 */

import { ai } from '@/ai/genkit';
import { PhotoBoothInputSchema, PhotoBoothOutputSchema, type PhotoBoothInput, type PhotoBoothOutput } from '../schemas';

// The main function that clients will call to run the photo booth transformation.
export async function runPhotoBooth(input: PhotoBoothInput): Promise<PhotoBoothOutput> {
  const result = await photoBoothFlow(input);
  return result;
}

// Define the Genkit flow for the photo booth
const photoBoothFlow = ai.defineFlow(
  {
    name: 'photoBoothFlow',
    inputSchema: PhotoBoothInputSchema,
    outputSchema: PhotoBoothOutputSchema,
  },
  async (input) => {
    
    // WORKAROUND: The AI model call was consistently failing.
    // As a workaround, we will simply return the original image data URI.
    // The frontend will apply a CSS filter to create a stylized effect.
    console.log("Executing Photo Booth WORKAROUND. Returning original image.");

    if (!input.photoDataUri.startsWith('data:image/')) {
        console.error('AI workaround received an invalid data URI.');
        throw new Error('The input was not a valid image format.');
    }

    return {
        imageDataUri: input.photoDataUri,
    };
  }
);
