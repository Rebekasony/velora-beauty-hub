import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({ component: Page });

function Page() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) { toast.error(error); return; }
    setSent(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-card)]">
        <h1 className="text-2xl font-bold">Reset password</h1>
        {sent ? (
          <p className="text-sm text-muted-foreground mt-3">If an account exists for {email}, you'll receive an email with reset instructions.</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a reset link.</p>
            <form onSubmit={submit} className="space-y-4 mt-6">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
              <button disabled={loading} className="w-full bg-secondary text-secondary-foreground py-3 rounded-full font-semibold disabled:opacity-60">
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
        <p className="text-sm text-center mt-5"><Link to="/login" className="text-secondary hover:underline">Back to login</Link></p>
      </div>
    </div>
  );
}