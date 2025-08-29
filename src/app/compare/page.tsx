'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ProductComparisonCard } from '@/components/product-comparison-card';

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: 'Sony WH-1000XM5 Wireless Headphones',
    prices: [
      { retailer: 'Amazon', price: '28,990', url: 'https://www.amazon.in/s?k=Sony+WH-1000XM5+Wireless+Headphones&ref=1shopapp' },
      { retailer: 'Flipkart', price: '29,990', url: 'https://www.flipkart.com/search?q=Sony+WH-1000XM5+Wireless+Headphones&ref=1shopapp' },
      { retailer: 'Croma', price: '29,490', url: 'https://www.croma.com/search/?q=Sony%20WH-1000XM5%20Wireless%20Headphones&ref=1shopapp' },
    ],
  },
  {
    id: 2,
    name: 'Apple iPhone 15 Pro',
    prices: [
      { retailer: 'Amazon', price: '1,34,900', url: 'https://www.amazon.in/s?k=Apple+iPhone+15+Pro&ref=1shopapp' },
      { retailer: 'Flipkart', price: '1,34,900', url: 'https://www.flipkart.com/search?q=Apple+iPhone+15+Pro&ref=1shopapp' },
      { retailer: 'Apple Store', price: '1,34,900', url: 'https://www.apple.com/in/search/iphone-15-pro?ref=1shopapp' },
    ],
  },
   {
    id: 3,
    name: 'Samsung Galaxy S24 Ultra',
    prices: [
      { retailer: 'Amazon', price: '1,29,999', url: 'https://www.amazon.in/s?k=Samsung+Galaxy+S24+Ultra&ref=1shopapp' },
      { retailer: 'Flipkart', price: '1,31,999', url: 'https://www.flipkart.com/search?q=Samsung+Galaxy+S24+Ultra&ref=1shopapp' },
      { retailer: 'Samsung.com', price: '1,29,999', url: 'https://www.samsung.com/in/search/?q=Galaxy%20S24%20Ultra&ref=1shopapp' },
    ],
  },
  {
    id: 4,
    name: 'Dell XPS 15 Laptop',
    prices: [
      { retailer: 'Amazon', price: '1,89,990', url: 'https://www.amazon.in/s?k=Dell+XPS+15+Laptop&ref=1shopapp' },
      { retailer: 'Dell India', price: '1,92,490', url: 'https://www.dell.com/en-in/search/xps%2015&ref=1shopapp' },
      { retailer: 'Croma', price: '1,90,990', url: 'https://www.croma.com/search/?q=Dell%20XPS%2015&ref=1shopapp' },
    ],
  },
  {
    id: 5,
    name: 'LG C3 55-inch OLED TV',
    prices: [
      { retailer: 'Amazon', price: '1,39,990', url: 'https://www.amazon.in/s?k=LG+C3+55-inch+OLED+TV&ref=1shopapp' },
      { retailer: 'Flipkart', price: '1,41,990', url: 'https://www.flipkart.com/search?q=LG+C3+55-inch+OLED+TV&ref=1shopapp' },
      { retailer: 'LG India', price: '1,44,990', url: 'https://www.lg.com/in/search?q=LG%20C3%2055-inch%20OLED&ref=1shopapp' },
    ],
  },
  {
    id: 6,
    name: 'Bose QuietComfort Ultra Headphones',
    prices: [
      { retailer: 'Amazon', price: '32,900', url: 'https://www.amazon.in/s?k=Bose+QuietComfort+Ultra+Headphones&ref=1shopapp' },
      { retailer: 'Bose India', price: '32,900', url: 'https://www.boseindia.com/en_in/search.html?q=quietcomfort%20ultra&ref=1shopapp' },
    ],
  },
    {
    id: 7,
    name: 'Apple MacBook Air M2',
    prices: [
      { retailer: 'Amazon', price: '99,900', url: 'https://www.amazon.in/s?k=Apple+MacBook+Air+M2&ref=1shopapp' },
      { retailer: 'Flipkart', price: '99,900', url: 'https://www.flipkart.com/search?q=Apple+MacBook+Air+M2&ref=1shopapp' },
      { retailer: 'Apple Store', price: '99,900', url: 'https://www.apple.com/in/search/macbook-air-m2?ref=1shopapp' },
    ],
  },
];

function CompareResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newQuery = formData.get('query') as string;
    router.push(`/compare?q=${encodeURIComponent(newQuery)}`);
  };

  const filteredProducts = query
    ? DUMMY_PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 md:p-6 border-b sticky top-0 bg-background z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight mb-4">Price Comparison</h1>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              name="query"
              defaultValue={query}
              placeholder="e.g., 'noise-cancelling headphones...'"
              className="w-full pl-10 pr-20 h-12 text-base"
            />
            <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-9">
              Compare
            </Button>
          </form>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {query && (
            <p className="text-muted-foreground mb-6">
              Showing results for: <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
            </p>
          )}

          <div className="grid gap-6 md:gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductComparisonCard key={product.id} product={product} />
              ))
            ) : query ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold">No Results Found</h2>
                <p className="text-muted-foreground mt-2">Try searching for something else, like &quot;iPhone&quot; or &quot;Headphones&quot;.</p>
              </div>
            ) : (
               <div className="text-center py-12">
                <h2 className="text-xl font-semibold">Search to Compare Prices</h2>
                <p className="text-muted-foreground mt-2">Enter a product name above to see prices from top stores.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


export default function ComparePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompareResults />
    </Suspense>
  )
}
