
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const businessPartnerTemplate = `
**BUSINESS PARTNER AGREEMENT**

This Agreement is made and entered into on [Date], by and between:

**1ShopApp** ("the Company"), and
**[Partner Name]** ("the Partner"), located at [Partner Address].

**1. Purpose:**
The Company agrees to list the Partner's services on the 1ShopApp platform. The Partner agrees to promote 1ShopApp to its customer base using the unique referral code: [Referral Code].

**2. Commission:**
The Company will pay the Partner a commission of [Commission Percentage]% on all qualifying revenue generated through the Partner's referral code. Payments will be made monthly.

**3. Term and Termination:**
This Agreement shall commence on the date first written above and continue until terminated by either party with thirty (30) days written notice.

**4. Confidentiality:**
Both parties agree to keep all proprietary information confidential.

**IN WITNESS WHEREOF,** the parties have executed this Agreement as of the date first above written.

_________________________
1ShopApp

_________________________
[Partner Name]
`.trim();

const individualPartnerTemplate = `
**INDIVIDUAL AFFILIATE AGREEMENT**

This Agreement is made on [Date], between:

**1ShopApp** ("the Company"), and
**[Affiliate Name]** ("the Affiliate").

**1. Engagement:**
The Company engages the Affiliate to promote 1ShopApp through their personal networks, social media, or other channels using the provided referral code: [Referral Code].

**2. Compensation:**
The Affiliate will earn a commission of [Commission Percentage]% on all qualifying actions attributed to their referral code. The payment schedule and minimum payout threshold will be detailed in the Affiliate's partner dashboard.

**3. Prohibited Activities:**
The Affiliate agrees not to engage in spam, misleading advertising, or any activity that could harm the reputation of 1ShopApp.

**4. Agreement:**
By promoting 1ShopApp, the Affiliate agrees to the terms outlined herein.

**Dated:** [Date]
`.trim();

const brandPromotionTemplate = `
**BRAND PROMOTION AGREEMENT**

This Agreement is entered into on [Date] by and between:

**1ShopApp** ("the Platform"), and
**[Brand Name]** ("the Brand").

**1. Scope of Promotion:**
The Platform agrees to execute the following promotional activities for the Brand:
- [Specify placement, e.g., "Featured Tile in Shopping Category"]
- [Specify other activities, e.g., "Exclusive Coupon Code Distribution"]

**2. Campaign Duration:**
The promotion will run from [Start Date] to [End Date].

**3. Fees & Payment:**
The Brand agrees to pay the Platform a fee of [Fee Amount] for the services rendered. Payment is due by [Payment Due Date].

**4. Deliverables:**
The Brand will provide the Platform with all necessary assets (logos, ad copy, coupon codes) by [Asset Delivery Date].

**5. Reporting:**
The Platform will provide a performance report to the Brand within seven (7) days of the campaign's conclusion.

**Agreed and Accepted:**

_________________________
1ShopApp

_________________________
[Brand Name]
`.trim();


export default function ContractsPage() {
    const { toast } = useToast();

    const handleCopy = (text: string, title: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to Clipboard",
            description: `The ${title} template has been copied.`,
        });
    }

    return (
        <div className="flex flex-col gap-4">
             <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Contract Templates</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Standard Agreements</CardTitle>
                    <CardDescription>
                        Use these templates as a starting point for your partnerships. You can edit the text directly and copy it.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue="business-partner">
                        <AccordionItem value="business-partner">
                            <AccordionTrigger className="text-lg font-medium hover:no-underline">Business Partner Agreement</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                 <Textarea defaultValue={businessPartnerTemplate} rows={15} className="font-mono text-xs"/>
                                 <Button onClick={() => handleCopy(businessPartnerTemplate, "Business Partner Agreement")}>Copy Template</Button>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="individual-partner">
                            <AccordionTrigger className="text-lg font-medium hover:no-underline">Individual / Affiliate Agreement</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <Textarea defaultValue={individualPartnerTemplate} rows={15} className="font-mono text-xs"/>
                                <Button onClick={() => handleCopy(individualPartnerTemplate, "Individual Affiliate Agreement")}>Copy Template</Button>
                            </AccordionContent>
                        </AccordionItem>
                         <AccordionItem value="brand-promotion">
                            <AccordionTrigger className="text-lg font-medium hover:no-underline">Brand Promotion Agreement</AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <Textarea defaultValue={brandPromotionTemplate} rows={15} className="font-mono text-xs"/>
                                 <Button onClick={() => handleCopy(brandPromotionTemplate, "Brand Promotion Agreement")}>Copy Template</Button>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
