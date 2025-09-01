
import type { CashbackTransaction, UserCashbackTransaction } from "@/ai/schemas";

interface CashbackRecord extends CashbackTransaction {
    transactions: UserCashbackTransaction[];
}

// In a real app, this would be a database like Firestore.
export const FAKE_CASHBACK_DB: Record<string, CashbackRecord> = {
  "user_abc123": {
    userId: "user_abc123",
    userName: "Rohan Sharma",
    totalCashback: 150.75,
    status: "Pending",
    lastActivity: "2024-08-20",
    transactions: [
        { id: "txn_1", description: "Cashback from Flipkart", amount: 50.25, status: "Credited", date: "2024-08-20" },
        { id: "txn_2", description: "Cashback from Myntra", amount: 75.50, status: "Credited", date: "2024-08-18" },
        { id: "txn_3", description: "Cashback from Swiggy", amount: 25.00, status: "Pending", date: "2024-08-22" },
    ]
  },
  "user_def456": {
    userId: "user_def456",
    userName: "Priya Patel",
    totalCashback: 275.50,
    status: "Paid",
    lastActivity: "2024-07-30",
    transactions: [
        { id: "txn_5", description: "Cashback from Amazon", amount: 175.00, status: "Credited", date: "2024-08-12" },
        { id: "txn_4", description: "Withdrawal to Bank Account", amount: -100.00, status: "Paid", date: "2024-07-30" },
    ]
  },
  "user_ghi789": {
    userId: "user_ghi789",
    userName: "Ankit Jain",
    totalCashback: 50.00,
    status: "Pending",
    lastActivity: "2024-08-20",
    transactions: [
         { id: "txn_6", description: "Cashback from Goibibo", amount: 50.00, status: "Credited", date: "2024-08-20" },
    ]
  },
   "user_jkl012": {
    userId: "user_jkl012",
    userName: "Sneha Reddy",
    totalCashback: 450.25,
    status: "Paid",
    lastActivity: "2024-06-10",
    transactions: [
        { id: "txn_7", description: "Cashback from MakeMyTrip", amount: 450.25, status: "Credited", date: "2024-06-10" },
    ]
  }
};
