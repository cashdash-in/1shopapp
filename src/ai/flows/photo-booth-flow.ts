'use server';

import type { PhotoBoothInput, PhotoBoothOutput } from '../schemas';

const errorMessage = "AI functionality is temporarily disabled due to a package installation issue. Please contact support.";

export async function runPhotoBooth(input: PhotoBoothInput): Promise<PhotoBoothOutput> {
    console.error(errorMessage);
    throw new Error(errorMessage);
}
