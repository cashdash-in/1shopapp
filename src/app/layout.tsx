
'use client';

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import React, { useEffect } from "react";
import { trackPWAInstall } from "@/lib/analytics";
import { Camera } from "lucide-react";

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
        <Link href="/photo-booth" passHref>
            <div className="fixed top-8 left-4 h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground cursor-pointer z-50 hover:bg-muted transition-colors">
                <Camera className="h-6 w-6" />
            </div>
        </Link>
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
