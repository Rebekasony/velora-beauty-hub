import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export const Route = createFileRoute("/wishlist")({ component: WishlistPage });

function WishlistPage() {
  const { items, remove } = useWishlist();
  const { add } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
        <p className="text-muted-foreground mb-6">Save products you love for later.</p>
        <Link to="/products" className="inline-block bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-semibold">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">My Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {items.map((p) => (
          <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden">
            <Link to="/product/$id" params={{ id: p.id }} className="block aspect-square bg-muted">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </Link>
            <div className="p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.brand}</p>
              <h3 className="font-medium text-sm line-clamp-2">{p.name}</h3>
              <p className="font-bold mt-1">₹{p.price}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { add(p); remove(p.id); toast.success("Moved to cart"); }}
                  className="flex-1 bg-primary text-primary-foreground rounded-lg py-2 text-xs font-medium flex items-center justify-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" /> To Cart
                </button>
                <button onClick={() => remove(p.id)} className="p-2 border border-border rounded-lg text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}