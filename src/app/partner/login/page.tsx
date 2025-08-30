
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Handshake } from "lucide-react";

export default function PartnerLoginPage() {
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
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">Sign In</Button>
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
