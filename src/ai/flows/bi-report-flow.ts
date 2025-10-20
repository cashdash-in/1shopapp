
'use server';
/**
 * @fileOverview A flow for generating Business Intelligence reports.
 */
import type { BiReportInput, BiReportOutput, } from '../schemas';

const AI_DISABLED_ERROR = 'AI functionality is temporarily disabled due to a package installation issue. Please try again later.';

export async function generateBiReport(
  input: BiReportInput
): Promise<BiReportOutput> {
  throw new Error(AI_DISABLED_ERROR);
}
