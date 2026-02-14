import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { FeaturedProductCard } from "@/components/FeaturedProductCard";
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  CreditCard,
  Star,
  ShoppingBag
} from "lucide-react";
import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";

export default async function Home() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      take: 3,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }),
    prisma.category.findMany({
      take: 6
    })
  ]);

  const categoryImages: Record<string, string> = {
    'clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop',
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1000&auto=format&fit=crop',
    'footwear': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    'accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    'home-living': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1000&auto=format&fit=crop',
    'beauty': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop',
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1">
        {/* Hero Section - Clean Light Version */}
        <section className="relative overflow-hidden bg-slate-50 border-b">
          <div className="container relative z-10 mx-auto px-4 py-24 sm:py-32 lg:py-40">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <FadeIn>
                <Badge variant="outline" className="mb-6 border-primary/20 text-primary px-4 py-1 text-sm font-bold bg-white shadow-sm">
                  NEW COLLECTION 2026
                </Badge>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl mb-8 leading-[1.1]">
                  Elevate Your <span className="text-primary">Lifestyle</span> <br />
                  With Modern Essentials
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="mx-auto max-w-2xl text-xl text-slate-600 mb-12 leading-relaxed">
                  Discover a curated world of premium quality products designed for the modern individual. 
                  Where style meets uncompromising functionality.
                </p>
              </FadeIn>
              <FadeIn delay={0.3} className="flex flex-wrap justify-center gap-6">
                <Button asChild size="lg" className="h-14 px-10 text-lg font-bold rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105">
                  <Link href="/products">Shop the Collection <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold rounded-full border-slate-200 bg-white hover:bg-slate-50 transition-all">
                  <Link href="/about">Our Philosophy</Link>
                </Button>
              </FadeIn>
            </div>
          </div>
          
          {/* Decorative background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20 pointer-events-none">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/30 blur-[120px]" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px]" />
          </div>
        </section>

        {/* Value Propositions */}
        <section className="bg-white py-16 border-b">
          <div className="container mx-auto px-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                  { icon: Truck, title: "Free Shipping", desc: "Global delivery on orders over $100" },
                  { icon: ShieldCheck, title: "Secure Checkout", desc: "Encrypted payment processing" },
                  { icon: RefreshCw, title: "Easy Returns", desc: "30-day hassle-free policy" },
                  { icon: Star, title: "Premium Quality", desc: "Hand-picked curated selection" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-4 group">
                    <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                       <item.icon className="h-8 w-8" />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                       <p className="text-sm text-slate-500 max-w-[200px] mx-auto">{item.desc}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Categories Grid - Visual Refresh */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
                  Curated Categories
                </h2>
                <p className="text-slate-500 text-lg">
                  Explore our meticulously organized collections.
                </p>
              </div>
              <Link href="/products" className="group flex items-center font-bold text-primary hover:text-primary/80 transition-colors">
                 Browse all <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {categories.map((cat, index) => (
                 <FadeIn key={cat.id} delay={index * 0.1}>
                   <Link 
                     href={`/products?category=${cat.slug}`}
                     className="group relative h-[400px] overflow-hidden rounded-3xl bg-slate-100 flex flex-col justify-end"
                   >
                      <Image 
                        src={categoryImages[cat.slug as string] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10" />
                      <div className="relative z-20 p-8">
                         <h3 className="text-3xl font-bold text-white mb-2">{cat.name}</h3>
                         <div className="flex items-center text-white/80 font-medium group-hover:text-white transition-colors">
                            <span>Explore collection</span>
                            <ArrowRight className="ml-2 h-4 w-4" />
                         </div>
                      </div>
                   </Link>
                 </FadeIn>
               ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-24 bg-slate-50 border-y">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">
                Our Best Sellers
              </h2>
              <p className="max-w-xl mx-auto text-slate-500 text-lg">
                The pieces our community is loving right now.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
              {featuredProducts.map((product, index) => (
                <FadeIn key={product.id} delay={index * 0.1}>
                  <FeaturedProductCard 
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    description={product.description}
                    imageUrl={product.imageUrl || undefined}
                    category={product.category?.name}
                    stock={product.stock}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter - Elegant Version */}
        <section className="container mx-auto px-4 py-24">
           <div className="relative rounded-[3rem] bg-slate-900 overflow-hidden py-24 px-8 text-center text-white">
              <div className="relative z-10 max-w-3xl mx-auto">
                 <ShoppingBag className="h-12 w-12 text-primary mx-auto mb-8" />
                 <h2 className="text-4xl sm:text-6xl font-extrabold mb-6">Stay in the Loop</h2>
                 <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
                    Subscribe to receive early access to new collections, exclusive drops, and insider-only offers.
                 </p>
                 <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      className="h-14 px-8 rounded-full bg-white/10 text-white border border-white/20 outline-none flex-1 focus:bg-white/20 focus:border-white/40 transition-all"
                      required
                    />
                    <Button size="lg" className="h-14 px-10 rounded-full font-bold">
                       Join Us
                    </Button>
                 </form>
              </div>
              {/* Background accent */}
              <div className="absolute top-0 left-0 w-full h-full -z-0 opacity-10">
                 <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-primary rounded-full blur-[150px]" />
              </div>
           </div>
        </section>
      </main>

      <footer className="border-t py-20 bg-white">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
              <div className="space-y-6">
                 <h3 className="font-bold text-2xl tracking-tight">SwiftShop</h3>
                 <p className="text-slate-500 text-sm leading-relaxed">
                    Premium quality modern essentials for your everyday life. 
                    Built on the foundations of quality, style, and durability.
                 </p>
              </div>
              <div>
                 <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Shop</h4>
                 <ul className="space-y-4 text-sm text-slate-500">
                    <li><Link href="/products" className="hover:text-primary transition-colors">All Products</Link></li>
                    <li><Link href="/products" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                    <li><Link href="/products" className="hover:text-primary transition-colors">Best Sellers</Link></li>
                    <li><Link href="/products?category=clothing" className="hover:text-primary transition-colors">Clothing</Link></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Support</h4>
                 <ul className="space-y-4 text-sm text-slate-500">
                    <li><Link href="/about" className="hover:text-primary transition-colors">Shipping Info</Link></li>
                    <li><Link href="/about" className="hover:text-primary transition-colors">Returns</Link></li>
                    <li><Link href="/about" className="hover:text-primary transition-colors">Contact Us</Link></li>
                    <li><Link href="/about" className="hover:text-primary transition-colors">FAQ</Link></li>
                 </ul>
              </div>
              <div>
                 <h4 className="font-bold mb-6 text-slate-900 uppercase tracking-widest text-xs">Legal</h4>
                 <ul className="space-y-4 text-sm text-slate-500">
                    <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                    <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                    <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                 </ul>
              </div>
           </div>
           <div className="pt-12 border-t flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-400 uppercase tracking-widest">
             <p>© 2026 SwiftShop Inc. All rights reserved.</p>
             <div className="flex gap-8">
                <Link href="#" className="hover:text-slate-900 transition-colors">Instagram</Link>
                <Link href="#" className="hover:text-slate-900 transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-slate-900 transition-colors">LinkedIn</Link>
             </div>
           </div>
        </div>
      </footer>
    </div>
  );
}