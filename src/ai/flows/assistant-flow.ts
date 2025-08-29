'use server';
/**
 * @fileOverview An AI flow for finding deals and promotions.
 *
 * - shoppingAssistant - A function that finds shopping deals.
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

const DealsResponseSchema = z.object({
  deals: z.array(DealSchema).describe('A list of deals and promotions found.'),
  summary: z
    .string()
    .describe('A friendly summary of the deals found for the user.'),
});

const shoppingPrompt = ai.definePrompt({
  name: 'shoppingPrompt',
  input: {schema: z.string()},
  output: {schema: DealsResponseSchema},
  tools: [findProducts],
  prompt: `You are a shopping assistant for an app called 1ShopApp. Your goal is to help users find the best deals and promotions based on their requests.

Use the findProducts tool to search for products related to the user's query. The user's query is: {{{prompt}}}

Based on the tool's output, create a friendly, conversational summary of what you found.

If the tool returns relevant products, create a list of deals. For each deal, provide a title, a brief description, and the retailer.

If you cannot find relevant deals, inform the user in a friendly way.
`,
});

export async function shoppingAssistant(query: string): Promise<string> {
  const {output} = await shoppingPrompt(query);

  if (!output || !output.deals || output.deals.length === 0) {
    return (
      output?.summary ||
      "I couldn't find any specific deals for that right now, but I'm always looking! Try asking about something else, like 'discounts on laptops' or 'coupons for shoes'."
    );
  }

  let responseText = output.summary + '\n\n';
  output.deals.forEach(deal => {
    responseText += `*${deal.title}* at ${deal.retailer}\n`;
    responseText += `${deal.description}\n\n`;
  });

  return responseText;
}