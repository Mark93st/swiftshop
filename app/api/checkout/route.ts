import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { CartItem } from '@/lib/definitions';
import { logError } from '@/lib/logger';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const session = await auth();
    const { items } = await req.json() as { items: CartItem[] };
    const userId = session?.user?.id;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Missing items' }, { status: 400 });
    }

    // Validate Stock and reserve items using a transaction
    const productIds = items.map((item) => item.id);
    
    const reservationResult = await prisma.$transaction(async (tx) => {
      const dbProducts = await tx.product.findMany({
        where: { id: { in: productIds } }
      });

      for (const item of items) {
        const product = dbProducts.find((p) => p.id === item.id);
        if (!product) {
          throw new Error(`Product not found: ${item.name}`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Sorry, ${item.name} is out of stock. Only ${product.stock} left.`);
        }
      }

      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: {
            stock: { decrement: item.quantity },
            reservedStock: { increment: item.quantity }
          }
        });
      }
      return true;
    }).catch(error => {
      return { error: error.message };
    });

    if (typeof reservationResult === 'object' && reservationResult.error) {
      return NextResponse.json({ error: reservationResult.error }, { status: 400 });
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
    let stripeSession;
    try {
      stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expires in 30 minutes
        success_url: `${env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/cart`,
        metadata: {
          userId: userId || null,
          cartItems: JSON.stringify(items.map((i) => ({ id: i.id, quantity: i.quantity }))),
        },
      });
    } catch (stripeError) {
      // If Stripe session creation fails, rollback the stock reservation
      await prisma.$transaction(async (tx) => {
        for (const item of items) {
          await tx.product.update({
            where: { id: item.id },
            data: {
              stock: { increment: item.quantity },
              reservedStock: { decrement: item.quantity }
            }
          });
        }
      });
      throw stripeError;
    }

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    await logError(error, 'CHECKOUT_API');
    console.error('[STRIPE_ERROR]', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
