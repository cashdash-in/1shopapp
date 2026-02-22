'use server';
/**
 * @fileOverview A flow for applying styles to photos using Gemini.
 * - runPhotoBooth - A function that takes an image and a style and returns a new image.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { PhotoBoothInput, PhotoBoothOutput } from '../schemas';

const PhotoBoothInputSchema = z.object({
  photoDataUri: z.string().describe("A photo as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  style: z.string().describe('The artistic style to apply (e.g., Cartoon, Anime, Cyberpunk).'),
});

const PhotoBoothOutputSchema = z.object({
  imageDataUri: z.string().describe('The stylized image as a base64 data URI.'),
});

export async function runPhotoBooth(
  input: PhotoBoothInput
): Promise<PhotoBoothOutput> {
  return photoBoothFlow(input);
}

const photoBoothFlow = ai.defineFlow(
  {
    name: 'photoBoothFlow',
    inputSchema: PhotoBoothInputSchema,
    outputSchema: PhotoBoothOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: 'gemini-1.5-flash',
      prompt: [
        { media: { url: input.photoDataUri } },
        { text: `Re-imagine this image in a ${input.style} artistic style. Maintain the main subjects and composition but transform the aesthetic completely. Output the result as an image.` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('AI failed to generate a stylized image.');
    }

    return {
      imageDataUri: media.url,
    };
  }
);
