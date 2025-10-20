
'use server';

import type { PhotoBoothInput, PhotoBoothOutput, } from '../schemas';

const AI_DISABLED_ERROR = 'AI functionality is temporarily disabled due to a package installation issue. Please try again later.';

export async function runPhotoBooth(
  input: PhotoBoothInput
): Promise<PhotoBoothOutput> {
  throw new Error(AI_DISABLED_ERROR);
}
