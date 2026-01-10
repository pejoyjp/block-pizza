"use client"
import React from 'react'
import PizzaCard from '../card/pizza-card'
import useSWR from 'swr'

const AllOffers = () => {
    const {data:pizzas} = useSWR('allPizzas', async () => {
        const response = await fetch('/api/pizzas');
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch pizzas');
        }
        return result.data;
    })
    console.log(pizzas);
    

    return (
        <div>
            <p className='py-10 text-4xl font-bold text-center'>
                All Offers
            </p>

            <div className='flex flex-wrap gap-6 justify-center md:justify-start'>
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

export default AllOffers