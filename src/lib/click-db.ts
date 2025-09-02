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
    },
    "Hotels & Travel_Agoda": {
        "category": "Hotels & Travel",
        "brand": "Agoda",
        "clicks": 1
    },
    "Hotels & Travel_IRCTC": {
        "category": "Hotels & Travel",
        "brand": "IRCTC",
        "clicks": 1
    },
    "Shopping_Nykaa Fashion": {
        "category": "Shopping",
        "brand": "Nykaa Fashion",
        "clicks": 1
    },
    "Shopping_Amazon": {
        "category": "Shopping",
        "brand": "Amazon",
        "clicks": 1
    },
    "Search Engines_Google": {
        "category": "Search Engines",
        "brand": "Google",
        "clicks": 1
    },
    "Search Engines_Copilot": {
        "category": "Search Engines",
        "brand": "Copilot",
        "clicks": 1
    },
    "Search Engines_ChatGPT": {
        "category": "Search Engines",
        "brand": "ChatGPT",
        "clicks": 1
    },
    "Emails_Rediffmail": {
        "category": "Emails",
        "brand": "Rediffmail",
        "clicks": 1
    },
    "Bill pay and Utilities_Electricity Bill": {
        "category": "Bill pay and Utilities",
        "brand": "Electricity Bill",
        "clicks": 1
    },
    "Bill pay and Utilities_Water Bill": {
        "category": "Bill pay and Utilities",
        "brand": "Water Bill",
        "clicks": 1
    },
    "Bill pay and Utilities_Gas Cylinder": {
        "category": "Bill pay and Utilities",
        "brand": "Gas Cylinder",
        "clicks": 1
    },
    "Bill pay and Utilities_HP Pay": {
        "category": "Bill pay and Utilities",
        "brand": "HP Pay",
        "clicks": 2
    },
    "Emails_Gmail": {
        "category": "Emails",
        "brand": "Gmail",
        "clicks": 1
    }
};
