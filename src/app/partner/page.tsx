'use client';

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Handshake } from "lucide-react";
import Link from "next/link";
import { partnerSignup, type PartnerSignupOutput, type PartnerSignupInput } from "@/ai/flows/partner-signup-flow";

interface FormState {
  result: PartnerSignupOutput | null;
  error: string | null;
}

async function handlePartnerSignup(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const input: PartnerSignupInput = {
    shopName: formData.get('shop-name') as string,
    ownerName: formData.get('owner-name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
  };

  try {
    const response = await partnerSignup(input);
    return { result: response, error: null };
  } catch (err) {
    console.error(err);
    return { result: null, error: 'An error occurred. Please try again.' };
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Registering...' : 'Register Interest'}
    </Button>
  );
}

export default function PartnerPage() {
  const initialState: FormState = { result: null, error: null };
  const [state, formAction] = useFormState(handlePartnerSignup, initialState);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Handshake className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">1ShopApp Partner Program</h1>
        </Link>
      </header>

      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground">
              Partner with 1ShopApp & Grow Your Business
            </h2>
            <p className="text-lg text-muted-foreground">
              Join our mission to declutter smartphones and provide a seamless experience to users. As a 1ShopApp partner, you can earn commissions by promoting the app to your customers.
            </p>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-1" />
                <span><span className="font-semibold">Earn Attractive Commissions:</span> Get rewarded for every user you bring to the 1ShopApp ecosystem.</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-1" />
                <span><span className="font-semibold">Increase Customer Loyalty:</span> Offer your customers a unique value-add that saves them phone space and time.</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-1" />
                <span><span className="font-semibold">Simple & Easy:</span> We provide you with all the marketing materials and support you need to get started.</span>
              </li>
            </ul>
          </div>

          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Become a Partner</CardTitle>
              <CardDescription>Fill out the form below to register your interest. We'll get back to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              {state.result ? (
                <div className="space-y-4 text-center p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">{state.result.message}</h3>
                  <p className="text-muted-foreground">Your referral code is:</p>
                  <p className="text-2xl font-bold text-primary bg-muted/50 rounded-md py-2">{state.result.referralCode}</p>
                   <p className="text-xs text-muted-foreground pt-4">You can now start sharing this code with your customers!</p>
                   <Button onClick={() => window.location.reload()} className="mt-4">Register another partner</Button>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shop-name">Shop Name</Label>
                    <Input id="shop-name" name="shop-name" placeholder="e.g., 'Raju Mobile Shop'" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Your Name</Label>
                    <Input id="owner-name" name="owner-name" placeholder="e.g., 'Raju Kumar'" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="e.g., '9876543210'" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="e.g., 'raju@example.com'" required />
                  </div>
                   {state.error && <p className="text-sm text-destructive">{state.error}</p>}
                  <SubmitButton />
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    )
  }