
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative">
            <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5 text-muted-foreground"/>
                <span className="sr-only">Back to Home</span>
            </Link>
          <div className="text-center pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight">Terms and Conditions</CardTitle>
            <CardDescription>Last updated: August 2025</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <Separator />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>Welcome to 1ShopApp ("we", "our", "us"). These Terms and Conditions govern your use of our website and services. By accessing or using our service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">2. Our Service</h2>
            <p>1ShopApp provides a convenient platform that aggregates links to various third-party websites for shopping, services, and more. Our goal is to declutter your device by providing a single point of access to these services. You acknowledge that we do not own or operate any of the third-party services linked on our platform.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">3. Independence and Non-Affiliation</h2>
            <p>1ShopApp is an independent entity. We are not affiliated with, sponsored by, associated with, or endorsed by any of the brands or companies listed on our platform. All trademarks, service marks, logos, and brand names are the property of their respective owners.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">4. Affiliate Disclosure</h2>
            <p>To support our platform, we may participate in affiliate marketing programs. This means that when you click on certain links on our site and make a purchase or perform an action, we may earn a small commission at no additional cost to you. This helps us maintain and improve our services.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">5. User Consent and Discretion</h2>
            <p>Your use of the links provided on 1ShopApp is entirely at your own risk and discretion. You are solely responsible for your interactions with any third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party websites or services. We do not recommend or advise the installation or uninstallation of any mobile applications.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>In no event shall 1ShopApp, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">7. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms and Conditions on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
