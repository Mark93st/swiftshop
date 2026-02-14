'use client';

import { useEffect, useState } from 'react';
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ShoppingBag, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(!!sessionId);

  useEffect(() => {
    // Clear the cart when the user reaches the success page
    clearCart();

    if (sessionId) {
      fetch(`/api/orders/by-session/${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.orderId) {
            setOrderId(data.orderId);
          }
        })
        .catch(err => console.error("Error fetching order:", err))
        .finally(() => setLoading(false));
    }
  }, [clearCart, sessionId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-20 mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border shadow-xl overflow-hidden">
          <div className="bg-primary py-12 flex justify-center">
            <div className="bg-white/20 p-4 rounded-full">
               <CheckCircle2 className="h-16 w-16 text-white" />
            </div>
          </div>
          <div className="p-8 sm:p-12 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Order Confirmed!</h1>
            <p className="text-slate-600 mb-8 text-lg">
              Thank you for your purchase. We&apos;ve received your order and are getting it ready for shipment. 
              You&apos;ll receive a confirmation email shortly.
            </p>
            
            {loading ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : orderId ? (
              <div className="bg-primary/5 rounded-2xl p-6 mb-10 border border-primary/10">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-sm font-semibold text-primary uppercase tracking-wider">Order ID</p>
                    <p className="text-lg font-bold text-slate-900">#{orderId.slice(0, 8)}</p>
                  </div>
                  <Button asChild variant="default" className="gap-2">
                    <Link href={`/orders/${orderId}`}>
                      <FileText className="h-4 w-4" />
                      View Order Details
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="bg-slate-50 rounded-2xl p-6 mb-10 text-left">
              <h2 className="font-semibold text-slate-900 mb-2">What&apos;s next?</h2>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                   <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">1</div>
                   <span>Check your email for the order receipt and details.</span>
                </li>
                <li className="flex gap-2">
                   <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">2</div>
                   <span>We&apos;ll notify you once your items have been shipped.</span>
                </li>
                <li className="flex gap-2">
                   <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">3</div>
                   <span>Most orders arrive within 3-5 business days.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-xl px-8 h-12">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-8 h-12">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
