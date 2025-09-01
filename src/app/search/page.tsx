
'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon, ArrowUpRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { trackLinkClick } from '@/lib/analytics';
import { services as ALL_SERVICES_DATA } from '@/app/page';

function SearchPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [currentQuery, setCurrentQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [serviceResults, setServiceResults] = useState<any[]>([]);

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery) {
        setServiceResults([]);
        return;
    };

    setLoading(true);
    setError('');
    
    const lowerCaseQuery = searchQuery.toLowerCase();

    const internalResults = ALL_SERVICES_DATA.flatMap(service => {
        const categoryName = service.name;
        let brands: { name: string; href: string }[] = [];

        if (service.links) {
            brands = brands.concat(service.links);
        }
        if (service.categories) {
            service.categories.forEach(category => {
                brands = brands.concat(category.links);
            });
        }

        return brands
            .filter(brand => brand.name.toLowerCase().includes(lowerCaseQuery) || categoryName.toLowerCase().includes(lowerCaseQuery))
            .map(brand => ({ ...brand, category: categoryName }));
    });
    
    // Remove duplicates by brand name
    const uniqueResults = Array.from(new Map(internalResults.map(item => [item.name, item])).values());

    setServiceResults(uniqueResults);
    setLoading(false);
  }, []);

  useEffect(() => {
    setCurrentQuery(query);
    if (query) {
      performSearch(query);
    } else {
        setServiceResults([]);
        setLoading(false);
    }
  }, [query, performSearch]);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentQuery && currentQuery !== query) {
        router.push(`/search?q=${encodeURIComponent(currentQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/" className="p-2 rounded-full hover:bg-muted -ml-2">
            <SearchIcon className="h-8 w-8 text-primary" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Search</h1>
        </div>
        
        <form onSubmit={handleFormSubmit} className="w-full relative mb-8">
          <Input
            name="search"
            id="search"
            placeholder="Search for your Favourite App or Website"
            className="h-12 text-lg pl-4 pr-12 rounded-full shadow-md border"
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
          />
          <Button type="submit" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full w-9 h-9">
            <SearchIcon className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        {loading && (
            <div className="space-y-6">
                <Skeleton className="h-10 w-1/3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full rounded-lg" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>
        )}

        {!loading && error && <p className="text-destructive text-center">{error}</p>}

        {!loading && !error && query && (
          <div className="space-y-8">
            {serviceResults.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Search Results for &quot;{query}&quot;</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceResults.map(brand => (
                             <Button key={brand.name} asChild variant="secondary" className="justify-between h-12 text-base" onClick={() => trackLinkClick(brand.category, brand.name)}>
                                <Link href={brand.href} target="_blank" rel="noopener noreferrer">
                                    <span>{brand.name}</span>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            ) : (
                 <p className="text-muted-foreground text-center py-12">No results found for &quot;{query}&quot;.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageComponent />
        </Suspense>
    )
}
