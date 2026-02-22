'use server';

/**
 * @fileOverview A flow for intelligent product search and recommendations using AI.
 *
 * - searchProducts - A function that suggests products or brands based on a query.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ProductSearchInput, ProductSearchOutput } from '../schemas';

const ProductSearchInputSchema = z.object({
  query: z.string().describe('The user search query or brand name.'),
});

const ProductSearchOutputSchema = z.object({
  results: z.array(z.string()).describe('A list of suggested products, brands, or categories.'),
});

const prompt = ai.definePrompt({
  name: 'productSearchPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: ProductSearchInputSchema },
  output: { schema: ProductSearchOutputSchema },
  prompt: `You are an AI e-commerce assistant for 1ShopApp, a one-stop app for Indian consumers.
  
  User query: "{{query}}"
  
  Suggest a list of 5-8 relevant products, brands, or niche categories available in popular Indian apps like Flipkart, Amazon, Myntra, Ajio, or Blinkit. 
  
  If the query is a brand, suggest its top categories. If the query is a product, suggest related items or top brands for that product.
  
  Keep suggestions short and formatted for a list display.`,
});

const productSearchFlow = ai.defineFlow(
  {
    name: 'productSearchFlow',
    inputSchema: ProductSearchInputSchema,
    outputSchema: ProductSearchOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI failed to generate search recommendations.');
    return output;
  }
);

export async function searchProducts(
  input: ProductSearchInput
): Promise<ProductSearchOutput> {
  return productSearchFlow(input);
}