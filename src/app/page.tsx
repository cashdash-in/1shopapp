
'use client';

import Link from 'next/link';
import { ServiceTile } from '@/components/service-tile';
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
    name: 'Finance', 
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
    name: 'Market',
    icon: LineChart,
    color: '#0288D1',
    links: [
      { name: 'Moneycontrol', href: 'https://www.moneycontrol.com/' },
      { name: 'ET Markets', href: 'https://economictimes.indiatimes.com/markets' },
      { name: 'Zerodha', href: 'https://zerodha.com/' },
      { name: 'Groww', href: 'https://groww.in/' },
    ]
  }
];

export default function Home() {
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
        <footer className="text-center mt-8 max-w-4xl mx-auto px-4 space-y-4">
            <p className="text-[11px] text-muted-foreground/90">
              <span className='font-bold'>Disclaimer:</span> 1ShopApp is an independent platform. We are not affiliated with, sponsored by, or endorsed by the brands featured. We may earn a commission from affiliate links, at no extra cost to you. Use of this service is at your own discretion.
            </p>
            <div className="flex justify-center items-center gap-4">
               <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground underline">
                  About Us
              </Link>
              <Link href="/partner" className="text-xs text-muted-foreground hover:text-foreground underline">
                  Partner with us
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground underline">
                  Terms & Conditions
              </Link>
              <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground underline">
                  Admin
              </Link>
            </div>
        </footer>
      </main>
    </>
  );
}
