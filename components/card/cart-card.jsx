import React from 'react'

import useCart from '@/hooks/useCart'
import {CirclePlus,CircleMinus,Vegan, Leaf, Beef} from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const CartCard = ({pizza}) => { 
  const {addItem,removeItem,addToppingToPizza,removeToppingFromPizza,initializeToppingToPizza} = useCart()
  
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

  const sizeLabels = {
    "M": "6 Inch",
    "L": "9 Inch",
    "XL": "12 Inch"
  }

  const toppingsTotal = pizza.toppings?.reduce((sum, t) => sum + (t.price || 0) * t.quantity, 0) || 0
  const itemTotal = (pizza.price + toppingsTotal) * pizza.quantity

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger className="hover:no-underline px-0">
            <CardContent className="w-full p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img 
                    src={pizza.img} 
                    className='h-24 w-32 object-cover rounded-lg shadow-md' 
                    alt={pizza.name}
                  />
                  <Badge 
                    className="absolute top-2 right-2 bg-white text-gray-800 font-semibold text-xs px-2 py-1 shadow-md"
                  >
                    {sizeLabels[pizza.sizeandcrust] || pizza.sizeandcrust}
                  </Badge>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 truncate">
                    {pizza.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Base: ${pizza.price.toFixed(2)}
                    {toppingsTotal > 0 && (
                      <span className="ml-2 text-sky-600">
                        + Toppings: ${toppingsTotal.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                    <CirclePlus 
                      size={20} 
                      className='cursor-pointer text-gray-600 hover:text-sky-600 hover:scale-110 transition-all'
                      onClick={()=>addItem(pizza)}
                    />
                    <span className="font-bold text-lg text-gray-900 min-w-[30px] text-center">
                      {pizza.quantity}
                    </span>
                    <CircleMinus 
                      size={20} 
                      className='cursor-pointer text-gray-600 hover:text-sky-600 hover:scale-110 transition-all'
                      onClick={()=>removeItem(pizza)}
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-sky-600">
                      ${itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </AccordionTrigger>

          <AccordionContent>
            <div className="px-4 pb-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 bg-sky-500 rounded-full"></span>
                  Customize Toppings
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white">
                      <TableHead className="font-semibold text-gray-700">Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                      <TableHead className="font-semibold text-gray-700">Quantity</TableHead>
                      <TableHead className="font-semibold text-gray-700">Price</TableHead>
                      <TableHead className="font-semibold text-gray-700">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {toppings?.data.map((topping, index) => {
                      const pizzaTopping = pizza.toppings?.find(t => t.name === topping.name);
                      const quantity = pizzaTopping?.quantity || 0;
                      
                      return (
                        <TableRow key={index} className="hover:bg-white transition-colors">
                          <TableCell className="font-medium text-gray-900">{topping.name}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={topping.isVeg ? "default" : "destructive"}
                              className={`px-2 py-1 text-xs font-medium ${
                                topping.isVeg 
                                  ? 'bg-green-600 hover:bg-green-700' 
                                  : 'bg-red-600 hover:bg-red-700'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                {topping.isVeg ? (
                                  <Leaf size={12} />
                                ) : (
                                  <Beef size={12} />
                                )}
                                {topping.isVeg ? 'Veg' : 'Non-Veg'}
                              </div>
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CirclePlus
                                size={18}
                                className='cursor-pointer text-gray-600 hover:text-sky-600 hover:scale-110 transition-all'
                                onClick={() => addToppingToPizza(pizzaId, topping)}
                              />
                              <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                                {quantity}
                              </span>
                              <CircleMinus
                                size={18}
                                className='cursor-pointer text-gray-600 hover:text-sky-600 hover:scale-110 transition-all'
                                onClick={() => removeToppingFromPizza(pizzaId, topping)}
                              />
                            </div>
                          </TableCell>

                          <TableCell className="text-gray-600">${topping.price.toFixed(2)}</TableCell>
                          <TableCell className="font-semibold text-gray-900">
                            ${(topping.price * quantity).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  )
}

export default CartCard