'use server';
/**
 * @fileOverview A flow for analyzing data with an AI.
 *
 * - analyzeData - A function that takes data and a question and returns an AI-powered analysis.
 */
import type { DataAnalysisInput, DataAnalysisOutput } from '../schemas';

export async function analyzeData(
  input: DataAnalysisInput
): Promise<DataAnalysisOutput> {
  throw new Error('AI functionality is temporarily disabled due to a package installation issue. Please try again later.');
}
