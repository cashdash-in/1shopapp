'use server';
/**
 * @fileOverview A flow for comparing product prices across retailers.
 *
 * - compareProducts - A function that takes a search query and returns product comparisons.
 * - Product - The type definition for a product.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ProductPriceSchema = z.object({
  retailer: z.string().describe('The name of the retailer.'),
  price: z.string().describe('The price of the product at the retailer.'),
  url: z.string().url().describe("The URL to the product page on the retailer's website."),
});

const ProductSchema = z.object({
  id: z.number().describe('A unique identifier for the product.'),
  name: z.string().describe('The name of the product.'),
  imageUrl: z.string().url().describe('A URL for an image of the product.'),
  prices: z.array(ProductPriceSchema).describe('A list of prices from different retailers.'),
});

export type Product = z.infer<typeof ProductSchema>;

const DUMMY_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    imageUrl: 'https://picsum.photos/seed/headphones/600/400',
    prices: [
      { retailer: 'Amazon', price: '28,990', url: 'https://www.amazon.in/s?k=Sony+WH-1000XM5+Wireless+Headphones&ref=1shopapp' },
      { retailer: 'Flipkart', price: '29,990', url: 'https://www.flipkart.com/search?q=Sony+WH-1000XM5+Wireless+Headphones&ref=1shopapp' },
      { retailer: 'Croma', price: '29,490', url: 'https://www.croma.com/search/?q=Sony%20WH-1000XM5%20Wireless%20Headphones&ref=1shopapp' },
    ],
  },
  {
    id: 2,
    name: 'Apple iPhone 15 Pro',
    imageUrl: 'https://picsum.photos/seed/iphone/600/400',
    prices: [
      { retailer: 'Amazon', price: '1,34,900', url: 'https://www.amazon.in/s?k=Apple+iPhone+15+Pro&ref=1shopapp' },
      { retailer: 'Flipkart', price: '1,34,900', url: 'https://www.flipkart.com/search?q=Apple+iPhone+15+Pro&ref=1shopapp' },
      { retailer: 'Apple Store', price: '1,34,900', url: 'https://www.apple.com/in/search/iphone-15-pro?ref=1shopapp' },
    ],
  },
   {
    id: 3,
    name: 'Samsung Galaxy S24 Ultra',
    imageUrl: 'https://picsum.photos/seed/samsung/600/400',
    prices: [
      { retailer: 'Amazon', price: '1,29,999', url: 'https://www.amazon.in/s?k=Samsung+Galaxy+S24+Ultra&ref=1shopapp' },
      { retailer: 'Flipkart', price: '1,31,999', url: 'https://www.flipkart.com/search?q=Samsung+Galaxy+S24+Ultra&ref=1shopapp' },
      { retailer: 'Samsung.com', price: '1,29,999', url: 'https://www.samsung.com/in/search/?q=Galaxy%20S24%20Ultra&ref=1shopapp' },
    ],
  },
  {
    id: 4,
    name: 'Dell XPS 15 Laptop',
    imageUrl: 'https://picsum.photos/seed/laptop/600/400',
    prices: [
      { retailer: 'Amazon', price: '1,89,990', url: 'https://www.amazon.in/s?k=Dell+XPS+15+Laptop&ref=1shopapp' },
      { retailer: 'Dell India', price: '1,92,490', url: 'https://www.dell.com/en-in/search/xps%2015&ref=1shopapp' },
      { retailer: 'Croma', price: '1,90,990', url: 'https://www.croma.com/search/?q=Dell%20XPS%2015&ref=1shopapp' },
    ],
  },
  {
    id: 5,
    name: 'LG C3 55-inch OLED TV',
    imageUrl: 'https://picsum.photos/seed/tv/600/400',
    prices: [
      { retailer: 'Amazon', price: '1,39,990', url: 'https://www.amazon.in/s?k=LG+C3+55-inch+OLED+TV&ref=1shopapp' },
      { retailer: 'Flipkart', price: '1,41,990', url: 'https://www.flipkart.com/search?q=LG+C3+55-inch+OLED+TV&ref=1shopapp' },
      { retailer: 'LG India', price: '1,44,990', url: 'https://www.lg.com/in/search?q=LG%20C3%2055-inch%20OLED&ref=1shopapp' },
    ],
  },
  {
    id: 6,
    name: 'Bose QuietComfort Ultra Headphones',
    imageUrl: 'https://picsum.photos/seed/bose/600/400',
    prices: [
      { retailer: 'Amazon', price: '32,900', url: 'https://www.amazon.in/s?k=Bose+QuietComfort+Ultra+Headphones&ref=1shopapp' },
      { retailer: 'Bose India', price: '32,900', url: 'https://www.boseindia.com/en_in/search.html?q=quietcomfort%20ultra&ref=1shopapp' },
    ],
  },
  {
    id: 7,
    name: 'Apple MacBook Air M2',
    imageUrl: 'https://picsum.photos/seed/macbook/600/400',
    prices: [
      { retailer: 'Amazon', price: '99,900', url: 'https://www.amazon.in/s?k=Apple+MacBook+Air+M2&ref=1shopapp' },
      { retailer: 'Flipkart', price: '99,900', url: 'https://www.flipkart.com/search?q=Apple+MacBook+Air+M2&ref=1shopapp' },
      { retailer: 'Apple Store', price: '99,900', url: 'https://www.apple.com/in/search/macbook-air-m2?ref=1shopapp' },
    ],
  },
];

export async function compareProducts(query: string): Promise<Product[]> {
  return compareProductsFlow(query);
}

const compareProductsFlow = ai.defineFlow(
  {
    name: 'compareProductsFlow',
    inputSchema: z.string(),
    outputSchema: z.array(ProductSchema),
  },
  async (query) => {
    // In a real app, you would use tools to call retailer APIs.
    // For now, we'll filter the dummy data.
    // We'll also add a small delay to simulate network latency.
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!query) {
      return [];
    }
    
    const filteredProducts = DUMMY_PRODUCTS.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );

    return filteredProducts;
  }
);
