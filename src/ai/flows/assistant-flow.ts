'use server';
/**
 * @fileOverview An AI flow for finding deals and promotions.
 *
 * - shoppingAssistant - A function that finds shopping deals.
 * - AssistantResponse - The response type for the shoppingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {findProducts} from '@/ai/tools/product-finder';

const DealSchema = z.object({
  title: z.string().describe('The title of the deal or promotion.'),
  description: z.string().describe('A brief description of the deal.'),
  retailer: z.string().describe('The retailer offering the deal.'),
  url: z.string().url().optional().describe('A URL to the deal.'),
});
export type Deal = z.infer<typeof DealSchema>;

const AssistantResponseSchema = z.object({
  summary: z
    .string()
    .describe('A friendly, conversational summary of the deals found for the user.'),
  deals: z.array(DealSchema).describe('A list of deals and promotions found.'),
});
export type AssistantResponse = z.infer<typeof AssistantResponseSchema>;


const shoppingPrompt = ai.definePrompt({
  name: 'shoppingPrompt',
  input: {schema: z.string()},
  output: {schema: AssistantResponseSchema},
  tools: [findProducts],
  prompt: `You are a shopping assistant for an app called 1ShopApp. Your goal is to help users find the best deals and promotions based on their requests.

Use the findProducts tool to search for products related to the user's query. The user's query is: {{{prompt}}}

Based on the tool's output, create a friendly, conversational summary of what you found.

If the tool returns relevant products, create a list of deals. Each product found can be considered a deal. For each deal, provide a title (the product name), a brief description (you can create a short, appealing one), the retailer offering the best price, and a URL if available.

If you cannot find relevant deals, inform the user in a friendly way in the summary and leave the deals array empty.
`,
});

export async function shoppingAssistant(query: string): Promise<AssistantResponse> {
  const result = await shoppingPrompt(query);
  const output = result.output;

  if (!output) {
    return {
        summary: "Sorry, I'm having trouble connecting. Please try again later.",
        deals: [],
    }
  }

  if (output.deals.length === 0 && !output.summary) {
     return {
        summary: "I couldn't find any specific deals for that right now, but I'm always looking! Try asking about something else, like 'discounts on laptops' or 'coupons for shoes'.",
        deals: [],
    }
  }

  return output;
}
