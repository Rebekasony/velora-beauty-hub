import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({ component: Page });

function Page() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/" });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <form onSubmit={submit} className="space-y-4 mt-6">
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password"
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-secondary" />
          <button disabled={loading} className="w-full bg-secondary text-secondary-foreground py-3 rounded-full font-semibold disabled:opacity-60">
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}