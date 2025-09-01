
'use client'
import React, { useState } from 'react';
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

// Mock data, in a real app this would come from a database
const cashbackData = [
  {
    userId: "user_abc123",
    userName: "Rohan Sharma",
    totalCashback: 150.75,
    status: "Pending",
    lastActivity: "2024-08-15"
  },
  {
    userId: "user_def456",
    userName: "Priya Patel",
    totalCashback: 275.50,
    status: "Paid",
    lastActivity: "2024-07-30"
  },
  {
    userId: "user_ghi789",
    userName: "Ankit Jain",
    totalCashback: 50.00,
    status: "Pending",
    lastActivity: "2024-08-20"
  },
   {
    userId: "user_jkl012",
    userName: "Sneha Reddy",
    totalCashback: 450.25,
    status: "Paid",
    lastActivity: "2024-06-10"
  }
];

export default function CashbackAdminPage() {
    const [transactions, setTransactions] = useState(cashbackData);

    const handleStatusChange = (userId: string, newStatus: "Pending" | "Paid") => {
        setTransactions(prev => prev.map(t => t.userId === userId ? {...t, status: newStatus} : t));
        // In a real app, you would call a server action here to update the database.
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
                        {transactions.map((transaction) => (
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
