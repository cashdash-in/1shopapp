
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
import { FAKE_PARTNER_DB } from '@/lib/db';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

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


const PartnerSignupOutputSchema = z.object({
  message: z.string().describe('A success message for the user.'),
  referralCode: z.string().describe('The unique referral code generated for the partner.'),
});
export type PartnerSignupOutput = z.infer<typeof PartnerSignupOutputSchema>;

// NOTE: This is a hack for the prototype to persist data.
// In a real app, you would use a proper database like Firestore.
async function persistPartner(newPartner: PartnerSignupInput) {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.ts');
    
    // Create a string representation of the new partner object
    const newPartnerString = `
    {
        partnerType: "${newPartner.partnerType}",
        ${newPartner.shopName ? `shopName: "${newPartner.shopName}",` : ''}
        ${newPartner.ownerName ? `ownerName: "${newPartner.ownerName}",` : ''}
        ${newPartner.gstNumber ? `gstNumber: "${newPartner.gstNumber}",` : ''}
        ${newPartner.fullName ? `fullName: "${newPartner.fullName}",` : ''}
        ${newPartner.panNumber ? `panNumber: "${newPartner.panNumber}",` : ''}
        phone: "${newPartner.phone}",
        email: "${newPartner.email}",
    },`;

    try {
        let fileContent = await fs.readFile(dbPath, 'utf-8');
        
        // Find the closing bracket of the FAKE_PARTNER_DB array
        const insertionIndex = fileContent.lastIndexOf('];');
        if (insertionIndex === -1) {
            throw new Error("Could not find the end of FAKE_PARTNER_DB array in db.ts");
        }

        // Insert the new partner string before the closing bracket
        const updatedContent = fileContent.slice(0, insertionIndex) + newPartnerString + fileContent.slice(insertionIndex);
        
        await fs.writeFile(dbPath, updatedContent, 'utf-8');
        
        // This is important: we also need to update the in-memory array for the current request
        FAKE_PARTNER_DB.push(newPartner);
        console.log('Successfully persisted new partner.');
    } catch (error) {
        console.error("!!! FAILED TO PERSIST PARTNER TO FILE !!!", error);
        // Fallback to in-memory only for this request if file write fails
        FAKE_PARTNER_DB.push(newPartner);
    }
}


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
    
    // Check for duplicate partners based on email (case-insensitive) or phone number
    const existingPartner = FAKE_PARTNER_DB.find(
        (partner) => (partner.email && partner.email.toLowerCase() === input.email.toLowerCase()) || (partner.phone && partner.phone === input.phone)
    );

    if (existingPartner) {
        throw new Error('A partner with this email or phone number already exists. Please try logging in instead.');
    }

    // Persist the new partner
    await persistPartner(input);

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
