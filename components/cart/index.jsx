"use client"
import React, { useState } from 'react'
import { ShoppingCart, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import useCart from '@/hooks/useCart'
import CartCard from '../card/cart-card'
import { Separator } from '../ui/separator'
import { useRouter } from 'next/navigation'



const Cart = () => {
    const {carts,totalPrices,clearCart} = useCart()
    const [open,setOpen] = useState(false)
    const route = useRouter()
    if(carts.length === 0){
        return null
    }

    const handleChechout = ()=>{
      setOpen(false)
      route.push('/payment')
      
    }

    const handleClearOrder = ()=>{
      clearCart()
      setOpen(false)
    }

    const totalItems = carts.reduce((sum, cart) => sum + cart.quantity, 0)

  return (
    <Dialog open={open}>

      <DialogTrigger asChild>
        <div 
          onClick={()=>setOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-sky-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative bg-sky-500 p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200">
              <ShoppingCart className="w-8 h-8 text-white" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-white text-sky-600 font-bold text-xs px-2 py-1 rounded-full shadow-lg">
                  {totalItems}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-[425px] md:max-w-[1000px] h-[85vh] md:h-[80vh] overflow-hidden flex flex-col"
                      setOpen={setOpen}
      >
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 p-2 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900">Your Cart</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
              </DialogDescription>
            </div>
          </div>
          <Separator className="mt-4"/>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {
                carts?.map((pizza)=>(
                    <CartCard key={`${pizza.id}${pizza.sizeandcrust}`}
                              pizza={pizza}
                              
                    />
                ))
            }
        </div>

        <div className="border-t pt-4 space-y-4">
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-700">Total Amount</span>
                <div className="text-right">
                  <span className="text-3xl font-bold text-sky-600">
                    ${totalPrices.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter className="gap-3 pt-4">
          <Button 
            onClick={handleClearOrder}
            variant="destructive"
            className="flex-1 md:flex-none"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Orders
          </Button>
          
          <Button 
            onClick={handleChechout}
            className="flex-1 md:flex-none bg-sky-500 hover:bg-sky-600 text-white font-semibold"
          >
            Proceed to Checkout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  
  )
}

export default Cart





