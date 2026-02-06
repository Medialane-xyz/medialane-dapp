
"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ShoppingCart, RefreshCw, ArrowRightLeft } from "lucide-react"

export function AssetHistory() {
    return (
        <div className="rounded-md border border-white/10 overflow-hidden">
            <Table>
                <TableHeader className="bg-white/5">
                    <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead>Event</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium flex items-center gap-2">
                            <ShoppingCart className="h-4 w-4 text-blue-400" /> Sale
                        </TableCell>
                        <TableCell>0.45 ETH</TableCell>
                        <TableCell className="text-blue-400">0xArt...8f2</TableCell>
                        <TableCell className="text-blue-400">0xCol...99a</TableCell>
                        <TableCell className="text-right text-muted-foreground">2 days ago</TableCell>
                    </TableRow>
                    <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-purple-400" /> Remix
                        </TableCell>
                        <TableCell>0.05 ETH</TableCell>
                        <TableCell className="text-blue-400">0xCre...abc</TableCell>
                        <TableCell className="text-blue-400">0xRem...123</TableCell>
                        <TableCell className="text-right text-muted-foreground">5 days ago</TableCell>
                    </TableRow>
                    <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell className="font-medium flex items-center gap-2">
                            <ArrowRightLeft className="h-4 w-4 text-gray-400" /> Transfer
                        </TableCell>
                        <TableCell>-</TableCell>
                        <TableCell className="text-blue-400">NullAddress</TableCell>
                        <TableCell className="text-blue-400">0xArt...8f2</TableCell>
                        <TableCell className="text-right text-muted-foreground">1 month ago</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
