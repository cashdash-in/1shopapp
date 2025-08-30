
'use client';

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Handshake } from "lucide-react";
import Link from "next/link";
import { partnerSignup, type PartnerSignupOutput, type PartnerSignupInput } from "@/ai/flows/partner-signup-flow";
import { Checkbox } from "@/components/ui/checkbox";

interface FormState {
  result: PartnerSignupOutput | null;
  error: string | null;
  input: PartnerSignupInput | null;
}

async function handlePartnerSignupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const input: PartnerSignupInput = {
    partnerName: formData.get('partner-name') as string,
    ownerName: formData.get('owner-name') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
  };

  // Basic validation
  if (!input.partnerName || !input.ownerName || !input.phone || !input.email) {
    return { result: null, error: "Please fill out all fields.", input };
  }
  
  if (!formData.get('terms')) {
    return { result: null, error: "You must agree to the terms and conditions.", input };
  }

  try {
    const response = await partnerSignup(input);
    return { result: response, error: null, input: null };
  } catch (err: any) {
    console.error(err);
    // Check for the specific duplicate partner error message from the flow
    if (err.message?.includes('already exists')) {
       return { result: null, error: err.message, input };
    }
    return { result: null, error: 'An unexpected error occurred. Please try again.', input };
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
  const initialState: FormState = { result: null, error: null, input: null };
  const [state, formAction] = useFormState(handlePartnerSignupAction, initialState);

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
                   <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button onClick={() => window.location.reload()} className="w-full" variant="outline">Register Another</Button>
                    <Button asChild className="w-full">
                        <Link href="/partner/dashboard">Go to Dashboard</Link>
                    </Button>
                   </div>
                </div>
              ) : (
                <form action={formAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner-name">Your Name / Shop Name</Label>
                    <Input id="partner-name" name="partner-name" placeholder="e.g., 'Raju Kumar' or 'Raju Mobile Shop'" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-name">Contact Person</Label>
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
                   <div className="items-top flex space-x-2">
                      <Checkbox id="terms" name="terms" />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the
                        </label>
                        <p className="text-sm text-muted-foreground">
                          <Link href="/partner-terms" className="underline hover:text-primary" target="_blank">Business Partner Terms</Link> and <Link href="/individual-partner-terms" className="underline hover:text-primary" target="_blank">Individual Partner Terms</Link>.
                        </p>
                      </div>
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
