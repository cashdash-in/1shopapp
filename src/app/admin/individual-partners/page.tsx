
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


export default function IndividualPartnersPage() {
    const [partners, setPartners] = useState<PartnerSignupInput[]>([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        async function loadPartners() {
            try {
                setLoading(true);
                const allPartners = await getPartners();
                const individualPartners = allPartners.filter(p => p.partnerType === 'individual');
                setPartners(individualPartners);
            } catch (error) {
                console.error("Failed to fetch partners:", error);
                // Handle error appropriately
            } finally {
                setLoading(false);
            }
        }
        loadPartners();
    }, []);

    return (
        <Card>
        <CardHeader>
          <CardTitle>Individual Partners</CardTitle>
          <CardDescription>
            Manage your individual partners and view their performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Total Revenue</TableHead>
                <TableHead className="hidden md:table-cell">Commission</TableHead>
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
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                        </TableRow>
                    ))
                ) : partners.map((partner, index) => (
                    <TableRow key={partner.email || index}>
                        <TableCell className="font-medium">{partner.fullName}</TableCell>
                        <TableCell className="hidden md:table-cell">{partner.email}<br/>{partner.phone}</TableCell>
                        <TableCell>
                            <Badge variant={'secondary'}>
                                Approved
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">₹0</TableCell>
                        <TableCell className="hidden md:table-cell">₹0</TableCell>
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
    )
}
