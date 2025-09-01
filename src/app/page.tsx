
'use client';

import Link from 'next/link';
import { ServiceTile } from '@/components/service-tile';
import { ShoppingCart, UtensilsCrossed, Receipt, Plane, Shield, Landmark, Truck, Sparkles, Users, Newspaper, LineChart, Home as HomeIcon, Lightbulb, Search as SearchIcon, Building2, Ticket, Download, Wallet } from 'lucide-react';
import type { Service } from '@/components/service-tile';
import { FeedbackDialog } from '@/components/feedback-dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { trackPWAInstall } from '@/lib/analytics';

const services: Service[] = [
  { 
    name: 'Shopping', 
    icon: ShoppingCart, 
    color: '#8A2BE2', 
    categories: [
        {
            name: 'General',
            links: [
                { name: 'Flipkart', href: 'https://www.flipkart.com?ref=1shopapp' },
                { name: 'Amazon', href: 'https://www.amazon.in?ref=1shopapp' },
                { name: 'Meesho', href: 'https://www.meesho.com?ref=1shopapp' },
            ]
        },
        {
            name: 'Fashion',
            links: [
                { name: 'Myntra', href: 'https://www.myntra.com?ref=1shopapp' },
                { name: 'Ajio', href: 'https://www.ajio.com?ref=1shopapp' },
                { name: 'Nykaa Fashion', href: 'https://www.nykaafashion.com/' },
            ]
        },
        {
            name: 'Grocery',
            links: [
                 { name: 'DMart', href: 'https://www.dmart.in?ref=1shopapp' },
                 { name: 'Blinkit', href: 'https://www.blinkit.com?ref=1shopapp' },
            ]
        },
        {
            name: 'Electronics',
            links: [
                { name: 'Croma', href: 'https://www.croma.com?ref=1shopapp' },
            ]
        },
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
      { name: 'PhonePe', href: 'https://www.phonepe.com?ref=1shopapp'},
      { name: 'Google Pay', href: 'https://pay.google.com/intl/en_in/about/?ref=1shopapp'},
    ] 
  },
  { 
    name: 'Hotels & Travel', 
    icon: Plane, 
    color: '#00B9F1', 
    categories: [
        {
            name: 'Flights & Hotels',
            links: [
                { name: 'MakeMyTrip', href: 'https://www.makemytrip.com/?ref=1shopapp'},
                { name: 'Goibibo', href: 'https://www.goibibo.com/?ref=1shopapp'},
                { name: 'Ixigo', href: 'https://www.ixigo.com/?ref=1shopapp'},
                { name: 'Cleartrip', href: 'https://www.cleartrip.com/?ref=1shopapp'},
                { name: 'Booking.com', href: 'https://www.booking.com/?ref=1shopapp' },
                { name: 'Agoda', href: 'https://www.agoda.com/?ref=1shopapp' },
            ]
        },
        {
            name: 'Trains',
            links: [
                { name: 'IRCTC', href: 'https://www.irctc.co.in/' },
            ]
        },
        {
            name: 'Hotel Stays',
            links: [
                { name: 'OYO', href: 'https://www.oyorooms.com/?ref=1shopapp' },
            ]
        }
    ]
  },
  {
    name: 'Housing',
    icon: Building2,
    color: '#38A169',
    links: [
        { name: 'MagicBricks', href: 'https://www.magicbricks.com/'},
        { name: '99acres', href: 'https://www.99acres.com/'},
        { name: 'Housing.com', href: 'https://housing.com/'},
        { name: 'NoBroker', href: 'https://www.nobroker.in/'},
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
    color: '#2E7D32',
    icon: Landmark, 
    links: [
        { name: 'HDFC Bank', href: 'https://www.hdfcbank.com/?ref=1shopapp'},
        { name: 'ICICI Bank', href: 'https://www.icicibank.com/?ref=1shopapp'},
        { name: 'State Bank of India', href: 'https://www.onlinesbi.sbi/?ref=1shopapp'},
        { name: 'Axis Bank', href: 'https://www.axisbank.com/?ref=1shopapp'},
        { name: 'Kotak Mahindra Bank', href: 'https://www.kotak.com/en/personal-banking.html?ref=1shopapp'},
        { name: 'Punjab National Bank', href: 'https://www.pnbindia.in/?ref=1shopapp'},
        { name: 'IndusInd Bank', href: 'https://www.indusind.com/?ref=1shopapp'},
        { name: 'Bandhan Bank', href: 'https://www.bandhanbank.com/?ref=1shopapp'}
    ]
  },
  {
    name: 'Transport & Logistics',
    icon: Truck,
    color: '#FFC300',
    links: [
      { name: 'Uber', href: 'https://www.uber.com/in/en/' },
      { name: 'Ola', href: 'https://www.olacabs.com/' },
      { name: 'inDrive', href: 'https://www.indrive.com/en/home/' },
      { name: 'Delhivery', href: 'https://www.delhivery.com/' },
      { name: 'Blue Dart', href: 'https://www.bluedart.com/' },
      { name: 'DTDC', href: 'https://www.dtdc.in/' },
      { name: 'Shiprocket', href: 'https://www.shiprocket.in/' },
    ]
  },
   {
    name: 'Theaters',
    icon: Ticket,
    color: '#F44336',
    links: [
      { name: 'BookMyShow', href: 'https://in.bookmyshow.com/' },
      { name: 'Paytm Insider', href: 'https://insider.in/' },
      { name: 'TicketNew', href: 'https://www.ticketnew.com/' },
      { name: 'PVR Cinemas', href: 'https://www.pvrcinemas.com/' },
      { name: 'INOX', href: 'https://www.inoxmovies.com/' },
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
      { name: 'Angel Broking', href: 'https://www.angelone.in/' },
      { name: 'Sharekhan', href: 'https://www.sharekhan.com/' },
      { name: 'ICICI Securities', href: 'https://www.icicidirect.com/' },
    ]
  }
];

// Define the type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

export default function Home() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

    useEffect(() => {
        // Check for the admin flag in localStorage
        if (typeof window !== 'undefined') {
            const adminFlag = localStorage.getItem('isAdmin');
            setIsAdmin(adminFlag === 'true');
        }

        // Handle PWA installation prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };

    }, []);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get('search') as string;
        if (query) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleInstallClick = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        // Analytics for the prompt being shown can be tracked here
        installPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                trackPWAInstall(); // Custom analytics event
            }
        });
    };

  return (
    <>
      <main className="h-screen max-h-screen bg-background flex flex-col p-4 overflow-hidden">
        <div className="flex-shrink-0 text-center w-full max-w-2xl mx-auto pt-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-2">
            1ShopApp
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground whitespace-nowrap">
            Declutter your phone. Save Space. All your essential apps in one place.
          </p>
           <form onSubmit={handleSearch} className="mt-6 w-full relative">
                <Input
                    name="search"
                    id="search"
                    placeholder="Search for your Favourite App or Website"
                    className="h-12 text-lg pl-4 pr-12 rounded-full shadow-md border"
                />
                <Button type="submit" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full w-9 h-9">
                    <SearchIcon className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
            </form>
        </div>

        <div className="flex-grow w-full max-w-5xl mx-auto flex items-center justify-center">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {services.map((service) => (
              <ServiceTile
                key={service.name}
                service={service}
              />
            ))}
          </div>
        </div>
        <footer className="flex-shrink-0 text-center max-w-4xl mx-auto px-4 space-y-2 pb-4">
            <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
               <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground underline">
                  About Us
              </Link>
              <Link href="/partner" className="text-xs text-muted-foreground hover:text-foreground underline">
                  Partner with us
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground underline">
                  Terms & Conditions
              </Link>
               <FeedbackDialog>
                    <Button variant="link" className="text-xs text-muted-foreground hover:text-foreground underline p-0 h-auto">Feedback</Button>
               </FeedbackDialog>
               {installPrompt && (
                 <Button variant="link" className="text-xs text-muted-foreground hover:text-foreground underline p-0 h-auto" onClick={handleInstallClick}>
                    <Download className="w-3 h-3 mr-1"/> Install App
                </Button>
               )}
              {isAdmin && (
                <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground underline">
                    Admin
                </Link>
              )}
            </div>
             <p className="text-[10px] text-muted-foreground/80 pt-2">
              <span className="font-bold">Disclaimer:</span> 1ShopApp is an independent platform and your gateway to other websites. We do not collect any personal data. All trademarks and logos are the property of their respective owners. Use of this service is at your own discretion. Some links help support 1ShopApp when used—at no extra cost to you.
            </p>
        </footer>
      </main>
    </>
  );
}
