"use client"
import React from 'react'
import useSWR from 'swr'

import { useParams } from 'next/navigation';
import useCart from '@/hooks/useCart';
import { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { CirclePlus, CircleMinus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const PizzaPage = () => {
  const { pizzaId } = useParams();
  const { data, isLoading } = useSWR(pizzaId, async () => {
    const response = await fetch(`/api/pizzas/${pizzaId}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch pizza');
    }
    return result;
  });
  const { addItem, initializeToppingToPizza, addToppingToPizza, removeToppingFromPizza } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [newPizza, setNewPizza] = useState();
  const [selectedToppings, setSelectedToppings] = useState([]);
  const pizza = data?.data;

  const { data: toppingsData, isLoading: toppingsLoading } = useSWR(
    pizzaId ? `toppings-${pizzaId}` : null,
    async () => {
      if (!pizzaId) return null;
      const response = await fetch(`/api/pizzas/${pizzaId}/toppings`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch toppings');
      }
      return result;
    }
  );

  useEffect(() => {
    if (!pizza) return;
    const pizzaSizes = typeof pizza.sizeandcrust === 'string' ? JSON.parse(pizza.sizeandcrust) : pizza.sizeandcrust;
    const initialSizeData = pizzaSizes[selectedSize];
    setNewPizza({ ...pizza, sizeandcrust: selectedSize, price: initialSizeData.price, toppings: selectedToppings });
  }, [pizza, selectedSize]);

  useEffect(() => {
    if (!toppingsLoading && toppingsData && toppingsData.data) {
      const initialToppings = toppingsData.data.map(topping => ({
        ...topping,
        quantity: 0
      }));
      setSelectedToppings(initialToppings);
    }
  }, [toppingsLoading, toppingsData]);

  const handleAddItem = () => {
    const pizzaToAdd = {
      ...newPizza,
      toppings: selectedToppings.filter(t => t.quantity > 0),
      id: pizzaId
    };
    addItem(pizzaToAdd);
    toast.success('Added successfully');
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleToppingChange = (topping, delta) => {
    setSelectedToppings(prev => prev.map(t => {
      if (t.name === topping.name) {
        return { ...t, quantity: Math.max(0, t.quantity + delta) };
      }
      return t;
    }));
  };

  const getToppingTotal = () => {
    return selectedToppings.reduce((acc, t) => acc + (t.price || 0) * t.quantity, 0);
  };

  if (isLoading || toppingsLoading) return <div>Loading...</div>;
  if (!pizza) return <div>Pizza not found</div>;
  
  const jsonPizza = typeof pizza.sizeandcrust === 'string' ? JSON.parse(pizza.sizeandcrust) : pizza.sizeandcrust;
  
  const sizeLabels = {
    "M": "6 Inch",
    "L": "9 Inch",
    "XL": "12 Inch"
  };

  const basePrice = parseFloat(jsonPizza[selectedSize].price) || 0;
  const toppingTotal = getToppingTotal();
  const totalPrice = basePrice + toppingTotal;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-1/2 h-64 md:h-[500px] bg-gray-100">
              <Image
                src={pizza.img}
                alt={pizza.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {pizza.popular && (
                <Badge className="absolute top-4 left-4" variant="secondary">
                  Popular
                </Badge>
              )}
            </div>
            
            <CardContent className="p-6 md:p-8 w-full md:w-1/2">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {pizza.name}
                </CardTitle>
                <CardDescription className="mt-2 text-base text-gray-600">
                  {pizza.description}
                </CardDescription>
              </CardHeader>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Base Price</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${basePrice.toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium text-gray-500">Select Size</span>
                  <div className="flex gap-2">
                    {Object.keys(jsonPizza).map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="lg"
                        className="flex-1"
                        onClick={() => handleSizeChange(size)}
                      >
                        {sizeLabels[size] || size}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="toppings">
                  <AccordionTrigger className="text-base font-medium">
                    Customize Toppings
                  </AccordionTrigger>
                  <AccordionContent>
                    {toppingsData?.data && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {toppingsData.data.map((topping, index) => {
                            const currentTopping = selectedToppings.find(t => t.name === topping.name);
                            const quantity = currentTopping?.quantity || 0;
                            
                            return (
                              <TableRow key={index} className="group relative">
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <span 
                                      className={`cursor-help border-b-2 ${topping.description ? 'border-dotted border-gray-400 hover:border-orange-500' : 'border-transparent'}`}
                                      onMouseEnter={(e) => {
                                        if (topping.description) {
                                          const rect = e.target.getBoundingClientRect();
                                          const tooltip = document.getElementById(`tooltip-${index}`);
                                          if (tooltip) {
                                            tooltip.style.left = `${rect.left}px`;
                                            tooltip.style.top = `${rect.top - 10}px`;
                                            tooltip.classList.remove('hidden');
                                          }
                                        }
                                      }}
                                      onMouseLeave={() => {
                                        const tooltip = document.getElementById(`tooltip-${index}`);
                                        if (tooltip) {
                                          tooltip.classList.add('hidden');
                                        }
                                      }}
                                    >
                                      {topping.name}
                                    </span>
                                    {topping.description && (
                                      <div 
                                        id={`tooltip-${index}`}
                                        className="hidden fixed z-[9999] w-64 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl pointer-events-none"
                                      >
                                        <div className="font-medium mb-1">{topping.name}</div>
                                        <div className="text-gray-300 text-xs">{topping.description}</div>
                                        <div className="absolute bottom-[-6px] left-4 border-4 border-transparent border-b-gray-900"></div>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className={`px-2 py-0.5 rounded text-xs text-white whitespace-nowrap ${topping.isVeg ? 'bg-green-600' : 'bg-red-600'}`}>
                                    {topping.isVeg ? 'Veg' : 'Non-Veg'}
                                  </span>
                                </TableCell>
                                <TableCell>${topping.price}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <CircleMinus
                                      size={18}
                                      className={`cursor-pointer transition-colors ${quantity === 0 ? 'text-gray-300' : 'text-gray-600 hover:text-orange-600'}`}
                                      onClick={() => quantity > 0 && handleToppingChange(topping, -1)}
                                    />
                                    <span className="w-6 text-center font-medium">{quantity}</span>
                                    <CirclePlus
                                      size={18}
                                      className="cursor-pointer text-gray-600 hover:text-orange-600 transition-colors"
                                      onClick={() => handleToppingChange(topping, 1)}
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {toppingTotal > 0 && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Toppings Total:</span>
                    <span className="font-medium text-orange-600">+${toppingTotal.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Separator className="my-4" />

              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-900">Total Price</span>
                <span className="text-2xl font-bold text-orange-600">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              
              <CardFooter className="p-0">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={handleAddItem}
                >
                  Add to Cart
                </Button>
              </CardFooter>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PizzaPage;
