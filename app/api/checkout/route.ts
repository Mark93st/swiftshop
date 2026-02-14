import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { CartItem } from '@/lib/definitions';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { items } = await req.json() as { items: CartItem[] };
    const userId = session?.user?.id;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Missing items' }, { status: 400 });
    }

    // Validate Stock
    const productIds = items.map((item) => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.id);
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.name}` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Sorry, ${item.name} is out of stock. Only ${product.stock} left.` 
        }, { status: 400 });
      }
    }

    // Prepare line items for Stripe
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe Checkout Session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        userId: userId || null,
        cartItems: JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity }))),
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error('[STRIPE_ERROR]', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
