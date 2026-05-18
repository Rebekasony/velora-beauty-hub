import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const slides = [
  {
    title: "Glow Season",
    subtitle: "Up to 50% off skincare bestsellers",
    cta: "Shop Skincare",
    href: "Skincare",
    bg: "from-[oklch(0.94_0.04_30)] to-[oklch(0.88_0.07_40)]",
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Lipstick Love",
    subtitle: "New velvet matte shades just dropped",
    cta: "Shop Makeup",
    href: "Makeup",
    bg: "from-[oklch(0.92_0.05_350)] to-[oklch(0.85_0.10_15)]",
    img: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Signature Scents",
    subtitle: "Fragrances under ₹2,000",
    cta: "Shop Fragrance",
    href: "Fragrance",
    bg: "from-[oklch(0.93_0.04_85)] to-[oklch(0.85_0.09_60)]",
    img: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
  },
];

function Carousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const slide = slides[i];
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${slide.bg} transition-all duration-500`}>
      <div className="grid md:grid-cols-2 gap-4 items-center min-h-[280px] md:min-h-[420px] p-6 md:p-12">
        <div className="space-y-4 md:space-y-6 z-10">
          <span className="inline-flex items-center gap-1.5 bg-card/80 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-primary">
            <Sparkles className="w-3.5 h-3.5" /> Featured
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">{slide.title}</h1>
          <p className="text-base md:text-lg text-primary/80">{slide.subtitle}</p>
          <Link
            to="/products"
            search={{ category: slide.href } as never}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition"
          >
            {slide.cta} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="hidden md:block relative">
          <img src={slide.img} alt={slide.title} className="rounded-2xl aspect-square object-cover w-full max-w-md ml-auto shadow-[var(--shadow-soft)]" />
        </div>
      </div>
      <button onClick={() => setI((p) => (p - 1 + slides.length) % slides.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition" aria-label="Previous">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => setI((p) => (p + 1) % slides.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center hover:bg-card transition" aria-label="Next">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-1.5 bg-primary/40"}`} />
        ))}
      </div>
    </div>
  );
}

function Section({ title, list, link }: { title: string; list: typeof products; link?: string }) {
  return (
    <section className="py-8 md:py-12">
      <div className="flex items-end justify-between mb-5 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        <Link to="/products" className="text-sm font-medium text-secondary hover:underline">
          {link ?? "View all"} →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {list.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

function HomePage() {
  const trending = products.filter((p) => p.trending);
  const bestSellers = products.filter((p) => p.bestSeller);
  const newArrivals = products.filter((p) => p.newArrival);
  const offers = products.filter((p) => p.originalPrice - p.price >= 400).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      <Carousel />

      {/* Trust strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { icon: Truck, label: "Free shipping over ₹999" },
          { icon: ShieldCheck, label: "100% authentic" },
          { icon: RotateCcw, label: "Easy 7-day returns" },
          { icon: Sparkles, label: "Trusted by 50k+ users" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
            <Icon className="w-5 h-5 text-secondary shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <section className="py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-5">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((c) => (
            <Link key={c} to="/products" search={{ category: c } as never} className="aspect-square bg-card border border-border rounded-xl flex flex-col items-center justify-center p-3 hover:shadow-[var(--shadow-soft)] hover:-translate-y-0.5 transition">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
                <span className="text-xl md:text-2xl">{c[0]}</span>
              </div>
              <span className="text-xs md:text-sm font-medium text-center">{c}</span>
            </Link>
          ))}
        </div>
      </section>

      <Section title="Trending Now" list={trending} />
      <Section title="Best Sellers" list={bestSellers} />
      <Section title="New Arrivals" list={newArrivals} />
      <Section title="Top Offers" list={offers} />
    </div>
  );
}