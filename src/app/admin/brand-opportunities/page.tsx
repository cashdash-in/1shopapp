
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Percent, Star, BarChart3, ArrowRight } from "lucide-react"

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
                <h1 className="text-lg font-semibold md:text-2xl">Brand Opportunities</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Monetization & Partnership Strategies</CardTitle>
                    <CardDescription>
                        A detailed guide on how we can collaborate with brands to generate revenue and enhance user value.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {allBrands.map((brand) => (
                            <AccordionItem value={brand} key={brand}>
                                <AccordionTrigger className="text-lg font-medium hover:no-underline">{brand}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-6 pl-2 pt-2 border-l-2 border-primary ml-2">
                                        
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <DollarSign className="w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">Affiliate Link Commissions</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    This is the most direct revenue stream. We can partner with {brand} through an affiliate network (like Cuelinks, Admitad, or directly). Instead of a standard link, we would use a unique tracking link.
                                                </p>
                                                <p className="text-muted-foreground text-sm mt-2">
                                                    <span className="font-semibold text-foreground">Action:</span> Contact {brand}'s marketing/partnerships team to enroll in their affiliate program.
                                                </p>
                                                <p className="text-muted-foreground text-sm mt-1">
                                                    <span className="font-semibold text-foreground">Revenue Model:</span> Earn a percentage (e.g., 2-10%) of the total sales value for every purchase made by a user who clicks through from our app.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <Star className="w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">Sponsored Placements (Featured Tile)</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    Brands often pay for visibility. We can offer {brand} a premium, "featured" spot within its category. For example, it could be the first tile a user sees.
                                                </p>
                                                 <p className="text-muted-foreground text-sm mt-2">
                                                    <span className="font-semibold text-foreground">Action:</span> Create a media kit outlining user demographics and traffic, and pitch a "Featured Partner" package to {brand}.
                                                </p>
                                                <p className="text-muted-foreground text-sm mt-1">
                                                    <span className="font-semibold text-foreground">Revenue Model:</span> Charge a flat monthly or quarterly fee for this premium placement.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start gap_4">
                                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <Percent className="w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">Exclusive Coupon Codes & Deals</h4>
                                                <p className="text-muted-foreground text-sm">
                                                    We can collaborate with {brand} to provide coupon codes or deals exclusive to 1ShopApp users. This adds significant value for our users and gives {brand} access to a targeted audience.
                                                </p>
                                                <p className="text-muted-foreground text-sm mt-2">
                                                    <span className="font-semibold text-foreground">Action:</span> Propose a partnership where {brand} provides a unique discount code (e.g., "1SHOPAPP15") for our users.
                                                </p>
                                                <p className="text-muted-foreground text-sm mt-1">
                                                    <span className="font-semibold text-foreground">Revenue Model:</span> This can be a fixed fee for running the campaign, a higher commission on sales using the code, or simply a way to drive user engagement and loyalty.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap_4">
                                             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                                <BarChart3 className="w-5 h-5"/>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-foreground">Data & User Insights</h4>
                                                <p className="text-muted-foreground text-sm">
                                                   As our platform grows, the aggregated, anonymized data we collect is highly valuable. We can provide {brand} with reports on user behavior.
                                                </p>
                                                <p className="text-muted-foreground text-sm mt-2">
                                                    <span className="font-semibold text-foreground">Example Insights:</span> "What percentage of users who click on {brand} also click on banking apps?" or "What are the peak usage hours for the Shopping category?"
                                                </p>
                                                 <p className="text-muted-foreground text-sm mt-1">
                                                    <span className="font-semibold text-foreground">Revenue Model:</span> Sell monthly or quarterly insight reports for a subscription fee.
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}
