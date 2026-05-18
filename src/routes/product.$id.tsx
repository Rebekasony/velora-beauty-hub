import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, Star, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { getProduct, similarProducts } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
  notFoundComponent: () => <div className="container mx-auto py-20 text-center">Product not found.</div>,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const product = getProduct(id);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const navigate = useNavigate();

  if (!product) {
    return <div className="container mx-auto py-20 text-center">Product not found. <Link to="/products" className="text-secondary underline">Back to products</Link></div>;
  }

  const gallery = product.images ?? [product.image, product.image, product.image];
  const similar = similarProducts(product.id, product.category);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <nav className="text-xs text-muted-foreground mb-4">
        <Link to="/">Home</Link> / <Link to="/products">Products</Link> / <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="aspect-square bg-card rounded-2xl overflow-hidden border border-border">
            <img src={gallery[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 mt-3">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${activeImg === i ? "border-secondary" : "border-border"}`}>
                <img src={g} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wider text-muted-foreground font-medium">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold mt-1">{product.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-0.5 bg-accent text-accent-foreground px-2 py-0.5 rounded text-sm font-semibold">
              {product.rating} <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-sm text-muted-foreground">• {product.category}</span>
          </div>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-bold">₹{product.price}</span>
            <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
            {discount > 0 && <span className="text-accent font-semibold">{discount}% OFF</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>

          <p className="mt-5 text-foreground/80 leading-relaxed">{product.description}</p>

          {product.ingredients && (
            <div className="mt-4 bg-muted rounded-lg p-3">
              <p className="text-xs uppercase font-semibold text-muted-foreground tracking-wider mb-1">Key Ingredients</p>
              <p className="text-sm">{product.ingredients}</p>
            </div>
          )}

          <div className="flex items-center gap-4 mt-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border border-border rounded-full">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2"><Minus className="w-4 h-4" /></button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2"><Plus className="w-4 h-4" /></button>
            </div>
            <span className="text-xs text-accent font-medium">{product.stock} in stock</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => { add(product, qty); toast.success("Added to cart"); }}
              className="flex items-center justify-center gap-2 bg-card border-2 border-primary text-primary py-3 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <button
              onClick={() => { add(product, qty); navigate({ to: "/checkout" }); }}
              className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-3 rounded-full font-semibold hover:opacity-90 transition"
            >
              Buy Now
            </button>
          </div>
          <button
            onClick={() => { toggle(product); toast.success(has(product.id) ? "Removed from wishlist" : "Added to wishlist"); }}
            className="flex items-center gap-2 mt-3 text-sm text-foreground/70 hover:text-secondary"
          >
            <Heart className={`w-4 h-4 ${has(product.id) ? "fill-secondary text-secondary" : ""}`} /> {has(product.id) ? "In wishlist" : "Add to wishlist"}
          </button>

          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-sm"><Truck className="w-5 h-5 text-secondary" /> Free over ₹999</div>
            <div className="flex items-center gap-2 text-sm"><ShieldCheck className="w-5 h-5 text-secondary" /> 100% authentic</div>
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-5">Similar Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {similar.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}