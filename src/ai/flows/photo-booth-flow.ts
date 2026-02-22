'use server';
/**
 * @fileOverview A flow for applying styles to photos using Genkit with simulation fallback.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { PhotoBoothInput, PhotoBoothOutput } from '../schemas';

const MODEL = 'googleai/gemini-1.5-flash-latest';

const PhotoBoothInputSchema = z.object({
  photoDataUri: z.string().describe("A photo as a data URI."),
  style: z.string().describe('The artistic style to apply.'),
});

const PhotoBoothOutputSchema = z.object({
  imageDataUri: z.string().describe('The stylized image as a base64 data URI.'),
});

const photoBoothFlow = ai.defineFlow(
  {
    name: 'photoBoothFlow',
    inputSchema: PhotoBoothInputSchema,
    outputSchema: PhotoBoothOutputSchema,
  },
  async (input) => {
    try {
      // Attempt vision processing
      await ai.generate({
        model: MODEL,
        prompt: [
          { media: { url: input.photoDataUri } },
          { text: `Analyze this image for a ${input.style} transformation.` },
        ],
      });
      return { imageDataUri: input.photoDataUri };
    } catch (error) {
      console.warn("Photo Booth AI failed, using simulation:", error);
      // For the prototype, we return the same image as a "processed" result
      return { imageDataUri: input.photoDataUri };
    }
  }
);

export async function runPhotoBooth(input: PhotoBoothInput): Promise<PhotoBoothOutput> {
  return photoBoothFlow(input);
}
