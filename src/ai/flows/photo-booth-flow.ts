'use server';

// import { ai } from '@/ai/genkit';
import {
  PhotoBoothInputSchema,
  PhotoBoothOutputSchema,
  type PhotoBoothInput,
  type PhotoBoothOutput,
} from '../schemas';
// import { googleAI } from '@genkit-ai/google-genai';

export async function runPhotoBooth(input: PhotoBoothInput): Promise<PhotoBoothOutput> {
  throw new Error("AI functionality is temporarily disabled due to installation issues.");
}

/*
const photoBoothFlow = ai.defineFlow(
  {
    name: 'photoBoothFlow',
    inputSchema: PhotoBoothInputSchema,
    outputSchema: PhotoBoothOutputSchema,
  },
  async (input) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-image-preview'),
      prompt: [
        { media: { url: input.photoDataUri } },
        { text: `Convert this image into a ${input.style} style.` },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate image. The AI model did not return any media.');
    }

    return {
      imageDataUri: media.url,
    };
  }
);

export async function runPhotoBooth(input: PhotoBoothInput): Promise<PhotoBoothOutput> {
  return photoBoothFlow(input);
}
*/
