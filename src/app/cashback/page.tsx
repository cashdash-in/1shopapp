
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Gift, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getUserCashbackDetails } from "@/ai/flows/cashback-flow";
import type { UserCashbackDetails } from "@/ai/schemas";
import { Skeleton } from "@/components/ui/skeleton";

export default function CashbackPage() {
  const [cashbackDetails, setCashbackDetails] = useState<UserCashbackDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, you'd pass a real user ID. For this prototype, the flow returns a default user.
        const data = await getUserCashbackDetails("user_abc123");
        setCashbackDetails(data);
      } catch (error) {
        console.error("Failed to fetch cashback details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative">
            <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5 text-muted-foreground"/>
                <span className="sr-only">Back to Home</span>
            </Link>
            <div className="flex flex-col items-center text-center pt-8">
                <Wallet className="h-12 w-12 text-primary mb-2"/>
                <CardTitle className="text-3xl font-bold tracking-tight">My Cashback</CardTitle>
                <CardDescription>View your earnings and transaction history.</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <Card className="text-center bg-secondary">
                <CardHeader>
                    <CardTitle>Total Balance</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                       <Skeleton className="h-10 w-40 mx-auto" />
                    ) : (
                       <p className="text-4xl font-bold text-primary">
                        ₹{cashbackDetails?.totalBalance.toFixed(2) || '0.00'}
                       </p>
                    )}
                </CardContent>
                 <CardFooter className="flex justify-center">
                    <Button disabled={loading || cashbackDetails?.totalBalance === 0}>
                        <Gift className="mr-2 h-4 w-4" />
                        Withdraw Funds
                    </Button>
                 </CardFooter>
            </Card>

            <Separator />
            
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Transaction History
                </h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({length: 4}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto rounded-full" /></TableCell>
                                </TableRow>
                            ))
                        ) : cashbackDetails?.transactions.length === 0 ? (
                           <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    No transactions yet. Start shopping to earn cashback!
                                </TableCell>
                           </TableRow>
                        ) : (
                            cashbackDetails?.transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-medium">{tx.description}</TableCell>
                                    <TableCell className={tx.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                                        {tx.amount > 0 ? `+₹${tx.amount.toFixed(2)}` : `-₹${Math.abs(tx.amount).toFixed(2)}`}
                                    </TableCell>
                                    <TableCell>{tx.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={tx.status === "Credited" ? "default" : tx.status === "Paid" ? "secondary" : "outline"}  className={tx.status === 'Credited' ? 'bg-green-600' : ''}>
                                            {tx.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
