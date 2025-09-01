
'use server';

/**
 * @fileOverview A flow for managing and retrieving cashback data.
 *
 * - getCashbackData - Retrieves cashback data for the admin dashboard.
 * - getUserCashbackDetails - Retrieves cashback details for a specific user.
 * - updateCashbackStatus - Updates the payment status for a user's cashback.
 */

import { FAKE_CASHBACK_DB } from "@/lib/cashback-db";
import type { CashbackTransaction, UserCashbackDetails } from "../schemas";

/**
 * Retrieves all cashback data for the admin dashboard.
 * In a real app, this would query a database.
 */
export async function getCashbackData(): Promise<CashbackTransaction[]> {
    return Promise.resolve(Object.values(FAKE_CASHBACK_DB));
}

/**
 * Retrieves the cashback balance and transaction history for a specific user.
 * In a real app, this would query a database for a specific userId.
 */
export async function getUserCashbackDetails(userId: string): Promise<UserCashbackDetails> {
    // For this prototype, we'll just use the first user in our mock DB.
    const user = FAKE_CASHBACK_DB[userId];
    if (!user) {
        return { totalBalance: 0, transactions: [] };
    }
    
    return Promise.resolve({
        totalBalance: user.totalCashback,
        transactions: user.transactions || []
    });
}

/**
 * Updates the status of a user's cashback payout.
 * In a real app, this would update a record in the database.
 */
export async function updateCashbackStatus(userId: string, newStatus: "Pending" | "Paid"): Promise<{ success: boolean }> {
    const user = FAKE_CASHBACK_DB[userId];
    if (!user) {
        throw new Error("User not found");
    }

    // Update the in-memory "database"
    user.status = newStatus;
    
    // NOTE: In a real app with a persistent DB, you would also save the changes here.
    // For this prototype, the change is only in memory and will be lost on server restart.
    
    console.log(`Updated cashback status for ${userId} to ${newStatus}`);
    
    return Promise.resolve({ success: true });
}
