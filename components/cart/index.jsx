"use client"
import React, { useState } from 'react'
import {ShoppingCart} from 'lucide-react'
import { Button } from "@/components/ui/button"
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

  return (


    <Dialog open={open}>

      <DialogTrigger asChild>
        <div onClick={()=>setOpen(true)}
              className="fixed bottom-5 right-5 p-3 bg-sky-500 rounded-full hover:scale-125 transition">
            <ShoppingCart className="w-10 h-10 cursor-pointer " />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-[425px] md:max-w-[1000px] h-5/6 md:h-4/6 overflow-y-scroll"
                      setOpen={setOpen}
      >
        <DialogHeader>
          <DialogTitle>Your Cart</DialogTitle>
          <Separator/>
        </DialogHeader>

        <div className="space-y-10">
            {
                carts?.map((pizza)=>(
                    <CartCard key={`${pizza.id}${pizza.sizeandcrust}`}
                              pizza={pizza}
                              
                    />
                ))
            }

            <p className=' text-end text-2xl font-bold'>
              Total prices: ${totalPrices.toFixed(2)}
            </p>
        </div>
        
        <DialogFooter>
          <Button onClick={handleClearOrder}
                  variant="destructive"
          >
            Clear Orders
          </Button>
          
          <Button onClick={handleChechout}>
            Check Out
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  
  )
}

export default Cart





