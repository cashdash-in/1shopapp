'use server';
/**
 * @fileOverview A flow for analyzing data with an AI.
 */
import type { DataAnalysisInput, DataAnalysisOutput } from '../schemas';

const errorMessage = "AI functionality is temporarily disabled due to a package installation issue. Please contact support.";

export async function analyzeData(input: DataAnalysisInput): Promise<DataAnalysisOutput> {
    console.error(errorMessage);
    throw new Error(errorMessage);
}
