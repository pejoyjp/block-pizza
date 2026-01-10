"use client";

import React from 'react'
import CartPayment from '@/components/payment/cart-payment';
import CartBill from '@/components/payment/cart-bill';
import useUserId from '@/hooks/userUserId';
import useUser from '@/hooks/useUser';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = 
loadStripe(`${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);

const Payment = () => {

    const {userId} = useUserId()
    console.log(userId);
    const {data} = useUser(userId)

    const user = data?.user
    console.log(user);
 
    return (
        <div className='flex gap-2 md:flex-row flex-col p-4'>
            
            <CartPayment/>
           
            <Elements stripe={stripePromise}>
                <CartBill user={user} />
            </Elements>
            
        </div>

    );
}

export default Payment













