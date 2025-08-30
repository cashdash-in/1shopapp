
'use client';

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Handshake } from "lucide-react";
import Link from "next/link";
import { partnerSignup, type PartnerSignupOutput, type PartnerSignupInput } from "@/ai/flows/partner-signup-flow";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React from "react";

interface FormState {
  result: PartnerSignupOutput | null;
  error: string | null;
  input: Partial<PartnerSignupInput> | null;
}

async function handlePartnerSignupAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  const partnerType = formData.get('partnerType') as 'business' | 'individual';

  const rawInput: PartnerSignupInput = {
    partnerType,
    shopName: formData.get('shop-name') as string || undefined,
    ownerName: formData.get('owner-name') as string || undefined,
    gstNumber: formData.get('gst-number') as string || undefined,
    fullName: formData.get('full-name') as string || undefined,
    panNumber: formData.get('pan-number') as string || undefined,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
  };

  const inputForState: Partial<PartnerSignupInput> = { ...rawInput };

  // Basic validation
  if (!rawInput.phone || !rawInput.email) {
    return { result: null, error: "Please fill out all required fields.", input: inputForState };
  }
   if (partnerType === 'business' && (!rawInput.shopName || !rawInput.ownerName)) {
      return { result: null, error: "Please fill out all business fields.", input: inputForState };
   }
    if (partnerType === 'individual' && !rawInput.fullName) {
       return { result: null, error: "Please fill out all individual fields.", input: inputForState };
    }
  
  if (!formData.get('terms')) {
    return { result: null, error: "You must agree to the terms and conditions.", input: inputForState };
  }

  try {
    const response = await partnerSignup(rawInput);
    return { result: response, error: null, input: null };
  } catch (err: any) {
    console.error(err);
    // Check for the specific duplicate partner error message from the flow
    if (err.message?.includes('already exists')) {
       return { result: null, error: err.message, input: inputForState };
    }
    return { result: null, error: 'An unexpected error occurred. Please try again.', input: inputForState };
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
  const [partnerType, setPartnerType] = React.useState<'business' | 'individual'>(
    state.input?.partnerType || 'business'
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Handshake className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">1ShopApp Partner Program</h1>
        </Link>
        <Button asChild variant="outline">
            <Link href="/partner/login">Partner Login</Link>
        </Button>
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
               <CardDescription>
                Register your interest below. Already a partner?{' '}
                <Link href="/partner/login" className="underline hover:text-primary">
                    Sign in here.
                </Link>
              </CardDescription>
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
                        <Label>Partner Type</Label>
                        <RadioGroup 
                            name="partnerType"
                            value={partnerType}
                            className="flex gap-4" 
                            onValueChange={(value: 'business' | 'individual') => setPartnerType(value)}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="business" id="r-business" />
                                <Label htmlFor="r-business">Business</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="individual" id="r-individual" />
                                <Label htmlFor="r-individual">Individual</Label>
                            </div>
                        </RadioGroup>
                    </div>

                  {partnerType === 'business' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="shop-name">Shop Name</Label>
                        <Input id="shop-name" name="shop-name" placeholder="e.g., 'Raju Mobile Shop'" required defaultValue={state.input?.shopName || ''}/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="owner-name">Owner Name</Label>
                        <Input id="owner-name" name="owner-name" placeholder="e.g., 'Raju Kumar'" required defaultValue={state.input?.ownerName || ''}/>
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="gst-number">GST Number (Optional)</Label>
                        <Input id="gst-number" name="gst-number" placeholder="e.g., '29ABCDE1234F1Z5'" defaultValue={state.input?.gstNumber || ''}/>
                      </div>
                    </>
                  )}

                  {partnerType === 'individual' && (
                     <>
                      <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <Input id="full-name" name="full-name" placeholder="e.g., 'Raju Kumar'" required defaultValue={state.input?.fullName || ''}/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pan-number">PAN Number (Optional)</Label>
                        <Input id="pan-number" name="pan-number" placeholder="e.g., 'ABCDE1234F'" defaultValue={state.input?.panNumber || ''}/>
                      </div>
                    </>
                  )}


                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="e.g., '9876543210'" required defaultValue={state.input?.phone || ''}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="e.g., 'raju@example.com'" required defaultValue={state.input?.email || ''}/>
                  </div>
                   <div className="items-top flex space-x-2">
                      <Checkbox id="terms" name="terms" required />
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
            <CardFooter>
                 <p className="text-xs text-muted-foreground">
                    Your information is used for identity verification and commission payments only. We respect your privacy.
                 </p>
            </CardFooter>
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

    