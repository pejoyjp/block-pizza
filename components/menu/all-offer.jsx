"use client"
import React, { useState } from 'react'
import PizzaCard from '../card/pizza-card'
import useSWR from 'swr'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const AllOffers = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const {data:pizzas} = useSWR(`allPizzas-${currentPage}`, async () => {
        const response = await fetch(`/api/pizzas?page=${currentPage}&limit=${itemsPerPage}`);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch pizzas');
        }
        return result;
    })
    
    const totalPages = pizzas?.pagination?.totalPages || 1

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePageClick = (page) => {
        setCurrentPage(page)
    }

    return (
        <div>
            <p className='py-10 text-4xl font-bold text-center'>
                All Offers
            </p>

            <div className='flex flex-wrap gap-6 justify-center md:justify-start'>
                {
                    pizzas?.data?.map((pizza)=>(
                        <PizzaCard key={pizza.id}
                                pizza={pizza}
                        />
                    ))
                }
            </div>

            {totalPages > 1 && (
                <div className='flex justify-center items-center gap-2 mt-10 mb-6'>
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageClick(page)}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}

export default AllOffers