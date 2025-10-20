
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Car, Loader2, Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { findRides } from '@/ai/flows/ride-finder-flow';
import type { RideFinderOutput } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const serviceLogos = {
    Uber: '/images/uber-logo.svg',
    Ola: '/images/ola-logo.svg',
    inDrive: '/images/indrive-logo.svg',
};

const serviceUrls = {
    Uber: 'https://m.uber.com/go/book-a-ride',
    Ola: 'https://book.olacabs.com/',
    inDrive: 'https://www.indrive.com/en/home/',
};

export default function RideFinderPage() {
    const { toast } = useToast();
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RideFinderOutput | null>(null);
    const [aiError, setAiError] = useState('');

    const handleFindRides = async () => {
        if (!pickup.trim() || !dropoff.trim()) {
            toast({
                variant: 'destructive',
                title: 'Locations Required',
                description: 'Please enter both a pickup and a drop-off location.',
            });
            return;
        }

        setLoading(true);
        setResult(null);
        setAiError('');

        try {
            const response = await findRides({ pickup, dropoff });
            // Sort results by service
            response.options.sort((a, b) => a.service.localeCompare(b.service));
            setResult(response);
        } catch (error: any) {
            console.error('AI ride finding failed:', error);
            setAiError(error.message || 'The AI could not find rides at the moment. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // Group results by service
    const groupedResults = result?.options.reduce((acc, option) => {
        (acc[option.service] = acc[option.service] || []).push(option);
        return acc;
    }, {} as Record<string, (typeof result.options)>);


    return (
        <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
            <Card className="w-full max-w-4xl">
                <CardHeader className="relative">
                    <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                        <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                        <span className="sr-only">Back to Home</span>
                    </Link>
                    <div className="text-center pt-8">
                        <CardTitle className="text-3xl font-bold tracking-tight flex items-center justify-center gap-3">
                            <Car className="h-8 w-8 text-primary" />
                            Ride Finder
                        </CardTitle>
                        <CardDescription>Compare cab fares from top services in one place.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>AI Feature Unavailable</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="pickup">Pickup Location</Label>
                            <Input
                                id="pickup"
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                placeholder="e.g., 'Koramangala, Bangalore'"
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dropoff">Drop-off Location</Label>
                            <Input
                                id="dropoff"
                                value={dropoff}
                                onChange={(e) => setDropoff(e.target.value)}
                                placeholder="e.g., 'Indiranagar, Bangalore'"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <Button onClick={handleFindRides} disabled={loading} className="w-full text-lg h-12">
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                        {loading ? 'Finding Best Rates...' : 'Find Best Rates'}
                    </Button>
                
                    {loading && (
                         <div className="space-y-4 pt-6 border-t">
                            <Skeleton className="h-8 w-1/3 mx-auto" />
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-48 w-full" />
                                <Skeleton className="h-48 w-full" />
                             </div>
                         </div>
                    )}
                
                    {groupedResults && (
                        <div className="space-y-6 pt-6 border-t">
                            <h2 className="text-2xl font-bold text-center">Available Rides</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                                {Object.entries(groupedResults).map(([service, options]) => (
                                    <Card key={service}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <Image 
                                                    src={serviceLogos[service as keyof typeof serviceLogos]} 
                                                    alt={`${service} logo`} 
                                                    width={80} 
                                                    height={28}
                                                    className="dark:invert"
                                                />
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {options.map((opt, i) => (
                                                <div key={i} className="p-3 rounded-md bg-muted/50 space-y-1">
                                                    <div className="flex justify-between items-center">
                                                         <h4 className="font-semibold">{opt.vehicleType}</h4>
                                                         <p className="font-bold text-lg">{opt.fare}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                                        <span>ETA: {opt.eta}</span>
                                                         {opt.surge && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                Surge
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            <Button asChild className="w-full mt-4">
                                                <a href={serviceUrls[service as keyof typeof serviceUrls]} target="_blank" rel="noopener noreferrer">
                                                    Book on {service}
                                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                                </a>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
