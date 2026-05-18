import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Package } from "lucide-react";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

interface OrderItem { id: string; name: string; price: number; image: string; quantity: number }
interface Order { id: string; total: number; status: string; created_at: string; items: OrderItem[] }

function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ full_name: "", phone: "", address: "", email: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (data) setProfile({ full_name: data.full_name ?? "", phone: data.phone ?? "", address: data.address ?? "", email: data.email ?? user.email ?? "" });
    });
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setOrders(data as unknown as Order[]);
    });
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name, phone: profile.phone, address: profile.address,
    }).eq("id", user.id);
    setSaving(false);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  };

  if (loading || !user) return <div className="container mx-auto py-20 text-center">Loading…</div>;

  return (
    <div className="container mx-auto px-4 py-6 md:py-10 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">My Account</h1>
        <button onClick={() => signOut().then(() => navigate({ to: "/" }))} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border border-border hover:bg-muted">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={save} className="bg-card border border-border rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-lg mb-2">Personal Info</h3>
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input disabled value={profile.email} className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-muted text-muted-foreground" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea rows={3} value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <button disabled={saving} className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-semibold disabled:opacity-60">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><Package className="w-5 h-5" /> Order History</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No orders yet.</p>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {orders.map((o) => (
                <div key={o.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>#{o.id.slice(0, 8)}</span>
                    <span>{new Date(o.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {(o.items as OrderItem[]).slice(0, 3).map((it) => (
                      <img key={it.id} src={it.image} alt="" className="w-10 h-10 rounded object-cover" />
                    ))}
                    {o.items.length > 3 && <span className="text-xs text-muted-foreground">+{o.items.length - 3}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-medium capitalize">{o.status}</span>
                    <span className="font-bold">₹{o.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg">Order Tracking</h3>
              <p className="text-sm text-muted-foreground">Tracking details and estimated delivery</p>
            </div>
            <span className="text-xs text-muted-foreground">Placeholder</span>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-muted p-4 border border-border">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tracking number</p>
              <p className="mt-2 text-lg font-semibold">#c8c3de09</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Estimated arrival</p>
                <p className="mt-2 text-xl font-semibold">Thu, May 23</p>
                <p className="text-sm text-muted-foreground">Arriving between 3:00 PM and 6:00 PM</p>
              </div>
              <div className="rounded-2xl border border-border p-4">
                <p className="text-sm text-muted-foreground">Shipping address</p>
                <p className="mt-2 font-semibold">{profile.address || "123 Main Street, City, Country"}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border p-4 bg-background">
              <p className="text-sm font-medium mb-3">Delivery progress</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Order confirmed</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-sm font-medium">Packaged at facility</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-border" />
                  <span className="text-sm text-muted-foreground">Out for delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}