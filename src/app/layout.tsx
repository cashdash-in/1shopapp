
'use client';

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import React, { useEffect } from "react";
import { trackPWAInstall } from "@/lib/analytics";
import { 
  Camera, BarChart3, Presentation, LayoutGrid, 
  AreaChart, FileSpreadsheet, FileText, Car, Briefcase 
} from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    // This listener is purely for analytics to track successful installations.
    const handleAppInstalled = () => {
        trackPWAInstall();
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return (
    <html lang="en" className="dark">
      <head>
        <title>1ShopApp</title>
        <meta name="description" content="All your favorite apps in one place." />
        <meta name="manifest" content="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <div className="fixed top-1/2 -translate-y-1/2 left-4 flex flex-col gap-2 z-50">
            
            <Link href="/office-assistant" passHref>
                <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground cursor-pointer hover:scale-110 transition-transform shadow-lg border-2 border-primary" title="AI Office Assistant">
                    <Briefcase className="h-6 w-6" />
                </div>
            </Link>
            <Link href="/photo-booth" passHref>
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground cursor-pointer hover:bg-muted transition-colors" title="AI Photo Booth">
                    <Camera className="h-6 w-6" />
                </div>
            </Link>
            <Link href="/data-analyst" passHref>
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground cursor-pointer hover:bg-muted transition-colors" title="AI Data Analyst">
                    <BarChart3 className="h-6 w-6" />
                </div>
            </Link>
            <Link href="/presentation-generator" passHref>
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground cursor-pointer hover:bg-muted transition-colors" title="AI Presentation Generator">
                    <Presentation className="h-6 w-6" />
                </div>
            </Link>
            <Link href="/bi-reporting" passHref>
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground cursor-pointer hover:bg-muted transition-colors" title="AI BI Reporting">
                    <LayoutGrid className="h-6 w-6" />
                </div>
            </Link>
             <Link href="/ride-finder" passHref>
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground cursor-pointer hover:bg-muted transition-colors" title="Ride Finder">
                    <Car className="h-6 w-6" />
                </div>
            </Link>
             <Link href="/infographics" passHref>
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground cursor-pointer hover:bg-muted transition-colors" title="Infographics & Charts">
                    <AreaChart className="h-6 w-6" />
                </div>
            </Link>
             <Link href="/excel-formulas" passHref>
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground cursor-pointer hover:bg-muted transition-colors" title="Excel Formula Guide">
                    <FileSpreadsheet className="h-6 w-6" />
                </div>
            </Link>
             <Link href="/word-shortcuts" passHref>
                <div className="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground cursor-pointer hover:bg-muted transition-colors" title="Word Shortcuts Guide">
                    <FileText className="h-6 w-6" />
                </div>
            </Link>
        </div>
        <Link href="/" passHref>
            <div className="fixed top-8 right-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold cursor-pointer z-50">
                1
            </div>
        </Link>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
