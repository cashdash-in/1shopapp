
'use client';

import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon, ArrowUpRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

// All services data, including brand links
const ALL_SERVICES_DATA = [
  { 
    category: 'Shopping', 
    brands: [
      { name: 'Flipkart', href: 'https://www.flipkart.com?ref=1shopapp' },
      { name: 'Amazon', href: 'https://www.amazon.in?ref=1shopapp' },
      { name: 'Myntra', href: 'https://www.myntra.com?ref=1shopapp' },
      { name: 'Ajio', href: 'https://www.ajio.com?ref=1shopapp' },
      { name: 'Meesho', href: 'https://www.meesho.com?ref=1shopapp' },
      { name: 'DMart', href: 'https://www.dmart.in?ref=1shopapp' },
      { name: 'Blinkit', href: 'https://www.blinkit.com?ref=1shopapp' },
      { name: 'Croma', href: 'https://www.croma.com?ref=1shopapp' },
    ]
  },
  { 
    name: 'Food Delivery', 
    brands: [
      { name: 'Swiggy', href: 'https://www.swiggy.com?ref=1shopapp' },
      { name: 'Zomato', href: 'https://www.zomato.com?ref=1shopapp' },
    ] 
  },
   { name: 'Bill Pay', brands: [
      { name: 'Paytm', href: 'https://paytm.com/recharge?ref=1shopapp'},
      { name: 'PhonePe', href: 'https://www.phonepe.com/en/bill-payments/?ref=1shopapp'},
      { name: 'Google Pay', href: 'https://pay.google.com/intl/en_in/about/?ref=1shopapp'},
   ]},
   { name: 'Travel', brands: [
      { name: 'MakeMyTrip', href: 'https://www.makemytrip.com/?ref=1shopapp'},
      { name: 'Goibibo', href: 'https://www.goibibo.com/?ref=1shopapp'},
      { name: 'Ixigo', href: 'https://www.ixigo.com/?ref=1shopapp'},
      { name: 'Cleartrip', href: 'https://www.cleartrip.com/?ref=1shopapp'},
      { name: 'OYO', href: 'https://www.oyorooms.com/?ref=1shopapp' },
   ]},
   { name: 'Housing', brands: [
        { name: 'MagicBricks', href: 'https://www.magicbricks.com/'},
        { name: '99acres', href: 'https://www.99acres.com/'},
        { name: 'Housing.com', href: 'https://housing.com/'},
        { name: 'NoBroker', href: 'https://www.nobroker.in/'},
   ]},
   { name: 'Insurance', brands: [
        { name: 'Policybazaar', href: 'https://www.policybazaar.com/?ref=1shopapp'},
        { name: 'Acko', href: 'https://www.acko.com/?ref=1shopapp'},
        { name: 'Digit', href: 'https://www.godigit.com/?ref=1shopapp'},
   ]},
   { name: 'Finance', brands: [
        { name: 'HDFC Bank', href: 'https://www.hdfcbank.com/?ref=1shopapp'},
        { name: 'ICICI Bank', href: 'https://www.icicibank.com/?ref=1shopapp'},
        { name: 'State Bank of India', href: 'https://www.onlinesbi.sbi/?ref=1shopapp'},
        { name: 'Axis Bank', href: 'https://www.axisbank.com/?ref=1shopapp'},
        { name: 'Kotak Mahindra Bank', href: 'https://www.kotak.com/en/personal-banking.html?ref=1shopapp'},
        { name: 'Punjab National Bank', href: 'https://www.pnbindia.in/?ref=1shopapp'},
        { name: 'IndusInd Bank', href: 'https://www.indusind.com/?ref=1shopapp'},
        { name: 'Bandhan Bank', href: 'https://www.bandhanbank.com/?ref=1shopapp'}
   ]},
   { name: 'Transport & Logistics', brands: [
      { name: 'Uber', href: 'https://www.uber.com/in/en/' },
      { name: 'Ola', href: 'https://www.olacabs.com/' },
      { name: 'inDrive', href: 'https://www.indrive.com/en/home/' },
      { name: 'Delhivery', href: 'https://www.delhivery.com/' },
      { name: 'Blue Dart', href: 'https://www.bluedart.com/' },
      { name: 'DTDC', href: 'https://www.dtdc.in/' },
      { name: 'Shiprocket', href: 'https://www.shiprocket.in/' },
   ]},
   { name: 'Beauty', brands: [
      { name: 'Nykaa', href: 'https://www.nykaa.com/' },
      { name: 'Purplle', href: 'https://www.purplle.com/' },
      { name: 'Sephora', href: 'https://www.sephora.com/' },
   ]},
   { name: 'Social Media', brands: [
      { name: 'Facebook', href: 'https://www.facebook.com/' },
      { name: 'Instagram', href: 'https://www.instagram.com/' },
      { name: 'X (Twitter)', href: 'https://www.twitter.com/' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/' },
      { name: 'WhatsApp', href: 'https://www.whatsapp.com/' },
   ]},
   { name: 'News', brands: [
      { name: 'Times of India', href: 'https://timesofindia.indiatimes.com/' },
      { name: 'Hindustan Times', href: 'https://www.hindustantimes.com/' },
      { name: 'The Hindu', href: 'https://www.thehindu.com/' },
      { name: 'NDTV', href: 'https://www.ndtv.com/' },
   ]},
   { name: 'Market', brands: [
      { name: 'Moneycontrol', href: 'https://www.moneycontrol.com/' },
      { name: 'ET Markets', href: 'https://economictimes.indiatimes.com/markets' },
      { name: 'Zerodha', href: 'https://zerodha.com/' },
      { name: 'Groww', href: 'https://groww.in/' },
      { name: 'Angel Broking', href: 'https://www.angelone.in/' },
      { name: 'Sharekhan', href: 'https://www.sharekhan.com/' },
      { name: 'ICICI Securities', href: 'https://www.icicidirect.com/' },
   ]}
];

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
    const internalResults = ALL_SERVICES_DATA.flatMap(category => 
        category.brands.filter(brand => brand.name.toLowerCase().includes(lowerCaseQuery) || (category.category || category.name).toLowerCase().includes(lowerCaseQuery))
    );
    // Remove duplicates
    const uniqueResults = Array.from(new Set(internalResults.map(a => a.name)))
        .map(name => {
            return internalResults.find(a => a.name === name)!
        });

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
            placeholder="Search for any service or brand..."
            className="h-12 text-lg pl-4 pr-12 rounded-full shadow-md"
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
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>
            </div>
        )}

        {!loading && error && <p className="text-destructive text-center">{error}</p>}

        {!loading && !error && query && (
          <div className="space-y-8">
            {serviceResults.length > 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Search Results</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {serviceResults.map(brand => (
                             <Button key={brand.name} asChild variant="secondary" className="justify-between h-12 text-base">
                                <Link href={brand.href} target="_blank" rel="noopener noreferrer">
                                    <span>{brand.name}</span>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            ) : (
                 <p className="text-muted-foreground text-center py-12">No results found for "{query}".</p>
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
