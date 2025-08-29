'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceTile } from '@/components/service-tile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Search } from 'lucide-react';
import { ShoppingCart, UtensilsCrossed, Receipt, Plane, Shield, Landmark } from 'lucide-react';
import type { Service } from '@/components/service-tile';

const services: Service[] = [
  { 
    name: 'Shopping', 
    icon: ShoppingCart, 
    color: '#8A2BE2', 
    links: [
      { name: 'Flipkart', href: 'https://www.flipkart.com?ref=1shopapp' },
      { name: 'Amazon', href: 'https://www.amazon.in?ref=1shopapp' },
      { name: 'Meesho', href: 'https://www.meesho.com?ref=1shopapp' },
      { name: 'DMart', href: 'https://www.dmart.in?ref=1shopapp' },
      { name: 'Blinkit', href: 'https://www.blinkit.com?ref=1shopapp' },
      { name: 'Croma', href: 'https://www.croma.com?ref=1shopapp' },
    ] 
  },
  { 
    name: 'Food Delivery', 
    icon: UtensilsCrossed, 
    color: '#FC8019', 
    links: [
      { name: 'Swiggy', href: 'https://www.swiggy.com?ref=1shopapp' },
      { name: 'Zomato', href: 'https://www.zomato.com?ref=1shopapp' },
    ] 
  },
  { name: 'Smart Assistant', icon: Bot, color: '#3c82f6', href: '/assistant' },
  { 
    name: 'Bill Pay', 
    icon: Receipt, 
    color: '#4CAF50', 
    links: [
      { name: 'Paytm', href: 'https://paytm.com/recharge?ref=1shopapp'},
      { name: 'PhonePe', href: 'https://www.phonepe.com/en/bill-payments/?ref=1shopapp'},
      { name: 'Google Pay', href: 'https://pay.google.com/intl/en_in/about/?ref=1shopapp'},
    ] 
  },
  { 
    name: 'Travel', 
    icon: Plane, 
    color: '#00B9F1', 
    links: [
      { name: 'MakeMyTrip', href: 'https://www.makemytrip.com/?ref=1shopapp'},
      { name: 'Goibibo', href: 'https://www.goibibo.com/?ref=1shopapp'},
      { name: 'Ixigo', href: 'https://www.ixigo.com/?ref=1shopapp'},
    ] 
  },
  { 
    name: 'Insurance', 
    icon: Shield, 
    color: '#6A1B9A', 
    links: [
        { name: 'Policybazaar', href: 'https://www.policybazaar.com/?ref=1shopapp'},
        { name: 'Acko', href: 'https://www.acko.com/?ref=1shopapp'},
        { name: 'Digit', href: 'https://www.godigit.com/?ref=1shopapp'},
    ]
  },
  { 
    name: 'Banking', 
    icon: Landmark, 
    color: '#2E7D32',
    links: [
        { name: 'HDFC Bank', href: 'https://www.hdfcbank.com/?ref=1shopapp'},
        { name: 'ICICI Bank', href: 'https://www.icicibank.com/?ref=1shopapp'},
        { name: 'State Bank of India', href: 'https://www.onlinesbi.sbi/?ref=1shopapp'},
    ]
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/compare?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-2">
          1ShopApp
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Declutter your phone. Access all your essential apps in one place and save storage space.
        </p>
      </div>

      <div className="w-full max-w-xl mb-8">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Compare prices across stores..."
            className="w-full pl-10 pr-20 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-9">
            Compare
          </Button>
        </form>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {services.map((service) => (
            <ServiceTile
              key={service.name}
              service={service}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
