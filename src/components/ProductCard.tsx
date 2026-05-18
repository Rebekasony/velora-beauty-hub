import { Link } from "@tanstack/react-router";
import { Heart, Star, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "sonner";
import { SmartImage } from "@/components/SmartImage";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const { toggle, has } = useWishlist();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const inWishlist = has(product.id);

  return (
    <div className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-[var(--shadow-soft)] transition-all duration-300 flex flex-col">
      <Link to="/product/$id" params={{ id: product.id }} className="relative block aspect-square overflow-hidden bg-muted">
        <SmartImage
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product); toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist"); }}
          className="absolute top-2 right-2 bg-card/90 backdrop-blur w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition"
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-secondary text-secondary" : "text-foreground"}`} />
        </button>
      </Link>

      <div className="p-3 sm:p-4 flex flex-col flex-1">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{product.brand}</p>
        <Link to="/product/$id" params={{ id: product.id }} className="mt-0.5">
          <h3 className="font-medium text-sm sm:text-[15px] text-foreground line-clamp-2 hover:text-secondary transition">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center gap-0.5 bg-accent text-accent-foreground px-1.5 py-0.5 rounded text-[11px] font-semibold">
            {product.rating} <Star className="w-2.5 h-2.5 fill-current" />
          </div>
          <span className="text-xs text-muted-foreground">• {product.category}</span>
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-bold text-foreground">₹{product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through">₹{product.originalPrice}</span>
          )}
        </div>
        <button
          onClick={() => { add(product); toast.success("Added to cart"); }}
          className="mt-3 w-full bg-primary text-primary-foreground rounded-lg py-2 text-sm font-medium hover:bg-primary/90 transition flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}