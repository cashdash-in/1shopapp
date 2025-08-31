import type { PartnerSignupInput } from "@/ai/schemas";

// In a real app, this would be a database like Firestore.
// For this prototype, we'll use an in-memory array to simulate a user database.
// By defining it in a separate file, we ensure it's a singleton and persists across requests.
export const FAKE_PARTNER_DB: PartnerSignupInput[] = [
    {
        partnerType: "business",
        shopName: "Arun India",
        ownerName: "Arun",
        phone: "7506051026",
        email: "christ137_us@yahoo.com"
    },
    {
        partnerType: "business",
        shopName: "Sangeetha Mobiles",
        ownerName: "Priya Singh",
        phone: "9123456789",
        email: "priya.s@example.com",
        commission: 10
    },
    {
        partnerType: "individual",
        fullName: "Amit Patel",
        phone: "9988776655",
        email: "amit.p@example.com",
        commission: 10
    },
    {
        partnerType: "individual",
        fullName: "Chris Dsouza",
        phone: "9619798708",
        email: "christopher.p.dsouza@gmail.com",
        commission: 10
    }
];
