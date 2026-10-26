
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  LineChart, 
  Settings, 
  TrendingUp,
  Target,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/tradehunter', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tradehunter/journal', label: 'Journal', icon: BookOpen },
  { href: '/tradehunter/analytics', label: 'Analytics', icon: LineChart },
  { href: '/tradehunter/settings', label: 'Settings', icon: Settings },
];

export default function TradeHunterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-zinc-800 bg-[#121212]">
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Target className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tighter italic">TRADEHUNTER</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                pathname === item.href 
                  ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-zinc-800 bg-[#121212]/80 backdrop-blur-md flex items-center justify-between px-6 z-40">
           <div className="lg:hidden flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#121212] border-zinc-800 text-zinc-100 p-0">
                   <div className="p-6 flex items-center gap-3">
                    <Target className="text-emerald-500 h-6 w-6" />
                    <span className="text-xl font-bold">TRADEHUNTER</span>
                  </div>
                  <nav className="px-4 space-y-2">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href} className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-zinc-800">
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
              <span className="font-bold">TradeHunter</span>
           </div>
           <div className="hidden lg:block">
              <h2 className="font-semibold text-lg">Intraday NSE Scanner</h2>
           </div>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-1.5 border border-zinc-800">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono text-zinc-400">NSE LIVE</span>
              </div>
           </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
