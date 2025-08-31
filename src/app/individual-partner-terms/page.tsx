
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function IndividualPartnerTermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative">
            <Link href="/partner" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5 text-muted-foreground"/>
                <span className="sr-only">Back to Partner Page</span>
            </Link>
          <div className="text-center pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight">Individual Partner Terms & Conditions</CardTitle>
            <CardDescription>Last updated: August 2024</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <Separator />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>This program is for individuals who want to become advocates for 1ShopApp. As an individual partner, you can earn commissions by sharing your unique referral code with your friends, family, and social networks.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. Earning Commissions</h2>
            <p>You will earn a commission for qualifying actions made through your referral link or code. The specifics of the commission structure will be available in your personal partner dashboard. Payments are made on a monthly basis, provided you meet the minimum payout threshold.</p>
          </div>
           <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Prohibited Activities</h2>
            <p>You may not engage in spamming, unsolicited advertising, or any form of misleading promotion. You must not impersonate 1ShopApp or create any materials that suggest an official endorsement without our written consent. Your participation is based on trust and good faith.</p>
          </div>
           <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Data Privacy</h2>
            <p>We respect your privacy. The personal information you provide during signup will be used solely for managing your partner account and processing payments. We will not share your data with third parties.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
