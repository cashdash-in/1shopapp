
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Car, Loader2, Sparkles, AlertTriangle, ArrowUpRight, Map, Activity, Clock, Navigation, MapPin, X } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { findRides } from '@/ai/flows/ride-finder-flow';
import type { RideFinderOutput, RideOption } from '@/ai/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const serviceUrls = {
    Uber: 'https://m.uber.com/go/book-a-ride',
    Ola: 'https://book.olacabs.com/',
    inDrive: 'https://www.indrive.com/en/home/',
    Rapido: 'https://www.rapido.bike/',
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''; 

const POPULAR_LOCATIONS = [
    "Koramangala, Bangalore",
    "Indiranagar, Bangalore",
    "Whitefield, Bangalore",
    "MG Road, Bangalore",
    "HSR Layout, Bangalore",
    "Electronic City, Bangalore",
    "Kempegowda International Airport, Bangalore",
    "Bandra West, Mumbai",
    "Andheri East, Mumbai",
    "Colaba, Mumbai",
    "Powai, Mumbai",
    "Juhu, Mumbai",
    "Chhatrapati Shivaji Maharaj International Airport, Mumbai",
    "Connaught Place, New Delhi",
    "Hauz Khas, New Delhi",
    "Indira Gandhi International Airport, New Delhi",
    "Cyber City, Gurgaon",
    "Gachibowli, Hyderabad",
    "HITEC City, Hyderabad",
    "Banjara Hills, Hyderabad",
    "Anna Nagar, Chennai",
    "Adyar, Chennai",
    "Salt Lake City, Kolkata",
    "Park Street, Kolkata",
    "Borivali West, Mumbai",
    "Dadar West, Mumbai",
    "Lower Parel, Mumbai",
    "Malad West, Mumbai",
    "Worli, Mumbai",
    "Chandni Chowk, New Delhi",
    "Karol Bagh, New Delhi",
    "Lajpat Nagar, New Delhi",
    "Rohini, New Delhi",
    "Vasant Kunj, New Delhi",
    "Hebbal, Bangalore",
    "Jayanagar, Bangalore",
    "Malleshwaram, Bangalore",
    "Marathahalli, Bangalore",
    "Rajajinagar, Bangalore",
    "Banjara Hills, Hyderabad",
    "Jubilee Hills, Hyderabad",
    "Kukatpally, Hyderabad",
    "Madhapur, Hyderabad",
    "Miyapur, Hyderabad",
    "Alwarpet, Chennai",
    "Besant Nagar, Chennai",
    "Mylapore, Chennai",
    "Nungambakkam, Chennai",
    "T. Nagar, Chennai",
    "Ballygunge, Kolkata",
    "Behala, Kolkata",
    "New Town, Kolkata",
    "Tollygunge, Kolkata"
];

export default function RideFinderPage() {
    const { toast } = useToast();
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
    const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RideFinderOutput | null>(null);
    const [aiError, setAiError] = useState('');
    const [trafficAlerts, setTrafficAlerts] = useState<string[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [showPickupList, setShowPickupList] = useState(false);
    const [showDropoffList, setShowDropoffList] = useState(false);

    const pickupRef = useRef<HTMLDivElement>(null);
    const dropoffRef = useRef<HTMLDivElement>(null);

    const handleFindRides = async (isRefresh = false) => {
        if (!pickup.trim() || !dropoff.trim()) {
            toast({
                variant: 'destructive',
                title: 'Locations Required',
                description: 'Please select both a pickup and a drop-off location from the list.',
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
            setTrafficAlerts(response.trafficAlerts || ["Traffic moving smoothly on main junctions.", "High demand detected in your area."]);
            setLastUpdated(new Date().toLocaleTimeString());
            
            if (isRefresh) {
                toast({
                    title: "Live AI Update",
                    description: "Fares and traffic status updated via AI.",
                });
            }
        } catch (error: any) {
            console.error('Ride finding failed:', error);
            setAiError(error.message || 'Could not find rides at the moment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickupRef.current && !pickupRef.current.contains(event.target as Node)) {
                setShowPickupList(false);
            }
            if (dropoffRef.current && !dropoffRef.current.contains(event.target as Node)) {
                setShowDropoffList(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePickupChange = (val: string) => {
        setPickup(val);
        if (val.length > 1) {
            const filtered = POPULAR_LOCATIONS.filter(l => l.toLowerCase().includes(val.toLowerCase()));
            setPickupSuggestions(filtered);
            setShowPickupList(true);
        } else {
            setPickupSuggestions([]);
            setShowPickupList(false);
        }
    };

    const handleDropoffChange = (val: string) => {
        setDropoff(val);
        if (val.length > 1) {
            const filtered = POPULAR_LOCATIONS.filter(l => l.toLowerCase().includes(val.toLowerCase()));
            setDropoffSuggestions(filtered);
            setShowDropoffList(true);
        } else {
            setDropoffSuggestions([]);
            setShowDropoffList(false);
        }
    };

    useEffect(() => {
        if (!result) return;
        const interval = setInterval(() => {
            handleFindRides(true);
        }, 45000); 
        return () => clearInterval(interval);
    }, [result, pickup, dropoff]);

    const groupedResults = result?.options.reduce((acc, option) => {
        (acc[option.service] = acc[option.service] || []).push(option);
        return acc;
    }, {} as Record<string, RideOption[]>);

    const mapUrl = (pickup && dropoff && GOOGLE_MAPS_API_KEY) 
        ? `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}&mode=driving`
        : (pickup && GOOGLE_MAPS_API_KEY)
        ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(pickup)}`
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
                            AI Ride Finder
                        </CardTitle>
                        <CardDescription>Live AI-powered comparisons and real-time traffic updates from our digital assistant.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {aiError && (
                        <Alert variant="destructive">
                            <AlertTitle>AI Feature Unavailable</AlertTitle>
                            <AlertDescription>{aiError}</AlertDescription>
                        </Alert>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                        <div className="space-y-2 relative" ref={pickupRef}>
                            <Label htmlFor="pickup">Pickup Location</Label>
                            <div className='relative'>
                                <Input
                                    id="pickup"
                                    value={pickup}
                                    onChange={(e) => handlePickupChange(e.target.value)}
                                    onFocus={() => pickup.length > 0 && setShowPickupList(true)}
                                    placeholder="Start typing (e.g., Koramangala)"
                                    className="pr-10"
                                    disabled={loading}
                                />
                                {pickup && <X className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground' onClick={() => setPickup('')} />}
                            </div>
                            {showPickupList && pickupSuggestions.length > 0 && (
                                <ul className="absolute z-[60] w-full bg-background border rounded-md shadow-lg mt-1 overflow-hidden max-h-60 overflow-y-auto">
                                    {pickupSuggestions.map((loc) => (
                                        <li 
                                            key={loc} 
                                            className="px-4 py-2 hover:bg-muted cursor-pointer text-sm flex items-center gap-2"
                                            onClick={() => {
                                                setPickup(loc);
                                                setShowPickupList(false);
                                            }}
                                        >
                                            <MapPin className='h-3 w-3 text-primary' /> {loc}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="space-y-2 relative" ref={dropoffRef}>
                            <Label htmlFor="dropoff">Drop-off Location</Label>
                            <div className='relative'>
                                <Input
                                    id="dropoff"
                                    value={dropoff}
                                    onChange={(e) => handleDropoffChange(e.target.value)}
                                    onFocus={() => dropoff.length > 0 && setShowDropoffList(true)}
                                    placeholder="Destination (e.g., Indiranagar)"
                                    className="pr-10"
                                    disabled={loading}
                                />
                                {dropoff && <X className='absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground' onClick={() => setDropoff('')} />}
                            </div>
                            {showDropoffList && dropoffSuggestions.length > 0 && (
                                <ul className="absolute z-[60] w-full bg-background border rounded-md shadow-lg mt-1 overflow-hidden max-h-60 overflow-y-auto">
                                    {dropoffSuggestions.map((loc) => (
                                        <li 
                                            key={loc} 
                                            className="px-4 py-2 hover:bg-muted cursor-pointer text-sm flex items-center gap-2"
                                            onClick={() => {
                                                setDropoff(loc);
                                                setShowDropoffList(false);
                                            }}
                                        >
                                            <MapPin className='h-3 w-3 text-primary' /> {loc}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button onClick={() => handleFindRides()} disabled={loading || !pickup || !dropoff} className="w-full text-lg h-12">
                            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                            {loading ? 'AI Analyzing Traffic & Fares...' : 'Get Live AI Rates'}
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center italic">
                            * Fares are live tentative estimates generated by Gemini AI based on current traffic patterns.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                        <Card className="lg:col-span-1 border-primary/20 bg-primary/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-primary animate-pulse" />
                                    AI LIVE ROAD STATUS
                                </CardTitle>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    Last AI Sync: {lastUpdated || 'Waiting for locations...'}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-48 pr-4">
                                    <div className="space-y-4">
                                        {!pickup || !dropoff ? (
                                            <p className="text-xs text-muted-foreground italic">Enter locations to get AI traffic updates...</p>
                                        ) : (
                                            trafficAlerts.map((alert, i) => (
                                                <div key={i} className="flex gap-2 text-xs border-l-2 border-primary/30 pl-3 py-1">
                                                    <Navigation className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                                                    <p>{alert}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2 overflow-hidden relative">
                            {mapUrl ? (
                                <iframe
                                    className="w-full h-full min-h-[300px] border-0"
                                    loading="lazy"
                                    allowFullScreen
                                    src={mapUrl}>
                                </iframe>
                            ) : (
                                <div className="w-full h-full min-h-[300px] bg-muted flex flex-col items-center justify-center text-center p-4">
                                    <Map className="h-10 w-10 text-muted-foreground mb-2"/>
                                    <p className="font-semibold text-sm">Interactive Live Map</p>
                                    <p className="text-xs text-muted-foreground max-w-xs">
                                        {!GOOGLE_MAPS_API_KEY 
                                            ? "Add your Google Maps API Key to activate the live map view."
                                            : "Select locations to see AI-generated routes and road status."}
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>

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
                            <h2 className="text-2xl font-bold text-center">Live AI Fare Estimates</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                                {Object.entries(groupedResults || {}).map(([service, options]) => (
                                    <Card key={service} className="flex flex-col h-full border-t-4 border-t-primary shadow-lg hover:shadow-xl transition-shadow">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center justify-between">
                                                <span className='font-bold text-xl'>{service}</span>
                                                <Badge variant="outline" className="text-[10px] font-normal uppercase tracking-wider">AI Estimate</Badge>
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
                                                    Book on {service}
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
