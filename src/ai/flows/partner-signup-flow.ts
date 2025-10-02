
'use server';
/**
 * @fileOverview A flow for handling partner sign-ups.
 *
 * - partnerSignup - A function that handles the partner signup process.
 * - getPartners - A function to retrieve all partners.
 */

import { FAKE_PARTNER_DB } from '@/lib/db';
import fs from 'fs/promises';
import path from 'path';
import type { PartnerSignupInput, PartnerSignupOutput } from '../schemas';

// Helper function to stringify a partner object for file writing
function stringifyPartner(partner: PartnerSignupInput): string {
    const fields = [
        `partnerType: "${partner.partnerType}"`,
        partner.shopName && `shopName: "${partner.shopName.replace(/"/g, '\\"')}"`,
        partner.ownerName && `ownerName: "${partner.ownerName.replace(/"/g, '\\"')}"`,
        partner.gstNumber && `gstNumber: "${partner.gstNumber}"`,
        partner.fullName && `fullName: "${partner.fullName.replace(/"/g, '\\"')}"`,
        partner.panNumber && `panNumber: "${partner.panNumber}"`,
        `phone: "${partner.phone}"`,
        `email: "${partner.email}"`,
        partner.commission && `commission: ${partner.commission}`
    ].filter(Boolean).join(',\n        ');
    return `    {\n        ${fields}\n    }`;
}


// NOTE: This is a hack for the prototype to persist data.
// In a real app, you would use a proper database like Firestore.
async function persistPartner(newPartner: PartnerSignupInput) {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'db.ts');

    // First, update the in-memory array for the current request
    FAKE_PARTNER_DB.unshift(newPartner);
    
    // Now, regenerate the entire db.ts file content from the updated in-memory array
    const allPartnersString = FAKE_PARTNER_DB.map(stringifyPartner).join(',\n');

    const fileContent = `
import type { PartnerSignupInput } from "@/ai/schemas";

// In a real app, this would be a database like Firestore.
// For this prototype, we'll use an in-memory array to simulate a user database.
// By defining it in a separate file, we ensure it's a singleton and persists across requests.
export const FAKE_PARTNER_DB: PartnerSignupInput[] = [
${allPartnersString}
];
`.trimStart();

    try {
        await fs.writeFile(dbPath, fileContent, 'utf-8');
        console.log('Successfully persisted new partner by regenerating db.ts');
    } catch (error) {
        console.error("!!! FAILED TO PERSIST PARTNER TO FILE !!!", error);
        // The in-memory array is already updated, so the current request will work.
        // Subsequent requests on new server instances will have the old data until the file is writable.
    }
}


export async function getPartners(): Promise<PartnerSignupInput[]> {
    // In a real app, you'd fetch this from your database.
    return Promise.resolve(FAKE_PARTNER_DB);
}

export async function partnerSignup(input: PartnerSignupInput): Promise<PartnerSignupOutput> {
    
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
