import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

function CheckoutPage() {
  const { user, loading } = useAuth();
  const { items, subtotal, deliveryFee, total, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", search: { redirect: "/checkout" } as never });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("full_name,phone,address").eq("id", user.id).single()
        .then(({ data }) => {
          if (data) setForm({ name: data.full_name ?? "", phone: data.phone ?? "", address: data.address ?? "" });
        });
    }
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.name || !form.phone || !form.address) { toast.error("Please fill all shipping details"); return; }
    if (items.length === 0) { toast.error("Cart is empty"); return; }
    setSubmitting(true);
    const { data, error } = await supabase.from("orders").insert({
      user_id: user.id,
      items: items.map((i) => ({ id: i.product.id, name: i.product.name, price: i.product.price, image: i.product.image, quantity: i.quantity })),
      subtotal, delivery_fee: deliveryFee, total,
      shipping_name: form.name, shipping_phone: form.phone, shipping_address: form.address,
    }).select("id").single();
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    setSuccess(true);
    clear();
    setTimeout(() => navigate({ to: "/order-confirmation/$id", params: { id: data!.id } }), 1500);
  };

  if (loading || !user) return <div className="container mx-auto py-20 text-center">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <form onSubmit={submit} className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-lg">Shipping Details</h3>
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <div>
            <label className="text-sm font-medium">Shipping Address</label>
            <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required rows={3} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <button type="submit" disabled={submitting} className="w-full bg-secondary text-secondary-foreground py-3 rounded-full font-semibold hover:opacity-90 disabled:opacity-60">
            {submitting ? "Processing…" : `Pay Now • ₹${total}`}
          </button>
        </form>

        <aside className="bg-card border border-border rounded-xl p-5 h-fit">
          <h3 className="font-bold mb-3">Order Summary</h3>
          <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
            {items.map((i) => (
              <div key={i.product.id} className="flex gap-2 text-sm">
                <img src={i.product.image} alt="" className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="truncate">{i.product.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {i.quantity}</p>
                </div>
                <p className="font-medium">₹{i.product.price * i.quantity}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 text-sm border-t border-border pt-3">
            <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span></div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-border"><span>Total</span><span>₹{total}</span></div>
          </div>
        </aside>
      </div>

      {success && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-8 max-w-sm text-center shadow-2xl animate-in fade-in zoom-in">
            <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-3" />
            <h2 className="text-xl font-bold">Order placed successfully!</h2>
            <p className="text-sm text-muted-foreground mt-2">Redirecting to confirmation…</p>
          </div>
        </div>
      )}
    </div>
  );
}