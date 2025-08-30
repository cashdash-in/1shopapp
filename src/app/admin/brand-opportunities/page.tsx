
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Percent, Star, BarChart3, Target, TrendingUp, FileText, CheckSquare, BrainCircuit } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";

const brandData = [
    {
      category: 'Shopping',
      brands: ['Flipkart', 'Amazon', 'Myntra', 'Ajio', 'Meesho', 'DMart', 'Blinkit', 'Croma']
    },
    {
      category: 'Food Delivery',
      brands: ['Swiggy', 'Zomato']
    },
    {
      category: 'Bill Pay',
      brands: ['Paytm', 'PhonePe', 'Google Pay']
    },
    {
      category: 'Travel',
      brands: ['MakeMyTrip', 'Goibibo', 'Ixigo', 'Cleartrip', 'OYO']
    },
    {
      category: 'Housing',
      brands: ['MagicBricks', '99acres', 'Housing.com', 'NoBroker']
    },
    {
      category: 'Insurance',
      brands: ['Policybazaar', 'Acko', 'Digit']
    },
    {
      category: 'Finance',
      brands: ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'IndusInd Bank', 'Bandhan Bank']
    },
    {
      category: 'Transport & Logistics',
      brands: ['Uber', 'Ola', 'inDrive', 'Delhivery', 'Blue Dart', 'DTDC', 'Shiprocket']
    },
    {
      category: 'Beauty',
      brands: ['Nykaa', 'Purplle', 'Sephora']
    },
    {
      category: 'Social Media',
      brands: ['Facebook', 'Instagram', 'X (Twitter)', 'LinkedIn', 'WhatsApp']
    },
    {
      category: 'News',
      brands: ['Times of India', 'Hindustan Times', 'The Hindu', 'NDTV']
    },
    {
      category: 'Market',
      brands: ['Moneycontrol', 'ET Markets', 'Zerodha', 'Groww', 'Angel Broking', 'Sharekhan', 'ICICI Securities']
    }
];

const allBrands = brandData.flatMap(category => category.brands);


export default function BrandOpportunitiesPage() {
    return (
        <div className="flex flex-col gap-4">
             <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Brand Campaign Planner</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Monetization & Partnership Strategy</CardTitle>
                    <CardDescription>
                        Use this tool to plan and structure potential campaigns for each brand partner.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {allBrands.map((brand) => (
                            <AccordionItem value={brand} key={brand}>
                                <AccordionTrigger className="text-lg font-medium hover:no-underline">{brand}</AccordionTrigger>
                                <AccordionContent>
                                    <form className="space-y-8 pl-2 pt-2 border-l-2 border-primary ml-2">

                                        {/* Campaign Goal Section */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <Target className="w-5 h-5"/>
                                            </div>
                                            <div className="w-full grid gap-2">
                                                <h4 className="font-semibold text-foreground">Campaign Goal & Objective</h4>
                                                <p className="text-muted-foreground text-sm">Define the primary purpose of this campaign.</p>
                                                <Textarea placeholder={`e.g., Drive 15% more traffic to ${brand} during the Diwali sale.`} className="mt-1"/>
                                            </div>
                                        </div>

                                         {/* KPIs Section */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5"/>
                                            </div>
                                            <div className="w-full grid gap-2">
                                                <h4 className="font-semibold text-foreground">Key Performance Indicators (KPIs)</h4>
                                                <p className="text-muted-foreground text-sm">Set measurable targets to track success.</p>
                                                <div className="grid md:grid-cols-2 gap-4 mt-1">
                                                    <div className="space-y-1">
                                                        <Label htmlFor={`${brand}-kpi-ctr`}>Target Click-Through Rate (%)</Label>
                                                        <Input id={`${brand}-kpi-ctr`} placeholder="e.g., 5"/>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor={`${brand}-kpi-conversions`}>Target Conversions / Sales</Label>
                                                        <Input id={`${brand}-kpi-conversions`} placeholder="e.g., 500"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Campaign Types Section */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <CheckSquare className="w-5 h-5"/>
                                            </div>
                                            <div className="w-full grid gap-2">
                                                <h4 className="font-semibold text-foreground">Select Campaign Type(s)</h4>
                                                <p className="text-muted-foreground text-sm">Choose the promotional methods to use for this campaign.</p>
                                                <div className="grid md:grid-cols-2 gap-4 mt-2">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox id={`${brand}-type-affiliate`} />
                                                        <Label htmlFor={`${brand}-type-affiliate`} className="font-normal flex items-center gap-2"><DollarSign className="w-4 h-4 text-muted-foreground"/>Affiliate Links</Label>
                                                    </div>
                                                     <div className="flex items-center space-x-2">
                                                        <Checkbox id={`${brand}-type-sponsored`} />
                                                        <Label htmlFor={`${brand}-type-sponsored`} className="font-normal flex items-center gap-2"><Star className="w-4 h-4 text-muted-foreground"/>Sponsored Placement</Label>
                                                    </div>
                                                     <div className="flex items-center space-x-2">
                                                        <Checkbox id={`${brand}-type-coupon`} />
                                                        <Label htmlFor={`${brand}-type-coupon`} className="font-normal flex items-center gap-2"><Percent className="w-4 h-4 text-muted-foreground"/>Exclusive Coupon/Deal</Label>
                                                    </div>
                                                     <div className="flex items-center space-x-2">
                                                        <Checkbox id={`${brand}-type-data`} />
                                                        <Label htmlFor={`${brand}-type-data`} className="font-normal flex items-center gap-2"><BarChart3 className="w-4 h-4 text-muted-foreground"/>Data & Insights Report</Label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Required Info Section */}
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <FileText className="w-5 h-5"/>
                                            </div>
                                            <div className="w-full grid gap-2">
                                                <h4 className="font-semibold text-foreground">Information Required from {brand}</h4>
                                                <p className="text-muted-foreground text-sm">List the assets and details needed from the brand to launch.</p>
                                                <Textarea placeholder="e.g., - Official affiliate tracking links. - High-resolution logo. - List of coupon codes and validity." className="mt-1"/>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <Button type="button" onClick={(e) => e.preventDefault()}>Save Campaign Plan</Button>
                                        </div>
                                    </form>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )

    