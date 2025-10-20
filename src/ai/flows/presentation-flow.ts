'use server';
/**
 * @fileOverview A flow for generating presentation outlines.
 *
 * - generatePresentation - A function that takes a topic and instructions and returns a presentation outline.
 */
import type { PresentationInput, PresentationOutput } from '../schemas';

export async function generatePresentation(
  input: PresentationInput
): Promise<PresentationOutput> {
  throw new Error('AI functionality is temporarily disabled due to a package installation issue. Please try again later.');
}
