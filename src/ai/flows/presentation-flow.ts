'use server';
/**
 * @fileOverview A professional flow for generating comprehensive presentation outlines.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { PresentationInput, PresentationOutput } from '../schemas';

const MODEL = 'googleai/gemini-1.5-flash';

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
  prompt: `You are a Professional Presentation Consultant. Create a detailed, high-impact slide outline for the following topic.
  
  TOPIC:
  {{{topic}}}
  
  CUSTOM INSTRUCTIONS:
  {{{instructions}}}
  
  GUIDELINES:
  1. Each slide must have a compelling title.
  2. Content should be organized into 3-5 clear, distinct bullet points.
  3. Flow logically from Introduction to Conclusion.
  4. Ensure the content is structured for professional impact.`,
});

export async function generatePresentation(input: PresentationInput): Promise<PresentationOutput> {
  try {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI Error');
    return output;
  } catch (error) {
    return {
      slides: [
        { title: `Executive Summary: ${input.topic}`, content: ["High-level objectives and goals", "Current market landscape analysis", "Key value propositions"] },
        { title: "Strategic Challenges", content: ["Identification of primary hurdles", "Risk mitigation strategies", "Competitive landscape shifts"] },
        { title: "Operational Roadmap", content: ["Phase 1: Implementation & Design", "Phase 2: Growth & Scaling", "Phase 3: Optimization & Review"] },
        { title: "Key Performance Metrics", content: ["Success criteria definition", "Timeline for milestone achievement", "Resource allocation planning"] },
        { title: "Conclusion & Call to Action", content: ["Summary of strategic advantages", "Immediate next steps", "Contact and support details"] },
      ]
    };
  }
}
