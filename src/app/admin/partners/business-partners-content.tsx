
'use client'
import React, { useEffect, useState } from 'react';
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
import { getPartners } from '@/ai/flows/partner-signup-flow';
import type { PartnerSignupInput } from '@/ai/schemas';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function BusinessPartnersPage() {
    const [partners, setPartners] = useState<PartnerSignupInput[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPartner, setSelectedPartner] = useState<PartnerSignupInput | null>(null);
    const [commission, setCommission] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        async function loadPartners() {
            try {
                setLoading(true);
                const allPartners = await getPartners();
                const businessPartners = allPartners.filter(p => p.partnerType === 'business');
                setPartners(businessPartners);
            } catch (error) {
                console.error("Failed to fetch partners:", error);
            } finally {
                setLoading(false);
            }
        }
        loadPartners();
    }, []);

    const handleOpenDialog = (partner: PartnerSignupInput) => {
        setSelectedPartner(partner);
        setCommission(partner.commission?.toString() || '');
        setDialogOpen(true);
    }

    const handleSetCommission = () => {
        if (!selectedPartner) return;

        const newCommission = parseFloat(commission);
        if (isNaN(newCommission)) return;

        // NOTE: In a real app, you would call a server action to update the database.
        // For this prototype, we'll just update the local state.
        setPartners(partners.map(p =>
            p.email === selectedPartner.email
                ? { ...p, commission: newCommission }
                : p
        ));
        
        setDialogOpen(false);
        setSelectedPartner(null);
        setCommission('');
    }

    return (
        <>
            <Card>
                <CardHeader>
                <CardTitle>Business Partners</CardTitle>
                <CardDescription>
                    Manage your business partners and view their performance.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Shop Name</TableHead>
                        <TableHead className="hidden md:table-cell">Owner</TableHead>
                        <TableHead className="hidden md:table-cell">Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="hidden md:table-cell">Total Revenue</TableHead>
                        <TableHead>Commission</TableHead>
                        <TableHead>
                        <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            Array.from({length: 3}).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                </TableRow>
                            ))
                        ) : partners.map((partner, index) => (
                            <TableRow key={partner.email || index}>
                                <TableCell className="font-medium">{partner.shopName}</TableCell>
                                <TableCell className="hidden md:table-cell">{partner.ownerName}</TableCell>
                                <TableCell className="hidden md:table-cell">{partner.email}<br/>{partner.phone}</TableCell>
                                <TableCell>
                                    <Badge variant={'secondary'}>
                                        Approved
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">₹0</TableCell>
                                <TableCell>{partner.commission || 0}%</TableCell>
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
                                        <DropdownMenuItem>View Details</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleOpenDialog(partner)}>Set Commission</DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                            Suspend
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Commission for {selectedPartner?.shopName}</DialogTitle>
                        <DialogDescription>
                            Enter the new commission percentage for this partner. This will apply to all future earnings.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="commission" className="text-right">
                                Commission (%)
                            </Label>
                            <Input
                                id="commission"
                                type="number"
                                value={commission}
                                onChange={(e) => setCommission(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., 10"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSetCommission}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
