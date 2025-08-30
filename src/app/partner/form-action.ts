'use server';

import {
  partnerSignup,
  PartnerSignupInput,
  PartnerSignupOutput,
} from '@/ai/flows/partner-signup-flow';

export async function handlePartnerSignup(
  input: PartnerSignupInput
): Promise<PartnerSignupOutput> {
  try {
    const result = await partnerSignup(input);
    return result;
  } catch (error) {
    console.error('Error in handlePartnerSignup:', error);
    throw new Error('Failed to sign up partner.');
  }
}
