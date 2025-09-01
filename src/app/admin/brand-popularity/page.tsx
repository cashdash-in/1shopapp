
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from '@/components/ui/skeleton';
import { getClickCounts } from '@/ai/flows/click-tracking-flow';
import type { ClickData } from '@/ai/schemas';

interface PopularityData extends ClickData {
    popularity: number; // Percentage
}

export default function BrandPopularityPage() {
    const [popularityData, setPopularityData] = useState<PopularityData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        async function fetchData() {
            try {
                const clickDataArray = await getClickCounts();

                // Calculate total clicks per category
                const categoryTotals = clickDataArray.reduce((acc, item) => {
                    acc[item.category] = (acc[item.category] || 0) + item.clicks;
                    return acc;
                }, {} as Record<string, number>);

                const calculatedData = clickDataArray.map(item => ({
                    ...item,
                    popularity: categoryTotals[item.category] ? (item.clicks / categoryTotals[item.category]) * 100 : 0
                })).sort((a, b) => b.clicks - a.clicks); // Sort by most clicks

                setPopularityData(calculatedData);
            } catch (error) {
                console.error("Failed to fetch brand popularity data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Brand Popularity</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Brand Performance Report</CardTitle>
                    <CardDescription>
                        Popularity of brands based on user clicks within each category.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Brand</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-right">Total Clicks</TableHead>
                                <TableHead>Popularity in Category</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : popularityData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        No click data available yet. Clicks will be tracked as users interact with the app.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                popularityData.map((item) => (
                                    <TableRow key={`${item.category}-${item.brand}`}>
                                        <TableCell className="font-medium">{item.brand}</TableCell>
                                        <TableCell className='text-muted-foreground'>{item.category}</TableCell>
                                        <TableCell className="text-right font-medium">{item.clicks}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={item.popularity} className="w-full" />
                                                <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                                                    {item.popularity.toFixed(1)}%
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
