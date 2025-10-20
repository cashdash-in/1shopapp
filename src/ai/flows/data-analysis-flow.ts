
'use server';
/**
 * @fileOverview A flow for analyzing data with an AI.
 */
import type { DataAnalysisInput, DataAnalysisOutput, } from '../schemas';

const AI_DISABLED_ERROR = 'AI functionality is temporarily disabled due to a package installation issue. Please try again later.';

export async function analyzeData(
  input: DataAnalysisInput
): Promise<DataAnalysisOutput> {
  throw new Error(AI_DISABLED_ERROR);
}
