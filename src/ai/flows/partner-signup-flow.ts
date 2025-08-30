'use server';
/**
 * @fileOverview A flow for handling partner sign-ups.
 *
 * - partnerSignup - A function that handles the partner signup process.
 * - PartnerSignupInput - The input type for the partnerSignup function.
 * - PartnerSignupOutput - The return type for the partnerSignup function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PartnerSignupInputSchema = z.object({
  shopName: z.string().describe("The name of the partner's shop."),
  ownerName: z.string().describe("The name of the shop owner."),
  phone: z.string().describe("The partner's phone number."),
  email: z.string().email().describe("The partner's email address."),
});
export type PartnerSignupInput = z.infer<typeof PartnerSignupInputSchema>;

const PartnerSignupOutputSchema = z.object({
  message: z.string().describe('A success message for the user.'),
  referralCode: z.string().describe('The unique referral code generated for the partner.'),
});
export type PartnerSignupOutput = z.infer<typeof PartnerSignupOutputSchema>;

export async function partnerSignup(input: PartnerSignupInput): Promise<PartnerSignupOutput> {
  return partnerSignupFlow(input);
}

const partnerSignupFlow = ai.defineFlow(
  {
    name: 'partnerSignupFlow',
    inputSchema: PartnerSignupInputSchema,
    outputSchema: PartnerSignupOutputSchema,
  },
  async (input) => {
    // In a real app, you would save this to a database (e.g., Firestore).
    // For now, we'll just log it to the server console for demonstration.
    console.log('New Partner Signup:', input);

    // Generate a simple referral code.
    const referralCode = input.shopName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '-') // Replace non-alphanumeric with a dash
      .replace(/-+/g, '-') // Replace multiple dashes with a single one
      .trim();

    return {
      message: 'Thank you for registering!',
      referralCode: referralCode,
    };
  }
);
