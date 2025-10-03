'use server';
/**
 * @fileOverview A flow for generating Business Intelligence reports.
 */
import type { BiReportInput, BiReportOutput } from '../schemas';

const errorMessage = "AI functionality is temporarily disabled due to a package installation issue. Please contact support.";

export async function generateBiReport(input: BiReportInput): Promise<BiReportOutput> {
    console.error(errorMessage);
    throw new Error(errorMessage);
}
