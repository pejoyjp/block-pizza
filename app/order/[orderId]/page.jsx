"use client";
import React from "react";
import useUserId from "@/hooks/userUserId";
import useSWR from "swr";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const OrderItem = () => {
  const { userId } = useUserId();
  const orderId = useSearchParams().get("orderId");
  const { data, isLoading } = useSWR(`Order${orderId}`, async () => {
    const response = await fetch(`/api/orders/${orderId}/pizzas`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch order pizzas');
    }
    return result;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4  min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen ">
      <h1 className="text-4xl font-bold text-center  mb-10">
        Order Receipt
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 ">
          Order ID: {data?.orderPizzas[0]?.order_id}
        </h2>
        <Separator  className="my-5"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data?.orderPizzas?.map((pizza) => (
            <div key={pizza.pizza_id} className="mb-6">
              
              <h3 className="text-xl font-bold mb-2 ">
                Pizza {pizza.pizza_id}
              </h3>
             
              <div className="flex items-center mb-2">
                <span className="font-bold mr-2">Size:</span>
                <span className="bg-rose-500 text-white px-2 py-1 rounded-full">
                   {  pizza.size === "M" ? "6 Inch" :
                      pizza.size === "L" ? "9 Inch" :
                      pizza.size === "XL" ? "12 Inch" : ""
                   }
                </span>
              </div>


              <div className="flex items-center mb-2">
                <span className="font-bold mr-2">Quantity:</span>
                <span className=" px-2 py-1 rounded-full">
                  {pizza.quantity}
                </span>
              </div>


              <p className="mb-2">
                <span className="font-bold">Price:</span> $
                <span className="text-2xl font-bold ">
                  {pizza.price}
                </span>
              </p>
              <h4 className="text-lg font-bold mb-2 ">
                Toppings:
              </h4>
              <ul className="list-disc pl-4 mb-4">
                {JSON.parse(pizza.toppings).map((topping) => (
                  topping.total_price !== 0 &&
                  <li key={topping.name} className="text-gray-600">
                    {topping.name} - ${topping.total_price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
          <p className="text-lg font-bold">
            Total:
            <span className="text-2xl font-bold  ml-2">
              $
              {data?.orderPizzas?.reduce(
                (total, pizza) => total + parseFloat(pizza.price),
                0
              )}
            </span>
          </p>
          <Link href={'/menu'}
                className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 font-bold">
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;