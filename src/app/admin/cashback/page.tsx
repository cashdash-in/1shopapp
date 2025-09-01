
'use client'
import React, { useState, useEffect } from 'react';
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
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { getCashbackData, updateCashbackStatus } from '@/ai/flows/cashback-flow';
import type { CashbackTransaction } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function CashbackAdminPage() {
    const [transactions, setTransactions] = useState<CashbackTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await getCashbackData();
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch cashback data:", error);
            toast({ title: "Error", description: "Could not load cashback data.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleStatusChange = async (userId: string, newStatus: "Pending" | "Paid") => {
       try {
            // Optimistically update UI
            setTransactions(prev => prev.map(t => t.userId === userId ? {...t, status: newStatus} : t));

            // Call server action
            await updateCashbackStatus(userId, newStatus);
            
            toast({
                title: "Status Updated",
                description: `Transaction for ${userId} marked as ${newStatus}.`,
            });
       } catch (error) {
            console.error("Failed to update status:", error);
            toast({ title: "Update Failed", description: "Could not update status. Reverting.", variant: "destructive" });
            // Revert optimistic update on failure
            fetchTransactions();
       }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cashback Management</CardTitle>
                <CardDescription>
                    View and manage cashback payments for users.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Total Cashback</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Activity</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({length: 4}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                </TableRow>
                            ))
                        ) : transactions.map((transaction) => (
                            <TableRow key={transaction.userId}>
                                <TableCell className="font-medium">{transaction.userName}</TableCell>
                                <TableCell>₹{transaction.totalCashback.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={transaction.status === "Paid" ? "secondary" : "default"} className={transaction.status === 'Paid' ? '' : 'bg-amber-500'}>
                                        {transaction.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{transaction.lastActivity}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                        aria-haspopup="true"
                                        size="icon"
                                        variant="ghost"
                                        >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        {transaction.status === "Pending" && (
                                             <DropdownMenuItem onClick={() => handleStatusChange(transaction.userId, "Paid")}>
                                                Mark as Paid
                                            </DropdownMenuItem>
                                        )}
                                        {transaction.status === "Paid" && (
                                             <DropdownMenuItem onClick={() => handleStatusChange(transaction.userId, "Pending")}>
                                                Mark as Pending
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem>View History</DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
