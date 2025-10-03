'use server';
/**
 * @fileOverview A flow for generating presentation outlines.
 */
import type { PresentationInput, PresentationOutput } from '../schemas';

const errorMessage = "AI functionality is temporarily disabled due to a package installation issue. Please contact support.";

export async function generatePresentation(input: PresentationInput): Promise<PresentationOutput> {
    console.error(errorMessage);
    throw new Error(errorMessage);
}
