
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
import { Button } from "@/components/ui/button"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialPromotions = [
    {
        id: "promo_1",
        brand: "Flipkart",
        type: "Featured Tile",
        details: "Shopping Category - Position 1",
        status: "Active",
        startDate: "2024-08-01",
        endDate: "2024-08-31",
    },
    {
        id: "promo_2",
        brand: "Myntra",
        type: "Coupon Code",
        details: "15% off for 1ShopApp users",
        status: "Active",
        startDate: "2024-08-01",
        endDate: "2024-08-15",
    },
     {
        id: "promo_3",
        brand: "MakeMyTrip",
        type: "Coupon Code",
        details: "₹500 off on flights",
        status: "Scheduled",
        startDate: "2024-09-01",
        endDate: "2024-09-30",
    },
     {
        id: "promo_4",
        brand: "Amazon",
        type: "Featured Tile",
        details: "Shopping Category - Position 2",
        status: "Expired",
        startDate: "2024-07-01",
        endDate: "2024-07-31",
    }
]

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState(initialPromotions);
    const [dialogOpen, setDialogOpen] = useState(false);

    // This function is for demonstration and won't persist data
    const handleAddPromotion = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newPromotion = {
            id: `promo_${Date.now()}`,
            brand: formData.get('brand') as string,
            type: formData.get('type') as string,
            details: formData.get('details') as string,
            status: 'Scheduled',
            startDate: formData.get('start-date') as string,
            endDate: formData.get('end-date') as string,
        };
        setPromotions(prev => [newPromotion, ...prev]);
        setDialogOpen(false);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Promotions</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="h-8 gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Promotion
                                </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                             <form onSubmit={handleAddPromotion}>
                                <DialogHeader>
                                <DialogTitle>Add New Promotion</DialogTitle>
                                <DialogDescription>
                                    Create a new sponsored placement or coupon code.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="brand" className="text-right">Brand</Label>
                                        <Input id="brand" name="brand" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="type" className="text-right">Type</Label>
                                         <Select name="type" required>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Featured Tile">Featured Tile</SelectItem>
                                                <SelectItem value="Coupon Code">Coupon Code</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="details" className="text-right">Details</Label>
                                        <Input id="details" name="details" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="start-date" className="text-right">Start Date</Label>
                                        <Input id="start-date" name="start-date" type="date" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="end-date" className="text-right">End Date</Label>
                                        <Input id="end-date" name="end-date" type="date" className="col-span-3" required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Create Promotion</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
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
                                <TableRow key={promo.id}>
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
                                       <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Archive</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
