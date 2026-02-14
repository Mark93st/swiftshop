'use client';

import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        console.error('Stripe Error:', data.error);
        alert(`Checkout Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An unexpected error occurred during checkout.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-12 mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-slate-900">Your Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border shadow-sm">
            <div className="bg-slate-100 p-6 rounded-full mb-6">
               <ShoppingBag className="h-12 w-12 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8 text-center max-w-md">
              Looks like you haven&apos;t added anything to your cart yet. 
              Explore our products and find something you love!
            </p>
            <Button asChild size="lg">
               <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white p-4 rounded-xl border shadow-sm items-center">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-slate-50 relative">
                    <Image
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-semibold text-slate-900">
                      <h3>{item.name}</h3>
                      <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="mt-4 flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border rounded-md overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 font-medium text-red-600 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal ({totalItems()} items)</span>
                    <span>${totalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Taxes</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between text-lg font-bold text-slate-900">
                    <span>Total</span>
                    <span>${totalPrice().toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full h-12 text-base font-bold gap-2 rounded-xl group" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Proceed to Checkout"}
                  {!isLoading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />}
                </Button>
                <div className="mt-6 flex items-center justify-center gap-2">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5 opacity-50 grayscale" />
                   <span className="text-xs text-slate-400">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
