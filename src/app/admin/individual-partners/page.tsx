
'use client'
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

const individualPartners = [
    {
        name: "Anjali Gupta",
        phone: "9876512345",
        email: "anjali.g@example.com",
        status: "Approved",
        revenue: "₹5,500",
        commission: "₹550",
    },
    {
        name: "Suresh Reddy",
        phone: "9123498765",
        email: "suresh.r@example.com",
        status: "Pending",
        revenue: "₹0",
        commission: "₹0",
    },
    {
        name: "Deepak Kumar",
        phone: "9988771122",
        email: "deepak.k@example.com",
        status: "Approved",
        revenue: "₹3,100",
        commission: "₹310",
    },
]

export default function IndividualPartnersPage() {
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
                {individualPartners.map(partner => (
                    <TableRow key={partner.email}>
                        <TableCell className="font-medium">{partner.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{partner.email}<br/>{partner.phone}</TableCell>
                        <TableCell>
                            <Badge variant={partner.status === 'Approved' ? 'default' : 'secondary'}>
                                {partner.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{partner.revenue}</TableCell>
                        <TableCell className="hidden md:table-cell">{partner.commission}</TableCell>
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
                                <DropdownMenuItem>Approve</DropdownMenuItem>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                    Reject
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
