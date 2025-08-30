'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ServiceTile } from '@/components/service-tile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Search, Handshake } from 'lucide-react';
import { ShoppingCart, UtensilsCrossed, Receipt, Plane, Shield, Landmark, Truck, Sparkles, Users, Newspaper, LineChart, Car } from 'lucide-react';
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
      { name: 'Cleartrip', href: 'https://www.cleartrip.com/?ref=1shopapp'},
    ] 
  },
  {
    name: 'Cabs',
    icon: Car,
    color: '#FFD700',
    links: [
      { name: 'Uber', href: 'https://www.uber.com/in/en/' },
      { name: 'Ola', href: 'https://www.olacabs.com/' },
      { name: 'inDrive', href: 'https://www.indrive.com/en/home/' },
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
  {
    name: 'Logistics',
    icon: Truck,
    color: '#FFC300',
    links: [
      { name: 'Delhivery', href: 'https://www.delhivery.com/' },
      { name: 'Blue Dart', href: 'https://www.bluedart.com/' },
      { name: 'DTDC', href: 'https://www.dtdc.in/' },
      { name: 'Shiprocket', href: 'https://www.shiprocket.in/' },
    ]
  },
  {
    name: 'Beauty',
    icon: Sparkles,
    color: '#E5398D',
    links: [
      { name: 'Nykaa', href: 'https://www.nykaa.com/' },
      { name: 'Purplle', href: 'https://www.purplle.com/' },
      { name: 'Sephora', href: 'https://www.sephora.com/' },
    ]
  },
  {
    name: 'Social Media',
    icon: Users,
    color: '#1DA1F2',
    links: [
      { name: 'Facebook', href: 'https://www.facebook.com/' },
      { name: 'Instagram', href: 'https://www.instagram.com/' },
      { name: 'X (Twitter)', href: 'https://www.twitter.com/' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/' },
      { name: 'WhatsApp', href: 'https://www.whatsapp.com/' },
    ]
  },
  {
    name: 'News',
    icon: Newspaper,
    color: '#B91C1C',
    links: [
      { name: 'Times of India', href: 'https://timesofindia.indiatimes.com/' },
      { name: 'Hindustan Times', href: 'https://www.hindustantimes.com/' },
      { name: 'The Hindu', href: 'https://www.thehindu.com/' },
      { name: 'NDTV', href: 'https://www.ndtv.com/' },
    ]
  },
  {
    name: 'Financials',
    icon: LineChart,
    color: '#0288D1',
    links: [
      { name: 'Moneycontrol', href: 'https://www.moneycontrol.com/' },
      { name: 'ET Markets', href: 'https://economictimes.indiatimes.com/markets' },
      { name: 'Zerodha', href: 'https://zerodha.com/' },
      { name: 'Groww', href: 'https://groww.in/' },
    ]
  },
  {
    name: 'Partner with Us',
    icon: Handshake,
    color: '#34D399',
    href: '/partner',
  }
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
    <>
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-2">
            1ShopApp
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {services.map((service) => (
              <ServiceTile
                key={service.name}
                service={service}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-8 max-w-2xl">
          Some of the links we share are part of affiliate programs. When you make a purchase, we may receive a small thank-you from the brand—without affecting your cost. It’s a quiet way you help keep 1ShopApp free for all.
        </p>
      </main>
      <Link href="/assistant" passHref>
        <Button
          variant="default"
          className="fixed bottom-8 left-8 h-16 w-16 rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">Open AI Assistant</span>
        </Button>
      </Link>
    </>
  );
}
