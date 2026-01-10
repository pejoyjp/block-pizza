import Stripe from 'stripe';
import { NextResponse } from "next/server";

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`);

export async function POST(request) {
    try {
        const data = await request.json();
        const { amount } = data;
        
        if (!amount || isNaN(amount)) {
            return NextResponse.json(
                { error: "Invalid amount provided" },
                { status: 400 }
            );
        }
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100),
            currency: "USD",
            metadata: {
                integration_check: 'accept_a_payment'
            }
        });

        return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe payment intent creation error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}