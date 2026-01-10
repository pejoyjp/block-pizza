"use client"
import React from 'react'
import PizzaCard from '../card/pizza-card'
import useSWR from 'swr'

const SpecialOffer = ({isCenter}) => {
    const {data:pizzas} = useSWR('popularPizzas', async () => {
        const response = await fetch('/api/pizzas?popular=true');
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch popular pizzas');
        }
        return result.data;
    })
    console.log(pizzas);
    return (
        <div className='flex justify-center items-center flex-col'>
            <p className={`text-center py-10 text-4xl font-bold`}>
                Special Offer
            </p>

            <div className={`flex flex-wrap justify-center  gap-6`}>
                {
                    pizzas?.map((pizza)=>(
                        <PizzaCard key={pizza.id}
                                pizza={pizza}
                        />
                    ))
                }
            </div>
          

        
        </div>
    )
}

export default SpecialOffer