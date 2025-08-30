
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative">
            <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5 text-muted-foreground"/>
                <span className="sr-only">Back to Home</span>
            </Link>
          <div className="text-center pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight">About Us</CardTitle>
            <CardDescription>Our Mission and Vision</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-sm text-muted-foreground leading-relaxed">
            <Separator />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
            <p>In a world of countless apps, we noticed a common problem: smartphone clutter. Our mission is to simplify your digital life by providing a single, streamlined platform to access all your essential online services. We aim to help you save storage space on your device without compromising on functionality.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">What is 1ShopApp?</h2>
            <p>1ShopApp is a one-stop destination for your favorite apps and services. From e-commerce and food delivery to travel and bill payments, we bring everything together in an intuitive and user-friendly interface. We are not another app to install; we are the solution to having too many.</p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Our Commitment to Transparency</h2>
            <p>We believe in being upfront with our users. 1ShopApp is an independent platform and is not directly affiliated with the brands we link to. We operate on an affiliate model, which means we may earn a small commission when you use our links, but this comes at no extra cost to you. Your trust is our top priority, and we are committed to providing a secure and reliable service.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
