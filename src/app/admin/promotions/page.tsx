
'use client'
import React from 'react';
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
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle } from "lucide-react"

const promotions = [
    {
        brand: "Flipkart",
        type: "Featured Tile",
        details: "Shopping Category - Position 1",
        status: "Active",
        startDate: "2024-08-01",
        endDate: "2024-08-31",
    },
    {
        brand: "Myntra",
        type: "Coupon Code",
        details: "15% off for 1ShopApp users",
        status: "Active",
        startDate: "2024-08-01",
        endDate: "2024-08-15",
    },
     {
        brand: "MakeMyTrip",
        type: "Coupon Code",
        details: "₹500 off on flights",
        status: "Scheduled",
        startDate: "2024-09-01",
        endDate: "2024-09-30",
    },
     {
        brand: "Amazon",
        type: "Featured Tile",
        details: "Shopping Category - Position 2",
        status: "Expired",
        startDate: "2024-07-01",
        endDate: "2024-07-31",
    }
]

export default function PromotionsPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Promotions</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Promotion
                        </span>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Promotions</CardTitle>
                    <CardDescription>
                        Oversee sponsored placements and exclusive coupon codes for brands.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Brand</TableHead>
                                <TableHead>Promotion Type</TableHead>
                                <TableHead className="hidden md:table-cell">Details</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Start Date</TableHead>
                                <TableHead className="hidden md:table-cell">End Date</TableHead>
                                <TableHead>
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {promotions.map((promo) => (
                                <TableRow key={promo.brand + promo.type}>
                                    <TableCell className="font-medium">{promo.brand}</TableCell>
                                    <TableCell>{promo.type}</TableCell>
                                    <TableCell className="hidden md:table-cell">{promo.details}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={promo.status === 'Active' ? 'default' : promo.status === 'Scheduled' ? 'secondary' : 'outline'}
                                            className={promo.status === 'Active' ? 'bg-green-600' : ''}
                                        >
                                            {promo.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">{promo.startDate}</TableCell>
                                    <TableCell className="hidden md:table-cell">{promo.endDate}</TableCell>
                                    <TableCell>
                                        {/* Actions Dropdown Here */}
                                        <Button size="icon" variant="ghost">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
