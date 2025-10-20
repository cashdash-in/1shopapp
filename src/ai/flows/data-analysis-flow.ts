
'use server';
/**
 * @fileOverview A flow for analyzing data with an AI.
 */
import {
  type DataAnalysisInput,
  type DataAnalysisOutput,
} from '../schemas';

export async function analyzeData(
  input: DataAnalysisInput
): Promise<DataAnalysisOutput> {
  throw new Error("AI functionality is temporarily disabled due to a package installation issue. Please try again later.");
}
