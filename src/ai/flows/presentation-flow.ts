'use server';
/**
 * @fileOverview A flow for generating presentation outlines with fallback.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { PresentationInput, PresentationOutput } from '../schemas';

const MODEL = 'googleai/gemini-1.5-flash-latest';

const PresentationInputSchema = z.object({
  topic: z.string(),
  instructions: z.string().optional(),
});

const PresentationOutputSchema = z.object({
  slides: z.array(z.object({
    title: z.string(),
    content: z.array(z.string()),
  })),
});

const prompt = ai.definePrompt({
  name: 'presentationPrompt',
  model: MODEL,
  input: { schema: PresentationInputSchema },
  output: { schema: PresentationOutputSchema },
  prompt: `Create presentation for topic: {{{topic}}}`,
});

export async function generatePresentation(input: PresentationInput): Promise<PresentationOutput> {
  try {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI Error');
    return output;
  } catch (error) {
    return {
      slides: [
        { title: `Introduction to ${input.topic}`, content: ["Overview of the concept", "Key industry trends", "Current market landscape"] },
        { title: "Core Objectives", content: ["Goal 1: Customer Reach", "Goal 2: Brand Awareness", "Goal 3: Strategic Growth"] },
        { title: "Technical Architecture", content: ["System design overview", "Scalability considerations", "Security and privacy"] },
        { title: "Implementation Roadmap", content: ["Phase 1: Research", "Phase 2: Development", "Phase 3: Launch"] },
        { title: "Conclusion & Next Steps", content: ["Summary of key findings", "Call to action", "Contact information"] },
      ]
    };
  }
}
