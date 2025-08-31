
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PartnerTermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative">
            <Link href="/partner" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5 text-muted-foreground"/>
                <span className="sr-only">Back to Partner Page</span>
            </Link>
          <div className="text-center pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight">Business Partner Terms & Conditions</CardTitle>
            <CardDescription>Last updated: August 2025</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <Separator />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Eligibility</h2>
            <p>This Business Partner Program is designed for registered businesses, shops, and commercial entities who wish to promote 1ShopApp to their customer base. You must operate a legitimate business to qualify.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. Referral and Commission</h2>
            <p>Upon successful registration, you will receive a unique referral code. You are entitled to a commission for each new user who signs up or performs a qualifying action through your referral. Commission rates and payment terms will be detailed in your partner dashboard.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Responsibilities</h2>
            <p>As a business partner, you agree to represent 1ShopApp in a positive and professional manner. You may not make false claims or misrepresent our services. We will provide marketing materials to aid your promotional efforts.</p>
          </div>
           <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Termination</h2>
            <p>We reserve the right to terminate the partnership agreement at any time due to violation of these terms, fraudulent activity, or any action that harms the reputation of 1ShopApp. Outstanding commissions will be evaluated on a case-by-case basis.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
