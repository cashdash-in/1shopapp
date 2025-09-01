
'use server';
/**
 * @fileOverview A flow for tracking and retrieving brand link clicks.
 *
 * - updateClickCount - Increments the click count for a given brand.
 * - getClickCounts - Retrieves the click counts for all brands.
 */
import { FAKE_CLICK_DB } from '@/lib/click-db';
import fs from 'fs/promises';
import path from 'path';
import type { ClickData, ClickUpdateInput } from '../schemas';

// --- Persistence Logic (similar to other flows) ---

// NOTE: This is a hack for the prototype to persist data.
// In a real app, you would use a proper database like Firestore.
async function persistClickDB() {
    const dbPath = path.join(process.cwd(), 'src', 'lib', 'click-db.ts');
    
    // Convert the record to a string representation for the file
    const dbString = Object.entries(FAKE_CLICK_DB)
        .map(([key, value]) => `    "${key}": ${JSON.stringify(value, null, 4).replace(/\n/g, '\n    ')}`)
        .join(',\n');

    const fileContent = `
/**
 * In a real app, this would be a database like Firestore.
 * For this prototype, we'll use an in-memory object to simulate a click tracking database.
 * The server flow will update this object and persist it to a file.
 */
export let FAKE_CLICK_DB: Record<string, { category: string; brand: string; clicks: number }> = {
${dbString}
};
`.trimStart();
    
    try {
        await fs.writeFile(dbPath, fileContent, 'utf-8');
        console.log('Successfully persisted click DB by regenerating click-db.ts');
    } catch (error) {
        console.error("!!! FAILED TO PERSIST CLICK DB TO FILE !!!", error);
    }
}


// --- Server Actions ---

/**
 * Increments the click count for a specific brand and category.
 * This function is called from the client-side analytics tracker.
 */
export async function updateClickCount(input: ClickUpdateInput): Promise<void> {
    const key = `${input.category}_${input.brand}`;

    if (FAKE_CLICK_DB[key]) {
        FAKE_CLICK_DB[key].clicks += 1;
    } else {
        FAKE_CLICK_DB[key] = {
            category: input.category,
            brand: input.brand,
            clicks: 1,
        };
    }

    // Asynchronously persist the changes without making the client wait
    persistClickDB();
}

/**
 * Retrieves all click count data.
 * This function is called by the admin dashboard pages.
 */
export async function getClickCounts(): Promise<ClickData[]> {
    // Return the values of the in-memory DB object as an array
    return Promise.resolve(Object.values(FAKE_CLICK_DB));
}
