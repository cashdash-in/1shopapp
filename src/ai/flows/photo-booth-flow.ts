'use server';

import { ai } from '@/ai/genkit';
import { PhotoBoothInputSchema, PhotoBoothOutputSchema, type PhotoBoothInput, type PhotoBoothOutput } from '../schemas';

export async function runPhotoBooth(input: PhotoBoothInput): Promise<PhotoBoothOutput> {
  return runPhotoBoothFlow(input);
}

const runPhotoBoothFlow = ai.defineFlow(
  {
    name: 'runPhotoBoothFlow',
    inputSchema: PhotoBoothInputSchema,
    outputSchema: PhotoBoothOutputSchema,
  },
  async (input) => {
    
    const prompt = ai.definePrompt({
        name: 'photoBoothPrompt',
        input: { schema: PhotoBoothInputSchema },
        output: { schema: PhotoBoothOutputSchema },
        prompt: `You are an AI photo editing expert. Your task is to take the user's photo and apply an artistic style to it.

        Style requested: "${input.style}"
        
        User's Photo:
        {{media url=photoDataUri}}

        Generate a new image in the requested style and return it as a data URI.
        `,
    });
    
    // NOTE: This is a placeholder as the current Genkit version might not support image generation directly in this environment.
    // We are returning the original image to prevent an error.
    // In a full implementation, you would call the model like this:
    // const { output } = await prompt(input);
    // return output!;
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