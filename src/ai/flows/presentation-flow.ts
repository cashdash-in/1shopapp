
'use server';
/**
 * @fileOverview A flow for generating presentation outlines.
 */
import type { PresentationInput, PresentationOutput, } from '../schemas';

const AI_DISABLED_ERROR = 'AI functionality is temporarily disabled due to a package installation issue. Please try again later.';

export async function generatePresentation(
  input: PresentationInput
): Promise<PresentationOutput> {
  throw new Error(AI_DISABLED_ERROR);
}
