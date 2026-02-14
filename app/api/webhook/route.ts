import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { env } from '@/lib/env';

const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      return new NextResponse('Webhook Error: Missing signature or secret', { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error: any) {
    console.error(`Webhook signature verification failed.`, error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  console.log('🔔 Webhook received! Event type:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('📦 Session metadata:', session.metadata);
    
    // Retrieve metadata
    const userId = session.metadata?.userId;
    const cartItemsJson = session.metadata?.cartItems;

    if (!cartItemsJson) {
      console.error('❌ Webhook Error: Missing cartItems in metadata');
      return new NextResponse('Webhook Error: Missing cartItems in metadata', { status: 400 });
    }

    const cartItems = JSON.parse(cartItemsJson) as { id: string; quantity: number }[];
    console.log('🛒 Parsed cart items:', cartItems);

    try {
      // Create the order in the database
      // We need to fetch product details to get the current price for "priceAtPurchase"
      // and to validate the products exist.
      
      const productIds = cartItems.map(item => item.id);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } }
      });
      console.log('🔍 Found products in DB:', products.length);

      // Calculate total amount from database prices to be secure
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of cartItems) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const quantity = item.quantity;
          const price = Number(product.price);
          totalAmount += price * quantity;

          orderItemsData.push({
            productId: product.id,
            quantity: quantity,
            priceAtPurchase: price
          });
        }
      }

      // Prepare the order data
      const orderData: any = {
        stripePaymentId: session.id,
        totalAmount: totalAmount,
        status: 'PAID',
        orderItems: {
          create: orderItemsData
        }
      };

      if (userId) {
        orderData.user = { connect: { id: userId } };
      }

      console.log('📝 Creating order and updating stock in DB...');
      
      // Use a transaction to ensure both order creation and stock updates succeed
      await prisma.$transaction(async (tx) => {
        // 1. Create the order
        const newOrder = await tx.order.create({
          data: orderData
        });

        // 2. Update stock for each product
        for (const item of cartItems) {
          await tx.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }

        console.log('✅ Order created and stock updated! ID:', newOrder.id);
      });

    } catch (error) {
      console.error('❌ Error creating order in webhook:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
