
'use server';
/**
 * @fileOverview An AI flow for searching products across partner sites.
 *
 * - searchProducts - An AI-powered function to find which brands likely sell a given product.
 */
import { ai } from '@/ai/genkit';
import { ProductSearchInputSchema, ProductSearchOutputSchema, type ProductSearchInput, type ProductSearchOutput } from '../schemas';

// This is the list of brands the AI can choose from.
// It's important to keep this in sync with the brands on the homepage.
const ECOMMERCE_BRANDS = [
    'Flipkart',
    'Amazon',
    'Myntra',
    'Ajio',
    'Meesho',
    'DMart',
    'Blinkit',
    'Croma',
    'Nykaa',
    'Purplle',
    'Sephora'
];

export async function searchProducts(input: ProductSearchInput): Promise<ProductSearchOutput> {
  return productSearchFlow(input);
}

const productSearchPrompt = ai.definePrompt({
    name: 'productSearchPrompt',
    input: { schema: ProductSearchInputSchema },
    output: { schema: ProductSearchOutputSchema },
    prompt: `You are a product search expert for an app called 1ShopApp. Your goal is to help users find which online stores sell the product they are looking for.

You will be given a user's search query.
User Query: "{{query}}"

First, determine the general category of the product.
Second, based on the product, identify which of the following stores are most likely to sell it. The user is in India, so prioritize Indian retailers.

Available Stores:
${ECOMMERCE_BRANDS.join(', ')}

Return a list of the most relevant brand names from the available list. Only include brands that are highly relevant. For example, if someone searches for "mascara," you should only return beauty stores like Nykaa and Purplle, not a general marketplace like Flipkart unless you are sure. If someone searches for a "laptop," Croma and Amazon are excellent choices.
`,
});

const productSearchFlow = ai.defineFlow(
  {
    name: 'productSearchFlow',
    inputSchema: ProductSearchInputSchema,
    outputSchema: ProductSearchOutputSchema,
  },
  async (input) => {
    const { output } = await productSearchPrompt(input);
    if (!output) {
      throw new Error("The AI model did not return a valid output.");
    }
    return output;
  }
);
