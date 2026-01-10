import React from 'react'
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import useCart from '@/hooks/useCart';
import CryptoCard from './crypto-card';
const CartPayment = () => {
    const {carts} = useCart()
    console.log(carts);
  return (
    <Table className="basis-2/3">
        <TableHeader>
            <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="md:table-cell">Price</TableHead>
            <TableHead className="md:table-cell">Quantity</TableHead>
            <TableHead className="hidden md:table-cell">Created at</TableHead>
        
            </TableRow>
        </TableHeader>

        <TableBody>

            {
                carts.map((cart)=>(
                    <CryptoCard key={cart.id}
                                cart={cart}
                    />
                ))
            }
        
        </TableBody>
    </Table>
  )
}

export default CartPayment