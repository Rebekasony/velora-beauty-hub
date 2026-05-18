import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { items, update, remove, subtotal, deliveryFee, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const checkout = () => {
    if (!user) navigate({ to: "/login", search: { redirect: "/checkout" } as never });
    else navigate({ to: "/checkout" });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Start shopping to fill it up.</p>
        <Link to="/products" className="inline-block bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-semibold">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Cart ({items.length})</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {items.map((i) => (
            <div key={i.product.id} className="flex gap-4 bg-card border border-border rounded-xl p-3 sm:p-4">
              <Link to="/product/$id" params={{ id: i.product.id }} className="w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                <SmartImage src={i.product.image} alt={i.product.name} className="w-full h-full object-cover rounded-lg" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{i.product.brand}</p>
                <Link to="/product/$id" params={{ id: i.product.id }}><h3 className="font-medium text-sm sm:text-base truncate">{i.product.name}</h3></Link>
                <p className="font-bold mt-1">₹{i.product.price}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-border rounded-full">
                    <button onClick={() => update(i.product.id, i.quantity - 1)} className="p-1.5"><Minus className="w-3.5 h-3.5" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{i.quantity}</span>
                    <button onClick={() => update(i.product.id, i.quantity + 1)} className="p-1.5"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                  <button onClick={() => remove(i.product.id)} className="text-destructive p-1.5" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-bold">₹{i.product.price * i.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-card border border-border rounded-xl p-5 h-fit lg:sticky lg:top-24">
          <h3 className="font-bold text-lg mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span>{deliveryFee === 0 ? <span className="text-accent font-medium">FREE</span> : `₹${deliveryFee}`}</span></div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-base"><span>Total</span><span>₹{total}</span></div>
          </div>
          <button onClick={checkout} className="w-full mt-5 bg-secondary text-secondary-foreground py-3 rounded-full font-semibold hover:opacity-90 transition">
            Proceed to Checkout
          </button>
          <p className="text-xs text-muted-foreground text-center mt-3">Free shipping on orders over ₹999</p>
        </aside>
      </div>
    </div>
  );
}