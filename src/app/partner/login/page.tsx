
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
import { useToast } from "@/hooks/use-toast";

const SIMULATED_OTP = '123456';

export default function PartnerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);

    if (!phone) {
        setError("Please enter your phone number.");
        setLoading(false);
        return;
    }

     try {
        const partners = await getPartners();
        const partnerExists = partners.find(partner => partner.phone === phone);

        if (partnerExists) {
            setCurrentPartner(partnerExists as any);
            setOtpSent(true);
            toast({
                title: "OTP Sent",
                description: `We've sent an OTP to your number. (Hint: it's ${SIMULATED_OTP})`,
            });
        } else {
            setError("No partner found with this phone number. Please register first.");
        }
    } catch (err) {
        console.error("OTP send error:", err);
        setError("An unexpected error occurred. Please try again later.");
    } finally {
        setLoading(false);
    }
  }

  const handleSignIn = async () => {
    setError('');
    setLoading(true);

    if (otp !== SIMULATED_OTP) {
        setError("Invalid OTP. Please try again.");
        setLoading(false);
        return;
    }
    
    // If OTP is correct, store partner data and redirect
    if (currentPartner) {
        localStorage.setItem('loggedInPartner', JSON.stringify(currentPartner));
        router.push('/partner/dashboard');
    } else {
         setError("An error occurred. Please try sending the OTP again.");
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
            Enter your phone number to receive an OTP.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="e.g., 9876543210" 
              required 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otpSent}
            />
          </div>
          {otpSent && (
            <div className="grid gap-2">
                <Label htmlFor="otp">OTP</Label>
                <Input 
                id="otp" 
                type="text" 
                placeholder="Enter the 6-digit OTP"
                required 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           {!otpSent ? (
             <Button className="w-full" onClick={handleSendOtp} disabled={loading}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
           ) : (
            <Button className="w-full" onClick={handleSignIn} disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
            </Button>
           )}
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
