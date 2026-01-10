"use client"
import React from 'react';
import { CircleCheckBig } from 'lucide-react';
import useSWR from 'swr'
import useUserId from '@/hooks/userUserId';

import { format} from 'date-fns'
import Link from 'next/link';

const PaymentSuccess = () => {
    const {userId} = useUserId()
    const {data,isLoading,error} =  useSWR(`lastestOrder${userId}`, async () => {
        const response = await fetch(`/api/orders/user/${userId}/latest`);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch latest order');
        }
        return result;
    })
    console.log('Payment Success Page Data:', { data, isLoading, error, userId });
    if(isLoading){
        return <p>
            Loading...
        </p>
    }

    if (!data?.latestOrder) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <p className="text-xl text-gray-700">No order found</p>
                <Link href={'/menu'} className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">
                    Continue Shopping
                </Link>
            </div>
        );
    }

  return (
    <div className="min-h-screen 00 flex flex-col justify-center items-center">
      <div className="p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-3xl font-bold text-green-500 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-700 mb-6">Thank you for your purchase. Your payment has been successfully processed.</p>
        <div className="flex justify-center items-center mb-6">
          <CircleCheckBig className="text-green-500 mr-2 h-12 w-12" />
          <p className="text-lg font-bold text-gray-700">Order ID: {data?.latestOrder.id}</p>
        </div>
        <div className="border-t border-gray-200 pt-4 pb-6">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <ul className="text-gray-700">
      
      
            <li className="flex items-center justify-between mb-2">
              <span>Shipping</span>
              <span>$5.00</span>
            </li>
            <li className="flex items-center justify-between mb-2">
              <span>Tax</span>
              <span>$0.00</span>
            </li>

            <li className="flex items-center justify-between mb-2">
              <span>Address</span>
              <span>{data?.latestOrder.delivery_address}</span>
            </li>

            <li className="flex items-center justify-between mb-2">
              <span>Total</span>
              <span className="font-bold">${data?.latestOrder.total_price}</span>
            </li>

            <li className="flex items-center justify-between mb-2">
              <span>Created At</span>
              <span className="font-bold">{ format(new Date(data?.latestOrder.createdAt), 'yyyy-MM-dd HH:mm:ss')}</span>
            </li>

          </ul>

        </div>
        <Link   href={'/menu'}
                className="mt-8 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out">
            Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
