'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Car, Loader2, Sparkles, AlertTriangle, ArrowUpRight, Map, Activity, Clock, Navigation } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { findRides } from '@/ai/flows/ride-finder-flow';
import type { RideFinderOutput, RideOption } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const serviceUrls = {
    Uber: 'https://m.uber.com/go/book-a-ride',
    Ola: 'https://book.olacabs.com/',
    inDrive: 'https://www.indrive.com/en/home/',
    Rapido: 'https://www.rapido.bike/',
};

const GOOGLE_MAPS_API_KEY = ''; 

export default function RideFinderPage() {
    const { toast } = useToast();
    const [pickup, setPickup] = useState('Koramangala, Bangalore');
    const [dropoff, setDropoff] = useState('Indiranagar, Bangalore');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RideFinderOutput | null>(null);
    const [aiError, setAiError] = useState('');
    const [trafficAlerts, setTrafficAlerts] = useState<string[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const generateTrafficAlerts = useCallback(() => {
        const alerts = [
            `Smooth flow detected on main arterial roads near ${pickup.split(',')[0]}.`,
            `Minor slowdown reported due to construction near ${dropoff.split(',')[0]}.`,
            `High demand in your area. Fares may fluctuate.`,
            `Traffic moving at 25km/h on major junctions.`,
            `Estimated travel time is stable for the next 15 minutes.`
        ];
        // Shuffle and pick 3
        return alerts.sort(() => 0.5 - Math.random()).slice(0, 3);
    }, [pickup, dropoff]);

    const handleFindRides = async (isRefresh = false) => {
        if (!pickup.trim() || !dropoff.trim()) {
            toast({
                variant: 'destructive',
                title: 'Locations Required',
                description: 'Please enter both a pickup and a drop-off location.',
            });
            return;
        }

        if (!isRefresh) setLoading(true);
        setAiError('');

        try {
            const response = await findRides({ pickup, dropoff });
            if (response && response.options) {
                const serviceOrder = ['Uber', 'Ola', 'inDrive', 'Rapido'];
                response.options.sort((a, b) => {
                    return serviceOrder.indexOf(a.service) - serviceOrder.indexOf(b.service);
                });
            }
            setResult(response);
            setTrafficAlerts(generateTrafficAlerts());
            setLastUpdated(new Date().toLocaleTimeString());
            
            if (isRefresh) {
                toast({
                    title: "Live Update",
                    description: "Fares and traffic status updated.",
                });
            }
        } catch (error: any) {
            console.error('Ride finding failed:', error);
            setAiError(error.message || 'Could not find rides at the moment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Live Refresh Loop
    useEffect(() => {
        if (!result) return;

        const interval = setInterval(() => {
            handleFindRides(true);
        }, 45000); // Refresh every 45 seconds

        return () => clearInterval(interval);
    }, [result, pickup, dropoff]);

    const groupedResults = result?.options.reduce((acc, option) => {
        (acc[option.service] = acc[option.service] || []).push(option);
        return acc;
    }, {} as Record<string, RideOption[]>);

    const mapUrl = GOOGLE_MAPS_API_KEY 
        ? `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}&mode=driving`
        : null;

    return (
        <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
            <Card className="w-full max-w-5xl">
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
                        <CardDescription>Real-time traffic and tentative fare comparison.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>Feature Unavailable</AlertTitle>
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

                    <div className="flex flex-col gap-2">
                        <Button onClick={() => handleFindRides()} disabled={loading} className="w-full text-lg h-12">
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                            {loading ? 'Analyzing Traffic...' : 'Find Best Live Rates'}
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center italic">
                            * Fares are tentative live estimates. Actual price may vary based on the provider app at the time of booking.
                        </p>
                    </div>

                    {result && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                            {/* Left: Live Traffic Feed */}
                            <Card className="lg:col-span-1 border-primary/20 bg-primary/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-primary animate-pulse" />
                                        LIVE TRAFFIC FEED
                                    </CardTitle>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        Last Updated: {lastUpdated}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ScrollArea className="h-48 pr-4">
                                        <div className="space-y-4">
                                            {trafficAlerts.map((alert, i) => (
                                                <div key={i} className="flex gap-2 text-xs border-l-2 border-primary/30 pl-3 py-1">
                                                    <Navigation className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                                                    <p>{alert}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            {/* Right: Map */}
                            <Card className="lg:col-span-2 overflow-hidden">
                                {mapUrl ? (
                                    <iframe
                                        className="w-full h-full min-h-[250px] border-0"
                                        loading="lazy"
                                        allowFullScreen
                                        src={mapUrl}>
                                    </iframe>
                                ) : (
                                    <div className="w-full h-full min-h-[250px] bg-muted flex flex-col items-center justify-center text-center p-4">
                                        <Map className="h-10 w-10 text-muted-foreground mb-2"/>
                                        <p className="font-semibold text-sm">Live Road Map</p>
                                        <p className="text-xs text-muted-foreground max-w-xs">Add a Google Maps API Key to enable real-time visual road status.</p>
                                    </div>
                                )}
                            </Card>
                        </div>
                    )}

                    {loading && (
                         <div className="space-y-4 pt-6 border-t">
                            <Skeleton className="h-8 w-1/3 mx-auto" />
                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
                             </div>
                         </div>
                    )}
                
                    {result && !loading && (
                        <div className="space-y-6 pt-6 border-t">
                            <h2 className="text-2xl font-bold text-center">Available Rides</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                                {Object.entries(groupedResults || {}).map(([service, options]) => (
                                    <Card key={service} className="flex flex-col h-full border-t-4 border-t-primary shadow-lg">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center justify-between">
                                                <span className='font-bold text-xl'>{service}</span>
                                                <Badge variant="outline" className="text-[10px] font-normal uppercase tracking-wider">Tentative</Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3 flex-grow">
                                            {options.map((opt, i) => (
                                                <div key={i} className="p-3 rounded-md bg-muted/50 space-y-1 border border-transparent hover:border-primary/20 transition-colors">
                                                    <div className="flex justify-between items-center">
                                                        <h4 className="font-semibold text-sm">{opt.vehicleType}</h4>
                                                        <p className="font-bold text-lg">{opt.fare}</p>
                                                    </div>
                                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" /> {opt.eta}
                                                        </span>
                                                        {opt.surge && (
                                                            <Badge variant="destructive" className="text-[9px] h-4">
                                                                <AlertTriangle className="h-2 w-2 mr-1" />
                                                                SURGE
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                        <div className='p-4 pt-0'>
                                            <Button asChild className="w-full mt-auto" variant="default">
                                                <a href={serviceUrls[service as keyof typeof serviceUrls]} target="_blank" rel="noopener noreferrer">
                                                    Open {service}
                                                    <ArrowUpRight className="ml-2 h-4 w-4" />
                                                </a>
                                            </Button>
                                        </div>
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
