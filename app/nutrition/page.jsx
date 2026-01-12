"use client"
import React, { useState } from 'react'
import useSWR from 'swr'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Flame, Wheat, Droplet, Minus, Leaf, UtensilsCrossed, Candy } from 'lucide-react'

const Nutrition = () => {
    const [searchTerm, setSearchTerm] = useState('')

    const { data: pizzas } = useSWR('allPizzas-nutrition', async () => {
        const response = await fetch('/api/pizzas');
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch pizzas');
        }
        return result;
    })

    const filteredPizzas = pizzas?.data?.filter(pizza =>
        pizza.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="bg-green-100 p-4 rounded-full">
                            <Flame className="h-12 w-12 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Nutrition Information
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Explore the nutritional details of our delicious pizzas. Make informed choices about your meals.
                    </p>
                </div>

                <div className="mb-8 max-w-md mx-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Search pizzas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPizzas.map((pizza) => (
                        <Card key={pizza.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{pizza.name}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {pizza.description || 'Delicious pizza with premium ingredients'}
                                        </CardDescription>
                                    </div>
                                    {pizza.veg !== undefined && (
                                        <Badge className={pizza.veg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                                            {pizza.veg ? 'Vegetarian' : 'Non-Vegetarian'}
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {pizza.img && (
                                    <img
                                        src={pizza.img}
                                        alt={pizza.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}

                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Flame className="h-5 w-5 text-orange-600" />
                                                <span className="text-sm text-gray-600">Calories</span>
                                            </div>
                                            <span className="text-2xl font-bold text-orange-600">
                                                {pizza.nutrition?.calories || 0}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Per {pizza.nutrition?.serving_size || '1 slice'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                                            <Wheat className="h-4 w-4 text-blue-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Protein</p>
                                                <p className="font-semibold text-blue-600">
                                                    {pizza.nutrition?.protein || 0}g
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                                            <Minus className="h-4 w-4 text-yellow-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Carbs</p>
                                                <p className="font-semibold text-yellow-600">
                                                    {pizza.nutrition?.carbohydrates || 0}g
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                                            <Droplet className="h-4 w-4 text-purple-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Fat</p>
                                                <p className="font-semibold text-purple-600">
                                                    {pizza.nutrition?.fat || 0}g
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                            <Leaf className="h-4 w-4 text-green-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Fiber</p>
                                                <p className="font-semibold text-green-600">
                                                    {pizza.nutrition?.fiber || 0}g
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                                            <UtensilsCrossed className="h-4 w-4 text-red-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Sodium</p>
                                                <p className="font-semibold text-red-600">
                                                    {pizza.nutrition?.sodium || 0}mg
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-lg">
                                            <Candy className="h-4 w-4 text-pink-600" />
                                            <div>
                                                <p className="text-xs text-gray-500">Sugar</p>
                                                <p className="font-semibold text-pink-600">
                                                    {pizza.nutrition?.sugar || 0}g
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredPizzas.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No pizzas found matching your search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Nutrition