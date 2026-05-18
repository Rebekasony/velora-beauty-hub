import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Search { redirect?: string }

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { toast.error(error); return; }
    toast.success("Welcome back!");
    navigate({ to: redirect ?? "/" });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to continue shopping</p>
        <form onSubmit={submit} className="space-y-4 mt-6">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-secondary hover:underline">Forgot?</Link>
            </div>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground py-3 rounded-full font-semibold disabled:opacity-60">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-center mt-5">
          New to VeloraCart? <Link to="/signup" className="text-secondary font-semibold hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}