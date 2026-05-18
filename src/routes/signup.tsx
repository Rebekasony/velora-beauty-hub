import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/signup")({ component: SignupPage });

const schema = z.object({
  full_name: z.string().trim().min(2, "Name too short").max(80),
  email: z.string().trim().email("Invalid email"),
  phone: z.string().trim().min(7, "Invalid phone").max(20),
  address: z.string().trim().min(5, "Address too short").max(300),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", address: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await signUp(parsed.data);
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Account created! You're now signed in.");
    navigate({ to: "/" });
  };

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">Join VeloraCart in seconds</p>
        <form onSubmit={submit} className="space-y-3 mt-6">
          {[
            { k: "full_name", label: "Full Name", type: "text" },
            { k: "email", label: "Email", type: "email" },
            { k: "phone", label: "Phone Number", type: "tel" },
          ].map(({ k, label, type }) => (
            <div key={k}>
              <label className="text-sm font-medium">{label}</label>
              <input type={type} required value={form[k as keyof typeof form]} onChange={upd(k as keyof typeof form)}
                className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
            </div>
          ))}
          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea required value={form.address} onChange={upd("address")} rows={2}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" required value={form.password} onChange={upd("password")}
              className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground py-3 rounded-full font-semibold disabled:opacity-60 mt-2">
            {loading ? "Creating…" : "Create Account"}
          </button>
        </form>
        <p className="text-sm text-center mt-5">
          Already have an account? <Link to="/login" className="text-secondary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}