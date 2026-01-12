"use client";
import React from "react";
import useUserId from "@/hooks/userUserId";
import useSWR from "swr";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Clock, MapPin, Phone, Package } from "lucide-react";

const OrderItem = ({ params }) => {
  const { userId } = useUserId();
  const orderId = params.orderId;
  
  const { data: orderData, isLoading } = useSWR(`Order${orderId}`, async () => {
    const response = await fetch(`/api/orders/${orderId}?userId=${userId}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch order details');
    }
    return result;
  });

  const { data: pizzasData } = useSWR(`OrderPizzas${orderId}`, async () => {
    const response = await fetch(`/api/orders/${orderId}/pizzas`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch order pizzas');
    }
    return result;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-rose-500"></div>
      </div>
    );
  }

  const order = orderData?.order;
  const pizzas = pizzasData?.orderPizzas || [];

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-xl text-gray-700">Order not found</p>
        <Link href={'/menu'} className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const totalPrice = pizzas.reduce((total, pizza) => {
    const pizzaPrice = parseFloat(pizza.price) || 0;
    const toppingsPrice = pizza.toppings && Array.isArray(pizza.toppings) 
      ? pizza.toppings.reduce((sum, topping) => sum + (parseFloat(topping.total_price) || 0), 0)
      : 0;
    return total + (pizzaPrice + toppingsPrice) * (pizza.quantity || 1);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Order Receipt</h1>
          <p className="text-gray-600">Order ID: {orderId}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-6 w-6 text-rose-500" />
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="font-semibold">{order.delivery_address || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Contact Phone</p>
                  <p className="font-semibold">{order.contact_phone || 'N/A'}</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-semibold">{order.payment_method || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  order.payment_status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.payment_status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Method</p>
                <p className="font-semibold">{order.delivery_method || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>{pizzas.length} {pizzas.length === 1 ? 'item' : 'items'} in your order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pizzas.map((pizza, index) => (
                <Card key={`${pizza.pizza_id}-${index}`} className="border">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {pizza.pizzaDetails && (
                        <div className="flex gap-4">
                          {pizza.pizzaDetails.img && (
                            <img
                              src={pizza.pizzaDetails.img}
                              alt={pizza.pizzaDetails.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{pizza.pizzaDetails.name}</h3>
                            {pizza.pizzaDetails.description && (
                              <p className="text-sm text-gray-500 mt-1">{pizza.pizzaDetails.description}</p>
                            )}
                            {pizza.pizzaDetails.veg !== undefined && (
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-2 ${
                                pizza.pizzaDetails.veg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {pizza.pizzaDetails.veg ? 'Vegetarian' : 'Non-Vegetarian'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-500 text-white">
                          {pizza.size === "M" ? "6 Inch" :
                           pizza.size === "L" ? "9 Inch" :
                           pizza.size === "XL" ? "12 Inch" : pizza.size}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                          Qty: {pizza.quantity}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Price</span>
                        <span className="text-2xl font-bold text-gray-900">${pizza.price}</span>
                      </div>

                      {pizza.toppings && Array.isArray(pizza.toppings) && pizza.toppings.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Toppings</h4>
                          <ul className="space-y-1">
                            {pizza.toppings.map((topping, idx) => (
                              topping.total_price !== 0 && (
                                <li key={idx} className="flex justify-between text-sm text-gray-600">
                                  <span>{topping.name}</span>
                                  <span>${topping.total_price}</span>
                                </li>
                              )
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">${totalPrice.toFixed(2)}</p>
              </div>
              <Link href="/menu">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  Order Again
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderItem;