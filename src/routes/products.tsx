import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Grid3x3, List, SlidersHorizontal, X, Star } from "lucide-react";
import { products, categories, brands, type Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

interface Search { category?: string; q?: string }

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: typeof s.category === "string" ? s.category : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { category: initCat, q } = Route.useSearch();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [cats, setCats] = useState<string[]>(initCat ? [initCat] : []);
  const [selectedBrands, setBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(3500);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popularity");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let r = [...products];
    if (cats.length) r = r.filter((p) => cats.includes(p.category));
    if (selectedBrands.length) r = r.filter((p) => selectedBrands.includes(p.brand));
    r = r.filter((p) => p.price <= maxPrice && p.rating >= minRating);
    if (q) r = r.filter((p) => (p.name + p.brand + p.category).toLowerCase().includes(q.toLowerCase()));
    if (sort === "low") r.sort((a, b) => a.price - b.price);
    else if (sort === "high") r.sort((a, b) => b.price - a.price);
    else if (sort === "new") r = r.filter((p) => p.newArrival).concat(r.filter((p) => !p.newArrival));
    else r.sort((a, b) => b.rating - a.rating);
    return r;
  }, [cats, selectedBrands, maxPrice, minRating, q, sort]);

  const toggle = (arr: string[], v: string, fn: (a: string[]) => void) =>
    fn(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const Filters = (
    <aside className="space-y-6 text-sm">
      <div>
        <h4 className="font-semibold mb-2">Category</h4>
        {categories.map((c) => (
          <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="checkbox" checked={cats.includes(c)} onChange={() => toggle(cats, c, setCats)} className="accent-secondary" />
            {c}
          </label>
        ))}
      </div>
      <div>
        <h4 className="font-semibold mb-2">Brand</h4>
        {brands.map((b) => (
          <label key={b} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggle(selectedBrands, b, setBrands)} className="accent-secondary" />
            {b}
          </label>
        ))}
      </div>
      <div>
        <h4 className="font-semibold mb-2">Max Price: ₹{maxPrice}</h4>
        <input type="range" min={300} max={3500} step={100} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-secondary" />
      </div>
      <div>
        <h4 className="font-semibold mb-2">Min Rating</h4>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={`px-3 py-1 rounded-full border text-xs ${minRating === r ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>
              {r === 0 ? "All" : `${r}+`}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => { setCats([]); setBrands([]); setMaxPrice(3500); setMinRating(0); }} className="text-secondary font-medium">Clear all filters</button>
    </aside>
  );

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{q ? `Results for "${q}"` : cats.length === 1 ? cats[0] : "All Products"}</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} products</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-full border border-border text-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 rounded-full border border-border text-sm bg-card outline-none">
            <option value="popularity">Popularity</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="new">New Arrivals</option>
          </select>
          <div className="hidden md:flex border border-border rounded-full overflow-hidden">
            <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-primary text-primary-foreground" : ""}`}><Grid3x3 className="w-4 h-4" /></button>
            <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-primary text-primary-foreground" : ""}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        <div className="hidden lg:block">{Filters}</div>

        {showFilters && (
          <div className="fixed inset-0 z-50 bg-foreground/40 lg:hidden" onClick={() => setShowFilters(false)}>
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-background p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>
              {Filters}
            </div>
          </div>
        )}

        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No products match your filters.</div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <ListView items={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}

function ListView({ items }: { items: Product[] }) {
  const { add } = useCart();
  return (
    <div className="space-y-3">
      {items.map((p) => (
        <div key={p.id} className="flex gap-4 bg-card border border-border rounded-xl p-3 hover:shadow-[var(--shadow-card)]">
          <Link to="/product/$id" params={{ id: p.id }} className="w-24 h-24 sm:w-32 sm:h-32 shrink-0">
            <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded-lg" />
          </Link>
          <div className="flex-1 flex flex-col">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.brand}</p>
            <Link to="/product/$id" params={{ id: p.id }}><h3 className="font-medium hover:text-secondary">{p.name}</h3></Link>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
            <div className="flex items-center gap-2 mt-auto">
              <div className="flex items-center gap-0.5 bg-accent text-accent-foreground px-1.5 py-0.5 rounded text-xs font-semibold">{p.rating}<Star className="w-3 h-3 fill-current" /></div>
              <span className="font-bold">₹{p.price}</span>
              <span className="text-xs text-muted-foreground line-through">₹{p.originalPrice}</span>
              <button onClick={() => { add(p); toast.success("Added to cart"); }} className="ml-auto bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">Add</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}