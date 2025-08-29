'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ProductComparisonCard } from '@/components/product-comparison-card';
import type { Product } from '@/ai/flows/compare-products-flow';
import { compareProducts } from '@/ai/flows/compare-products-flow';
import { Skeleton } from '@/components/ui/skeleton';

function CompareResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!!query);

  useEffect(() => {
    async function fetchProducts() {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const results = await compareProducts(query);
        setProducts(results);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [query]);


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newQuery = formData.get('query') as string;
    router.push(`/compare?q=${encodeURIComponent(newQuery)}`);
  };

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
          {query && !loading && (
            <p className="text-muted-foreground mb-6">
              Showing results for: <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
            </p>
          )}

          <div className="grid gap-6 md:gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
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

function CardSkeleton() {
    return (
      <div className="border bg-card text-card-foreground shadow-sm rounded-lg p-6">
        <div className="md:flex">
          <div className="md:w-1/3">
            <Skeleton className="w-full h-48 rounded-md" />
          </div>
          <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0">
             <Skeleton className="h-8 w-3/4 mb-4" />
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-24" />
                </div>
                 <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-24" />
                </div>
             </div>
          </div>
        </div>
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
