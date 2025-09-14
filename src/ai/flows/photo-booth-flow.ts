
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

const stylePrompts = {
    'Cartoon': 'a vibrant, colorful cartoon with bold outlines, in the style of a modern animated movie. Preserve the key features of the subject.',
    'Anime': 'an anime or manga character, with large expressive eyes and stylized hair. The background should be simple and dynamic.',
    'Oil Painting': 'a classic oil painting with visible brushstrokes and a rich, textured feel. The lighting should be dramatic.',
    'Cyberpunk': 'a futuristic cyberpunk image with neon lights, cybernetic enhancements, and a gritty, high-tech aesthetic.',
    'Pixel Art': '8-bit pixel art, like a character from a classic video game. The image should be blocky and use a limited color palette.',
    'Wallpaper': 'a beautiful, high-resolution desktop wallpaper. The style should be epic and cinematic, suitable for a computer background.',
};


// Define the Genkit flow for the photo booth
const photoBoothFlow = ai.defineFlow(
  {
    name: 'photoBoothFlow',
    inputSchema: PhotoBoothInputSchema,
    outputSchema: PhotoBoothOutputSchema,
  },
  async (input) => {
    
    const styleInstruction = stylePrompts[input.style as keyof typeof stylePrompts] || `the style of ${input.style}`;
    
    // The prompt must be an array containing an object for the media and an object for the text.
    const { media, text, finishReason } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            { media: { url: input.photoDataUri } },
            { text: `Transform this image into ${styleInstruction}. IMPORTANT: Respond with only the generated image and no accompanying text.` },
        ],
        config: {
            responseModalities: ['IMAGE', 'TEXT'], // MUST provide both TEXT and IMAGE
        },
    });

    if (finishReason !== 'stop' || !media || !media.url) {
      console.error(`AI generation failed. Finish reason: ${finishReason}. Response text: ${text}`);
      throw new Error(`The AI model did not return a valid image. Reason: ${finishReason}.`);
    }

    return {
        imageDataUri: media.url,
    };
  }
);
