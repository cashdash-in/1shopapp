
'use server';

import type { DataAnalysisInput, DataAnalysisOutput } from '../schemas';

export async function analyzeData(input: DataAnalysisInput): Promise<DataAnalysisOutput> {
  throw new Error("AI functionality is temporarily disabled due to a build issue.");
}
