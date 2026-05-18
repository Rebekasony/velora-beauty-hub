import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/order-confirmation/$id")({ component: Page });

function Page() {
  const { id } = Route.useParams();
  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-[var(--shadow-card)]">
        <CheckCircle2 className="w-20 h-20 text-accent mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Thank you for your order!</h1>
        <p className="text-sm text-muted-foreground mt-2">Order ID</p>
        <p className="font-mono text-sm bg-muted rounded-lg px-3 py-2 mt-1 break-all">{id}</p>
        <p className="text-sm text-foreground/80 mt-4">We're packing your order and will email you tracking details shortly.</p>
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Link to="/profile" className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-full font-semibold">View Orders</Link>
          <Link to="/products" className="flex-1 border border-border py-2.5 rounded-full font-semibold">Keep Shopping</Link>
        </div>
      </div>
    </div>
  );
}