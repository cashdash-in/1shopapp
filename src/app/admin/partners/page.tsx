
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

const partners = [
    {
        shopName: "Raju Mobile Shop",
        ownerName: "Raju Kumar",
        phone: "9876543210",
        email: "raju.kumar@example.com",
        status: "Approved",
        revenue: "₹12,500",
        commission: "₹1,250",
    },
    {
        shopName: "Sangeetha Mobiles",
        ownerName: "Priya Singh",
        phone: "9123456789",
        email: "priya.s@example.com",
        status: "Pending",
        revenue: "₹0",
        commission: "₹0",
    },
    {
        shopName: "The Mobile Store",
        ownerName: "Amit Patel",
        phone: "9988776655",
        email: "amit.p@example.com",
        status: "Approved",
        revenue: "₹8,200",
        commission: "₹820",
    },
    {
        shopName: "Quick Fix Mobiles",
        ownerName: "Sunita Devi",
        phone: "9765432109",
        email: "sunita.d@example.com",
        status: "Approved",
        revenue: "₹21,000",
        commission: "₹2,100",
    },
     {
        shopName: "Future Gadgets",
        ownerName: "Vikram Sharma",
        phone: "9654321098",
        email: "vikram.s@example.com",
        status: "Pending",
        revenue: "₹0",
        commission: "₹0",
    },
]

export default function PartnersPage() {
    return (
        <Card>
        <CardHeader>
          <CardTitle>Partners</CardTitle>
          <CardDescription>
            Manage your partners and view their performance.
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
                <TableHead className="hidden md:table-cell">Commission</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {partners.map(partner => (
                    <TableRow key={partner.email}>
                        <TableCell className="font-medium">{partner.shopName}</TableCell>
                        <TableCell className="hidden md:table-cell">{partner.ownerName}</TableCell>
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
