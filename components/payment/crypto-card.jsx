import React from 'react'

import { TableRow,  TableCell } from "@/components/ui/table"
import { format } from 'date-fns';

const CryptoCard = ({cart}) => {
    
  return (
    <TableRow>
        <TableCell className="hidden sm:table-cell">
            <img
                alt="Product image"
                className="aspect-square rounded-md object-cover"
                height="64"
                src={cart.img}
                width="64"
            />
        </TableCell>
        <TableCell className="font-medium">{cart.name}</TableCell>

        <TableCell className=" md:table-cell">${(cart.price*cart.quantity).toFixed(2)}</TableCell>
        <TableCell className=" md:table-cell">{cart.quantity}</TableCell>
        <TableCell className="hidden md:table-cell">{format(cart.createAt, 'yyyy-MM-dd HH:mm')}</TableCell>
   
    </TableRow>
  ) 
}

export default CryptoCard