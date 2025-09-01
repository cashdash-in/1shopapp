/**
 * In a real app, this would be a database like Firestore.
 * For this prototype, we'll use an in-memory object to simulate a click tracking database.
 * The server flow will update this object and persist it to a file.
 */
export let FAKE_CLICK_DB: Record<string, { category: string; brand: string; clicks: number }> = {
    "Shopping_Flipkart": {
        "category": "Shopping",
        "brand": "Flipkart",
        "clicks": 2
    },
    "Bill Pay_PhonePe": {
        "category": "Bill Pay",
        "brand": "PhonePe",
        "clicks": 5
    },
    "Shopping_Nykaa": {
        "category": "Shopping",
        "brand": "Nykaa",
        "clicks": 1
    }
};
