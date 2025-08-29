
import { ServiceTile } from '@/components/service-tile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bot, Search } from 'lucide-react';
import { ShoppingCart, UtensilsCrossed, Utensils, Receipt, Plane, Shield, Landmark } from 'lucide-react';

const services = [
  { name: 'Flipkart', icon: ShoppingCart, color: '#2874F0', href: 'https://www.flipkart.com' },
  { name: 'Amazon', icon: ShoppingCart, color: '#FF9900', href: 'https://www.amazon.in' },
  { name: 'Meesho', icon: ShoppingCart, color: '#FF4F81', href: 'https://www.meesho.com' },
  { name: 'Swiggy', icon: UtensilsCrossed, color: '#FC8019', href: 'https://www.swiggy.com' },
  { name: 'Zomato', icon: Utensils, color: '#E23744', href: 'https://www.zomato.com' },
  { name: 'Smart Assistant', icon: Bot, color: '#3c82f6', href: '/assistant' },
  { name: 'Bill Pay', icon: Receipt, color: '#4CAF50', href: '#' },
  { name: 'Travel', icon: Plane, color: '#00B9F1', href: '#' },
  { name: 'Insurance', icon: Shield, color: '#6A1B9A', href: '#' },
  { name: 'Banking', icon: Landmark, color: '#2E7D32', href: '#' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-2">
          1ShopApp
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          One app for all your needs. Seamlessly access your favorite services for shopping, food, payments, and more.
        </p>
      </div>

      <div className="w-full max-w-xl mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for products, brands, and more"
            className="w-full pl-10 pr-20 h-12 text-base"
          />
          <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-9">
            Search
          </Button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {services.map((service) => (
            <ServiceTile
              key={service.name}
              name={service.name}
              icon={service.icon}
              color={service.color}
              href={service.href}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
