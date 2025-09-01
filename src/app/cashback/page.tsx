
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, Gift, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Mock data - in a real app, this would be fetched for the logged-in user
const cashbackDetails = {
  totalBalance: 225.75,
  transactions: [
    { id: "txn_1", description: "Cashback from Flipkart", amount: 50.25, status: "Credited", date: "2024-08-20" },
    { id: "txn_2", description: "Cashback from Myntra", amount: 75.50, status: "Credited", date: "2024-08-18" },
    { id: "txn_3", description: "Cashback from Swiggy", amount: 25.00, status: "Pending", date: "2024-08-22" },
    { id: "txn_4", description: "Withdrawal to Bank Account", amount: -100.00, status: "Paid", date: "2024-08-15" },
    { id: "txn_5", description: "Cashback from Amazon", amount: 175.00, status: "Credited", date: "2024-08-12" },
  ]
};

export default function CashbackPage() {
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
                    <p className="text-4xl font-bold text-primary">
                        ₹{cashbackDetails.totalBalance.toFixed(2)}
                    </p>
                </CardContent>
                 <CardFooter className="flex justify-center">
                    <Button>
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
                        {cashbackDetails.transactions.map((tx) => (
                            <TableRow key={tx.id}>
                                <TableCell className="font-medium">{tx.description}</TableCell>
                                <TableCell className={tx.amount > 0 ? 'text-green-500' : 'text-red-500'}>
                                    {tx.amount > 0 ? `+₹${tx.amount.toFixed(2)}` : `-₹${Math.abs(tx.amount).toFixed(2)}`}
                                </TableCell>
                                <TableCell>{tx.date}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={tx.status === "Credited" ? "default" : tx.status === "Paid" ? "secondary" : "outline"}>
                                        {tx.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
