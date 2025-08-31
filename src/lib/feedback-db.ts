
import type { Feedback } from "@/ai/schemas";

// In a real app, this would be a database like Firestore.
// For this prototype, we'll use an in-memory array to simulate a user feedback database.
// New feedback will be prepended to this array.
export const FAKE_FEEDBACK_DB: Feedback[] = [
    {
        id: "fb_1722446400000",
        submittedAt: "2024-07-31T12:00:00.000Z",
        feedback: { text: "The app is fantastic! So much faster than having all those individual apps installed. Keep up the great work!" },
        analysis: {
            sentiment: "Positive",
            categories: ["App Performance", "UI/UX"],
            summary: "User is very happy with the app's speed and concept.",
        }
    },
    {
        id: "fb_1722360000000",
        submittedAt: "2024-07-30T12:00:00.000Z",
        feedback: { text: "It would be cool if you could add a section for local grocery stores." },
        analysis: {
            sentiment: "Neutral",
            categories: ["Feature Request"],
            summary: "User suggests adding a new category for local grocery stores.",
        }
    },
    {
        id: "fb_1722273600000",
        submittedAt: "2024-07-29T12:00:00.000Z",
        feedback: { text: "The travel section links for makemytrip keep opening in the app instead of a new tab. It's a bit annoying." },
        analysis: {
            sentiment: "Negative",
            categories: ["Bug Report", "UI/UX"],
            summary: "User reports an issue with links not opening in a new tab as expected.",
        }
    },
    {
        id: "fb_1722187200000",
        submittedAt: "2024-07-28T12:00:00.000Z",
        feedback: { text: "This is a great idea. It saves so much space. Can you add Nykaa to the beauty section?" },
    },
];

