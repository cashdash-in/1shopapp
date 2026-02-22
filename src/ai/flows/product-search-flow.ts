'use server';

/**
 * @fileOverview A flow for intelligent product search and recommendations with simulation fallback.
 *
 * - searchProducts - A function that suggests products or brands based on a query.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { ProductSearchInput, ProductSearchOutput } from '../schemas';

const MODEL = 'googleai/gemini-1.5-flash';

const ProductSearchInputSchema = z.object({
  query: z.string().describe('The user search query or brand name.'),
});

const ProductSearchOutputSchema = z.object({
  results: z.array(z.string()).describe('A list of suggested products, brands, or categories.'),
});

const prompt = ai.definePrompt({
  name: 'productSearchPrompt',
  model: MODEL,
  input: { schema: ProductSearchInputSchema },
  output: { schema: ProductSearchOutputSchema },
  prompt: `You are an AI e-commerce assistant for 1ShopApp, a one-stop app for Indian consumers.
  
  User query: "{{query}}"
  
  Suggest a list of 5-8 relevant products, brands, or niche categories available in popular Indian apps like Flipkart, Amazon, Myntra, Ajio, or Blinkit. 
  
  If the query is a brand, suggest its top categories. If the query is a product, suggest related items or top brands for that product.
  
  Keep suggestions short and formatted for a list display.`,
});

export async function searchProducts(
  input: ProductSearchInput
): Promise<ProductSearchOutput> {
  try {
    const { output } = await prompt(input);
    if (!output) throw new Error('AI Error');
    return output;
  } catch (error) {
    console.warn("Product Search AI failed, using simulation:", error);
    const q = input.query.toLowerCase();
    
    if (q.includes('shoes') || q.includes('nike') || q.includes('fashion')) {
        return { results: ["Nike Air Max", "Adidas Ultraboost", "Puma Lifestyle Sneakers", "Myntra Fashion Deals", "Ajio Trends", "Skechers Walkers"] };
    }
    
    if (q.includes('iphone') || q.includes('mobile') || q.includes('tech')) {
        return { results: ["iPhone 15 Pro", "Samsung Galaxy S24 Ultra", "OnePlus 12", "Croma Tech Offers", "Flipkart Mobile Sale", "Amazon Prime Exclusive Tech"] };
    }

    return { 
        results: [
            `Top rated ${input.query} brands`, 
            `Budget-friendly ${input.query} options`, 
            `Latest ${input.query} arrivals`, 
            "Blinkit 10-min delivery items", 
            "Amazon Bestsellers in this category"
        ] 
    };
  }
}