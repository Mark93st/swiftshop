import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Leaf, 
  ShieldCheck, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Phone 
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To provide high-quality, modern essentials that blend seamlessly into your everyday life, without compromising on style or durability."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We are committed to ethical sourcing and reducing our environmental footprint by choosing sustainable materials whenever possible."
    },
    {
      icon: ShieldCheck,
      title: "Quality First",
      description: "Every product in our collection undergoes rigorous quality testing to ensure it meets our high standards for long-lasting performance."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-slate-900 py-20 sm:py-32 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-6 bg-primary hover:bg-primary border-none text-white px-4 py-1">Founded in 2026</Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6">Redefining Modern <br /> Essentials</h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg sm:text-xl">
            SwiftShop was born from a simple idea: that high-quality, beautifully designed essentials should be accessible to everyone, everywhere.
          </p>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.slate.800),transparent)] opacity-50" />
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-slate-900">The SwiftShop Story</h2>
                <div className="space-y-4 text-slate-600 leading-relaxed">
                  <p>
                    In early 2026, we noticed a gap in the market. Shopping for quality items had become a choice between overpriced luxury brands or low-quality, disposable goods.
                  </p>
                  <p>
                    We wanted something different. We wanted products that looked great, felt premium, and lasted for years, all while maintaining an honest price point.
                  </p>
                  <p>
                    Today, SwiftShop serves thousands of customers worldwide, providing a curated selection of clothing, electronics, and accessories that help people live their best, most stylish lives every single day.
                  </p>
                </div>
              </div>
              <div className="relative aspect-square rounded-3xl bg-slate-100 overflow-hidden border">
                 <img 
                   src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop" 
                   alt="Our Team" 
                   className="w-full h-full object-cover grayscale"
                 />
                 <div className="absolute inset-0 bg-primary/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">What Drives Us</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Our core values are at the heart of everything we do, from design to delivery.</p>
        </div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                  <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                    <value.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
           <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                 <div>
                    <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                    <p className="text-slate-400 mb-8">
                       Have a question about an order or just want to say hi? 
                       Our friendly support team is always ready to help.
                    </p>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <Mail className="h-5 w-5 text-primary" />
                          <span>support@swiftshop.com</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <Phone className="h-5 w-5 text-primary" />
                          <span>+1 (555) 123-4567</span>
                       </div>
                       <div className="flex items-center gap-4">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span>123 Commerce St, San Francisco, CA 94103</span>
                       </div>
                    </div>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                    <h3 className="text-xl font-bold mb-6">Send us a message</h3>
                    <form className="space-y-4">
                       <input 
                         type="text" 
                         placeholder="Your Name" 
                         className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary transition-colors"
                       />
                       <input 
                         type="email" 
                         placeholder="Your Email" 
                         className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary transition-colors"
                       />
                       <textarea 
                         placeholder="How can we help?" 
                         className="w-full min-h-[100px] p-4 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary transition-colors"
                       ></textarea>
                       <button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors">
                          Send Message
                       </button>
                    </form>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -translate-y-1/2 translate-x-1/2" />
           </div>
        </div>
      </section>
    </div>
  );
}
