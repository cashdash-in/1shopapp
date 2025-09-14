
import type { Service } from '@/components/service-tile';
import { ShoppingCart, UtensilsCrossed, Receipt, Plane, Shield, Landmark, Truck, Users, Newspaper, Search as SearchIcon, Building2, Ticket, Mail } from 'lucide-react';

export const services: Service[] = [
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
        {
            name: 'Beauty',
            links: [
                { name: 'Nykaa', href: 'https://www.nykaa.com/' },
                { name: 'Purplle', href: 'https://www.purplle.com/' },
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
    name: 'Bill pay and Utilities', 
    icon: Receipt, 
    color: '#4CAF50', 
    categories: [
      {
        name: 'UPI',
        links: [
          { name: 'Paytm', href: 'https://paytm.com/recharge?ref=1shopapp'},
          { name: 'PhonePe', href: 'https://www.phonepe.com?ref=1shopapp'},
          { name: 'Google Pay', href: 'https://pay.google.com/intl/en_in/about/?ref=1shopapp'},
          { name: 'HP Pay', href: 'https://pay.hindustanpetroleum.com/hp-pay-web/user-login'},
        ]
      },
      {
          name: 'Utilities',
          links: [
              { name: 'Electricity Bill', href: 'https://www.google.com/search?q=electricity+bill+payment' },
              { name: 'Water Bill', href: 'https://www.google.com/search?q=water+bill+payment' },
              { name: 'Gas Cylinder', href: 'https://www.google.com/search?q=gas+cylinder+booking' },
          ]
      }
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
      { name: 'Policybazaar', href: 'https://www.policybazaar.com/motor-insurance/' },
      { name: 'Acko', href: 'https://www.acko.com/car-insurance/' },
      { name: 'Digit', href: 'https://www.godigit.com/motor-insurance' },
    ],
  },
  { 
    name: 'Finance & Investing', 
    color: '#2E7D32',
    icon: Landmark, 
    categories: [
        {
            name: 'Banking',
            links: [
                { name: 'HDFC Bank', href: 'https://www.hdfcbank.com/?ref=1shopapp'},
                { name: 'ICICI Bank', href: 'https://www.icicibank.com/?ref=1shopapp'},
                { name: 'State Bank of India', href: 'https://www.onlinesbi.sbi/?ref=1shopapp'},
                { name: 'Axis Bank', href: 'https://www.axisbank.com/?ref=1shopapp'},
                { name: 'Kotak Mahindra Bank', href: 'https://www.kotak.com/en/personal-banking.html?ref=1shopapp'},
            ]
        },
        {
            name: 'Trading',
            links: [
                { name: 'Moneycontrol', href: 'https://www.moneycontrol.com/' },
                { name: 'ET Markets', href: 'https://economictimes.indiatimes.com/markets' },
                { name: 'Zerodha', href: 'https://zerodha.com/' },
                { name: 'Groww', href: 'https://groww.in/' },
            ]
        }
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
    name: 'News & Social',
    icon: Users,
    color: '#1DA1F2',
    categories: [
        {
            name: 'Social Media',
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
            links: [
                { name: 'Times of India', href: 'https://timesofindia.indiatimes.com/' },
                { name: 'Hindustan Times', href: 'https://www.hindustantimes.com/' },
                { name: 'The Hindu', href: 'https://www.thehindu.com/' },
                { name: 'NDTV', href: 'https://www.ndtv.com/' },
            ]
        }
    ]
  },
  {
    name: 'Search Engine and AI tools',
    icon: SearchIcon,
    color: '#4285F4',
    categories: [
        {
            name: 'Search Engines',
            links: [
                { name: 'Google', href: 'https://www.google.com' },
                { name: 'Bing', href: 'https://www.bing.com' },
                { name: 'DuckDuckGo', href: 'https://www.duckduckgo.com' },
                { name: 'Yahoo Search', href: 'https://search.yahoo.com' },
            ]
        },
        {
            name: 'AI Tools',
            links: [
                { name: 'ChatGPT', href: 'https://chat.openai.com' },
                { name: 'Copilot', href: 'https://copilot.microsoft.com' },
            ]
        }
    ]
  },
  {
    name: 'Emails',
    icon: Mail,
    color: '#DB4437',
    links: [
        { name: 'Gmail', href: 'https://mail.google.com' },
        { name: 'Outlook', href: 'https://outlook.live.com' },
        { name: 'Yahoo Mail', href: 'https://mail.yahoo.com' },
        { name: 'Rediffmail', href: 'https://mail.rediff.com' },
    ]
  }
];
