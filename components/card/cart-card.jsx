import React from 'react'

import useCart from '@/hooks/useCart'
import {CirclePlus,CircleMinus,Vegan} from 'lucide-react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import useSWR from 'swr'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect } from 'react'

const CartCard = ({pizza}) => { 
  const {addItem,removeItem,addToppingToPizza,removeToppingFromPizza,initializeToppingToPizza} = useCart()
  
  // Ensure we have a valid pizza ID (could be pizza.id or pizza._id)
  const pizzaId = pizza.id || pizza._id;
  
  const {data:toppings,isLoading} = useSWR(
    pizzaId ? `${pizzaId}${pizza.sizeandcrust}` : null, 
    async () => {
      if (!pizzaId) return null;
      const response = await fetch(`/api/pizzas/${pizzaId}/toppings`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch toppings');
      }
      return result;
    }
  )
  
  useEffect(() => {
    if (!isLoading && toppings && toppings.data) {
      toppings.data.forEach(topping => {
        // Check if pizza has toppings array and if this topping is already initialized
        const pizzaToppings = pizza.toppings || [];
        if (!pizzaToppings.some(t => t.name === topping.name)) {
          initializeToppingToPizza(pizzaId, topping );
        }
      });
    }
  }, [isLoading, toppings, pizzaId]);

  if (isLoading) {
      return <p>Loading...</p>;
  }
  console.log(toppings);

 
  return (

    <div className="flex items-center justify-between ">

        <Accordion type="single" collapsible className="w-full">
            
            <AccordionItem value="item-1">
                <div className='flex justify-between'>
                    <AccordionTrigger>   
                        <div className='flex flex-col md:flex-row items-center gap-4 '>
                            <img src={pizza.img} className='h-20 w-40  object-cover rounded-md' alt=''/>
                            <p>
                            {pizza.name}
                            </p>
                            <p className='text-sm'>
                                ({  pizza.sizeandcrust === "M" ? "6 Inch" :
                                    pizza.sizeandcrust === "L" ? "9 Inch" :
                                    pizza.sizeandcrust === "XL" ? "12 Inch" : ""
                                })
                            </p>

                                    
                    
                        </div>
                    </AccordionTrigger>

                    <div className='flex gap-4 items-center'>
                        <div className='flex items-center gap-2'>
                            <CirclePlus size={20} className='cursor-pointer'
                                        onClick={()=>addItem(pizza)}
                            />
                            <p>
                                {pizza.quantity}
                            </p>
                            <CircleMinus size={20} className='cursor-pointer'
                                        onClick={()=>removeItem(pizza)}
                            />
                        </div>
                    

                        <p className=' w-[60px] text-end'>
                            ${pizza.price * pizza.quantity} 
                        </p>
                        
                    </div>

                </div>
                

                <AccordionContent>
                    {
                    <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total Price</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {toppings?.data.map((topping, index) => {
                            // Find the quantity of this topping in the pizza's toppings array
                            const pizzaTopping = pizza.toppings?.find(t => t.name === topping.name);
                            const quantity = pizzaTopping?.quantity || 0;
                            
                            return (
                              <TableRow key={index}>
                                <TableCell>{topping.name}</TableCell>
                                <TableCell>
                                  <span className={`bg-${topping.isVeg ? 'green' : 'red'}-600 text-white rounded-md px-2`}>
                                    {topping.isVeg ? 'Veg' : 'Non-Veg'}
                                  </span>
                                </TableCell>

                                <TableCell className="flex gap-2">
                                  <CirclePlus
                                      size={20}
                                      className='cursor-pointer'
                                      onClick={() => addToppingToPizza(pizzaId, topping)}
                                  />

                                  {quantity}

                                  <CircleMinus
                                        size={20}
                                        className='cursor-pointer'
                                        onClick={() => removeToppingFromPizza(pizzaId, topping)}
                                  />
                                </TableCell>

                                <TableCell>${topping.price}</TableCell>
                                <TableCell>${(topping.price * quantity).toFixed(2)}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    }
                </AccordionContent>
            </AccordionItem>
       
   

         



        </Accordion>
    </div>
  )
}

export default CartCard