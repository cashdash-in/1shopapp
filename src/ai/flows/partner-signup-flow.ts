
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

// In a real app, this would be a database like Firestore.
// For this prototype, we'll use an in-memory array to simulate a user database.
const FAKE_PARTNER_DB: PartnerSignupInput[] = [
    {
        partnerName: "Sangeetha Mobiles",
        ownerName: "Priya Singh",
        phone: "9123456789",
        email: "priya.s@example.com",
    },
    {
        partnerName: "Amit Patel",
        ownerName: "Amit Patel",
        phone: "9988776655",
        email: "amit.p@example.com",
    }
];

const PartnerSignupInputSchema = z.object({
  partnerName: z.string().describe("The name of the partner or their shop."),
  ownerName: z.string().describe("The name of the contact person."),
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
    
    // Check for duplicate partners based on email
    const existingPartner = FAKE_PARTNER_DB.find(
        (partner) => partner.email.toLowerCase() === input.email.toLowerCase()
    );

    if (existingPartner) {
        throw new Error('A partner with this email already exists. Please try with a different email.');
    }

    // Add the new partner to our fake database
    FAKE_PARTNER_DB.push(input);
    console.log('New Partner Signup:', input);
    console.log('Current Partner DB:', FAKE_PARTNER_DB);

    // Generate a simple referral code.
    const referralCode = input.partnerName
      .toUpperCase()
      .replace(/\s+/g, '-') // Replace spaces with a dash
      .replace(/[^A-Z0-9-]/g, '') // Remove non-alphanumeric characters except dashes
      .trim();

    return {
      message: 'Thank you for registering!',
      referralCode: referralCode,
    };
  }
);
