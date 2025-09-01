import type { PartnerSignupInput } from "@/ai/schemas";

// In a real app, this would be a database like Firestore.
// For this prototype, we'll use an in-memory array to simulate a user database.
// By defining it in a separate file, we ensure it's a singleton and persists across requests.
export const FAKE_PARTNER_DB: PartnerSignupInput[] = [
    // The database is now empty and will be populated with real signups.
];
