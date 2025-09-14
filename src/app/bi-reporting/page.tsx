
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function BiReportingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative">
            <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5 text-muted-foreground"/>
                <span className="sr-only">Back to Home</span>
            </Link>
          <div className="text-center pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
              <LayoutGrid className="h-8 w-8 text-primary" />
              AI-Powered BI Reporting
            </CardTitle>
            <CardDescription>Generate business intelligence reports, visualizations, and dashboards from your data.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center space-y-4 py-24">
            <Separator />
            <p className="text-2xl font-semibold text-muted-foreground">Coming Soon</p>
            <p className="max-w-md text-muted-foreground">This feature is currently under development. Soon, you'll be able to upload data files (like Excel or CSV) and generate insightful BI reports automatically.</p>
        </CardContent>
      </Card>
    </div>
  );
}
