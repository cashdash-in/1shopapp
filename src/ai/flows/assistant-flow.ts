'use server';
/**
 * @fileOverview An AI flow for finding deals and promotions.
 *
 * - shoppingAssistant - A function that finds shopping deals.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DealSchema = z.object({
  title: z.string().describe('The title of the deal or promotion.'),
  description: z.string().describe('A brief description of the deal.'),
  retailer: z.string().describe('The retailer offering the deal.'),
  url: z.string().url().optional().describe('A URL to the deal.'),
});

const DealsResponseSchema = z.object({
  deals: z
    .array(DealSchema)
    .describe('A list of deals and promotions found.'),
  summary: z
    .string()
    .describe('A friendly summary of the deals found for the user.'),
});

const shoppingPrompt = ai.definePrompt({
  name: 'shoppingPrompt',
  input: {schema: z.string()},
  output: {schema: DealsResponseSchema},
  prompt: `You are a shopping assistant for an app called 1ShopApp. Your goal is to help users find the best deals and promotions based on their requests.

You should search for real, current deals if you can. If you cannot find real deals, you should create realistic example deals based on the user's query.

For each deal, provide a title, a brief description, the retailer, and a URL if available.

In addition to the list of deals, provide a friendly, conversational summary of what you found.

User query: {{{prompt}}}
`,
});

async function shoppingAssistant(query: string): Promise<string> {
  const llmResponse = await shoppingPrompt(query);
  const dealsData = llmResponse.output;

  if (!dealsData || !dealsData.deals || dealsData.deals.length === 0) {
    return (
      dealsData?.summary ||
      "I couldn't find any specific deals for that right now, but I'm always looking! Try asking about something else, like 'discounts on laptops' or 'coupons for shoes'."
    );
  }

  let responseText = dealsData.summary + '\n\n';
  dealsData.deals.forEach(deal => {
    responseText += `**${deal.title}** at ${deal.retailer}\n`;
    responseText += `${deal.description}\n`;
    if (deal.url) {
      responseText += `[View Deal](${deal.url})\n`;
    }
    responseText += '\n';
  });

  return responseText;
}

// We are exporting the async function directly to be used in the UI.
// The ai.defineFlow is implicitly created by the prompt.
export {shoppingAssistant};
