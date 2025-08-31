
'use client';

import React, { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DollarSign, Package, CreditCard, Users, LogOut } from "lucide-react"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PartnerSignupInput } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';

const chartData = [
    { month: "Jan", revenue: Math.floor(Math.random() * 2000) },
    { month: "Feb", revenue: Math.floor(Math.random() * 3000) },
    { month: "Mar", revenue: Math.floor(Math.random() * 2500) },
    { month: "Apr", revenue: Math.floor(Math.random() * 3200) },
    { month: "May", revenue: Math.floor(Math.random() * 3500) },
    { month: "Jun", revenue: Math.floor(Math.random() * 4100) },
]

const recentReferrals = [
    { id: 'usr_1', date: '2024-07-15', commission: '₹50' },
    { id: 'usr_2', date: '2024-07-14', commission: '₹25' },
    { id: 'usr_3', date: '2024-07-12', commission: '₹100' },
    { id: 'usr_4', date: '2024-07-11', commission: '₹50' },
]

export default function PartnerDashboard() {
  const router = useRouter();
  const [partner, setPartner] = useState<PartnerSignupInput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This timeout is to ensure that any potential race condition with hydration is avoided.
    // In a real-world scenario with proper auth, this might not be needed.
    setTimeout(() => {
        const storedPartner = localStorage.getItem('loggedInPartner');
        if (storedPartner) {
            try {
                const parsedPartner = JSON.parse(storedPartner);
                setPartner(parsedPartner);
            } catch (e) {
                console.error("Failed to parse partner data from localStorage", e);
                router.push('/partner/login');
            }
        } else {
            // If no partner is logged in, redirect to login page
            router.push('/partner/login');
        }
        setLoading(false);
    }, 100);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInPartner');
    router.push('/partner/login');
  };


  if (loading) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 p-4 md:p-8">
            <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-1/4" />
                <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
                <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
                    <Skeleton className="h-96 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        </div>
    );
  }

  if (!partner) {
    // This can be a brief state before redirect happens or if data is missing
    return null;
  }
  
  const partnerName = partner.partnerType === 'business' ? partner.shopName : partner.fullName;
  const partnerInitials = (partnerName || 'P').charAt(0).toUpperCase();

  const referralCode = ((partnerName || 'PARTNER')
      .slice(0, 10)
      .toUpperCase()
      .replace(/\s+/g, '')
      .replace(/[^A-Z0-9]/g, '')
      .trim() || 'PARTNER') + '1234';

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 justify-between">
            <h1 className="text-xl font-semibold">Partner Dashboard</h1>
            <div className="flex items-center gap-4">
                 <Link href="/partner" className='text-sm text-muted-foreground hover:text-primary'>
                    Partner Program Home
                </Link>
                 <Button variant="outline" size="sm" asChild>
                     <Link href="/">1ShopApp Home</Link>
                </Button>
                 <Avatar>
                    <AvatarImage src={`https://picsum.photos/seed/${partner.email}/100/100`} alt="Partner" />
                    <AvatarFallback>{partnerInitials}</AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Logout</span>
                </Button>
            </div>
        </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue Generated
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0.00</div>
              <p className="text-xs text-muted-foreground">
                All-time revenue from your referrals
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Commission Earned
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0.00</div>
              <p className="text-xs text-muted-foreground">
                {partner.commission || 10}% of total revenue
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+0</div>
              <p className="text-xs text-muted-foreground">
                No new referrals this month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Referral Code</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold break-all">{referralCode}</div>
               <p className="text-xs text-muted-foreground">
                Share this code with your customers
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>
                Revenue generated by your referrals over the last 6 months.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value / 1000}K`}
                  />
                  <Bar dataKey="revenue" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
              <CardDescription>
                Users who signed up using your referral code.
              </CardDescription>
            </CardHeader>
            <CardContent className='flex-grow'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className='text-right'>Commission</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                           <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                            No recent referrals yet.
                           </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
