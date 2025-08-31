'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { trackAdminLogin } from "@/lib/analytics";

// This is a simplified server action inside a client component file.
// In a real-world scenario, this would be in a separate actions file.
async function setLoginCookie(password: string): Promise<{ success: boolean; message: string }> {
    'use server';
    // IMPORTANT: This is a prototype implementation.
    // In a real production app, use a secure authentication provider.
    if (password === process.env.ADMIN_PASSWORD) {
        const { cookies } = await import('next/headers');
        cookies().set('admin-auth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });
        return { success: true, message: "Login successful!" };
    } else {
        return { success: false, message: "Invalid password." };
    }
}


export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
        const result = await setLoginCookie(password);
        if (result.success) {
            trackAdminLogin();
            toast({
                title: "Login Successful",
                description: "Redirecting to your dashboard...",
            });
            router.push('/admin');
            router.refresh(); // Important to re-evaluate middleware
        } else {
            setError(result.message);
        }
    } catch (err) {
        console.error("Login error:", err);
        setError("An unexpected error occurred. Please try again.");
    } finally {
        setLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-2">
            <Package className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Admin Access</h1>
        </div>
        <p className="text-muted-foreground">Enter your password to access the 1ShopApp dashboard.</p>
      </div>
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSignIn}>
            <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
                This area is for authorized personnel only.
            </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
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
                <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                </Button>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
