
'use server';
/**
 * @fileOverview A flow for handling partner sign-ups.
 *
 * - partnerSignup - A function that handles the partner signup process.
 * - getPartners - A function to retrieve all partners.
 * - PartnerSignupInput - The input type for the partnerSignup function.
 * - PartnerSignupOutput - The return type for the partnerSignup function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PartnerSignupInputSchema = z.object({
  partnerType: z.enum(['business', 'individual']),
  // Business fields
  shopName: z.string().optional(),
  ownerName: z.string().optional(),
  gstNumber: z.string().optional(),
  // Individual fields
  fullName: z.string().optional(),
  panNumber: z.string().optional(),
  // Common fields
  phone: z.string().describe("The partner's phone number."),
  email: z.string().email().describe("The partner's email address."),
});
export type PartnerSignupInput = z.infer<typeof PartnerSignupInputSchema>;


// In a real app, this would be a database like Firestore.
// For this prototype, we'll use an in-memory array to simulate a user database.
const FAKE_PARTNER_DB: PartnerSignupInput[] = [
    {
        partnerType: "business",
        shopName: "Sangeetha Mobiles",
        ownerName: "Priya Singh",
        phone: "9123456789",
        email: "priya.s@example.com",
    },
    {
        partnerType: "individual",
        fullName: "Amit Patel",
        phone: "9988776655",
        email: "amit.p@example.com",
    }
];

const PartnerSignupOutputSchema = z.object({
  message: z.string().describe('A success message for the user.'),
  referralCode: z.string().describe('The unique referral code generated for the partner.'),
});
export type PartnerSignupOutput = z.infer<typeof PartnerSignupOutputSchema>;

export async function getPartners(): Promise<PartnerSignupInput[]> {
    // In a real app, you'd fetch this from your database.
    return Promise.resolve(FAKE_PARTNER_DB);
}

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
    
    // Check for duplicate partners based on email (case-insensitive)
    const existingPartner = FAKE_PARTNER_DB.find(
        (partner) => partner.email.toLowerCase() === input.email.toLowerCase()
    );

    if (existingPartner) {
        throw new Error('A partner with this email already exists. Please try with a different email.');
    }

    // In a real app, you would HASH the password before saving.
    // For this prototype, we are storing it in plain text for simplicity.
    // NEVER DO THIS IN PRODUCTION.
    FAKE_PARTNER_DB.push(input);
    console.log('New Partner Signup:', input);
    console.log('Current Partner DB:', FAKE_PARTNER_DB);

    const partnerName = input.partnerType === 'business' ? input.shopName : input.fullName;

    // Generate a simple referral code.
    const referralCode = ((partnerName || 'PARTNER')
      .slice(0, 10)
      .toUpperCase()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^A-Z0-9]/g, '') // Remove non-alphanumeric characters
      .trim() || 'PARTNER') + Math.floor(1000 + Math.random() * 9000); // Add 4 random digits

    return {
      message: 'Thank you for registering!',
      referralCode: referralCode,
    };
  }
);
