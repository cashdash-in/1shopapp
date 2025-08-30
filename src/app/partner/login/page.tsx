
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Handshake } from "lucide-react";
import React, { useState } from "react";
import { getPartners } from "@/ai/flows/partner-signup-flow";
import { useRouter } from "next/navigation";

export default function PartnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setError('');
    setLoading(true);

    if (!email || !password) {
        setError("Please enter both email and password.");
        setLoading(false);
        return;
    }

    try {
        const partners = await getPartners();
        const partnerExists = partners.some(partner => partner.email.toLowerCase() === email.toLowerCase());

        // Note: In a real app, you would also verify the password against a hashed version in your database.
        // For this prototype, we are only checking if the email exists.

        if (partnerExists) {
            // Successful login, redirect to dashboard
            router.push('/partner/dashboard');
        } else {
            setError("Invalid credentials. Please check your email and password.");
        }
    } catch (err) {
        console.error("Login error:", err);
        setError("An unexpected error occurred. Please try again later.");
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-2">
            <Handshake className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Partner Login</h1>
        </div>
        <p className="text-muted-foreground">Welcome back to the 1ShopApp Partner Program.</p>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignIn} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
           <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/partner" className="underline hover:text-primary">
                    Register here
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
