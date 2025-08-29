import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

export const metadata: Metadata = {
  title: "1ShopApp",
  description: "All your favorite apps in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <Link href="/" passHref>
            <div className="fixed top-4 right-4 h-12 w-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold cursor-pointer z-50">
                1
            </div>
        </Link>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
