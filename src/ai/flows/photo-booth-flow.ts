'use server';

// import { ai } from '@/ai/genkit';
import {
  PhotoBoothInputSchema,
  PhotoBoothOutputSchema,
  type PhotoBoothInput,
  type PhotoBoothOutput,
} from '../schemas';

// const prompt = ai.definePrompt({
//   name: 'photoBoothPrompt',
//   input: { schema: PhotoBoothInputSchema },
//   output: { schema: PhotoBoothOutputSchema, format: 'json' },
//   prompt: `You are an AI artist.
// Take the following image and transform it into a new image based on the chosen artistic style.
// The output should be the new image as a data URI.

// Style: {{{style}}}
// Photo: {{media url=photoDataUri}}`,
//   config: {
//     model: 'googleai/gemini-2.5-flash-image-preview',
//     responseModalities: ['TEXT', 'IMAGE'],
//   },
// });

export async function runPhotoBooth(
  input: PhotoBoothInput
): Promise<PhotoBoothOutput> {
  // const { output } = await prompt(input);
  // return output!;
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
