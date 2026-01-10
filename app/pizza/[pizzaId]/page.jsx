"use client"
import React from 'react'
import useSWR from 'swr'

import { useParams } from 'next/navigation';
import useCart from '@/hooks/useCart';
import { useState,useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import SpecialOffer from '@/components/menu/special-offer';

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
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');
  const [newPizza, setNewPizza] = useState();
  const pizza = data?.data;
  console.log(pizza);

  const handleAddItem = () => {
    addItem(newPizza);
    toast.success('Added successfully');
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    if (!pizza) return;
    const pizzaSizes = typeof pizza.sizeandcrust === 'string' ? JSON.parse(pizza.sizeandcrust) : pizza.sizeandcrust;
    const initialSizeData = pizzaSizes[selectedSize];
    setNewPizza({ ...pizza, sizeandcrust: selectedSize, price: initialSizeData.price });
  }, [pizza, selectedSize]);

  if (isLoading) return <div>Loading...</div>;
  if (!pizza) return <div>Pizza not found</div>;
  
  console.log(pizza);
  const jsonPizza = typeof pizza.sizeandcrust === 'string' ? JSON.parse(pizza.sizeandcrust) : pizza.sizeandcrust;

  return (
    <div>
      <div className='flex flex-wrap gap-4 p-4'>
        <div>
          <img src={pizza.img} className="object-cover rounded-md" alt={pizza.name} />
        </div>

        <div className='space-y-3'>
          <p className='text-2xl'>
            {pizza.name}
          </p>

          <p className="font-bold text-2xl">
            Price: ${parseFloat(jsonPizza[selectedSize].price).toFixed(2)}
          </p>

          <div className=' space-y-10'>
            <p className=' text-gray-700 text-sm'>
              {pizza.description}
            </p>
      
            <div className="flex gap-3">
              {Object.keys(jsonPizza).map((size) => (
                <Button
                  size="lg"
                  key={size}
                  variant={selectedSize === size ? '' : 'outline'}
                  onClick={() => handleSizeChange(size)}
                >
                    {  size === "M" ? "6 Inch" :
                        size === "L" ? "9 Inch" :
                        size === "XL" ? "12 Inch" : ""
                    }
                </Button>
              ))}
            </div>
            
        
            <Button variant="outline" size="lg" onClick={handleAddItem}>
              Order Now
            </Button>
        
            
          </div>
        </div>
      </div>

      
      <SpecialOffer/>
    


    </div>
   
  );
};

export default PizzaPage;