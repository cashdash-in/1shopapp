
'use client'
import React, { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DollarSign, Users, CreditCard, Activity, MousePointerClick, Download } from 'lucide-react'
import { getPartners } from '@/ai/flows/partner-signup-flow';
import { getFeedback } from '@/ai/flows/feedback-submission-flow';
import { Skeleton } from '@/components/ui/skeleton';

const data = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 4800 },
    { name: "Aug", total: 5200 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ]

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 125432.89,
    uniqueVisitors: 7821,
    activePartners: 0,
    pwaInstalls: 573,
    totalClicks: 0,
    commissionsPaid: 12234.00,
    pendingApprovals: 0
  });

   useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const partners = await getPartners();
        const feedback = await getFeedback();

        // Calculate total clicks from localStorage
        const storedClicks = localStorage.getItem('brandClicks');
        const clicks = storedClicks ? JSON.parse(storedClicks) : {};
        const totalClicks = Object.values(clicks).reduce((acc: number, item: any) => acc + item.clicks, 0);

        // Get unanalyzed feedback count for 'pending approvals'
        const pendingApprovals = feedback.filter(f => !f.analysis).length;

        setStats(prev => ({
          ...prev,
          activePartners: partners.length,
          totalClicks: totalClicks,
          pendingApprovals: pendingApprovals
        }));

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);


  const renderCard = (title: string, value: string | number, subtext: string, icon: React.ReactNode, isLoading: boolean) => (
      <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
             {isLoading ? (
                <>
                    <Skeleton className="h-8 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                </>
             ) : (
                <>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">{subtext}</p>
                </>
             )}
          </CardContent>
        </Card>
  )

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {renderCard("Total Revenue", `₹${stats.totalRevenue.toLocaleString('en-IN')}`, "+20.1% from last month", <DollarSign className="h-4 w-4 text-muted-foreground" />, loading)}
        {renderCard("Unique Visitors", `+${stats.uniqueVisitors.toLocaleString('en-IN')}`, "+12.5% from last month", <Users className="h-4 w-4 text-muted-foreground" />, loading)}
        {renderCard("Active Partners", `+${stats.activePartners}`, "+18.1% from last month", <Users className="h-4 w-4 text-muted-foreground" />, loading)}
        {renderCard("PWA Installs", `+${stats.pwaInstalls}`, "+201 since last month", <Download className="h-4 w-4 text-muted-foreground" />, loading)}
        {renderCard("Total Clicks", `+${stats.totalClicks.toLocaleString('en-IN')}`, "+19% from last month", <MousePointerClick className="h-4 w-4 text-muted-foreground" />, loading)}
        {renderCard("Commissions Paid", `₹${stats.commissionsPaid.toLocaleString('en-IN')}`, "+19% from last month", <CreditCard className="h-4 w-4 text-muted-foreground" />, loading)}
        {renderCard("Pending Approvals", `+${stats.pendingApprovals}`, "2 since last hour", <Activity className="h-4 w-4 text-muted-foreground" />, loading)}
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
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
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
