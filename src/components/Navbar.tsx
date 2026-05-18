import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Heart, User, Search, Menu, LogOut, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { categories } from "@/data/products";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { q } as never });
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-16">
            <div className="flex items-center gap-2">
              {canGoBack && (
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-border bg-muted text-sm text-foreground hover:bg-secondary/10 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">V</span>
                </div>
                <span className="font-bold text-xl text-primary tracking-tight hidden sm:inline">
                  Velora<span className="text-secondary">Cart</span>
                </span>
              </Link>
            </div>
          <form onSubmit={submit} className="hidden md:flex flex-1 max-w-xl relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search beauty, skincare, makeup…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-muted border border-transparent focus:border-secondary focus:bg-card outline-none text-sm transition"
            />
          </form>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link to="/wishlist" className="p-2 rounded-full hover:bg-muted transition" aria-label="Wishlist">
              <Heart className="w-5 h-5 text-foreground" />
            </Link>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-muted transition" aria-label="Cart">
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-full hover:bg-muted transition">
                  <User className="w-5 h-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
                    <User className="w-4 h-4 mr-2" /> My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/wishlist" })}>
                    <Heart className="w-4 h-4 mr-2" /> Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2 ml-1">
                <Link to="/login" className="text-sm font-medium px-3 py-1.5 rounded-full hover:bg-muted">Login</Link>
                <Link to="/signup" className="text-sm font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:opacity-90">Sign Up</Link>
              </div>
            )}

            <button onClick={() => setOpen((o) => !o)} className="md:hidden p-2 rounded-full hover:bg-muted" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="md:hidden pb-3 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products…"
            className="w-full pl-10 pr-4 py-2 rounded-full bg-muted text-sm outline-none"
          />
        </form>

        <nav className="hidden md:flex items-center gap-6 py-2.5 text-sm border-t border-border overflow-x-auto">
          <Link to="/products" className="font-medium text-foreground hover:text-secondary transition">All Products</Link>
          {categories.map((c) => (
            <Link key={c} to="/products" search={{ category: c } as never} className="text-muted-foreground hover:text-secondary transition whitespace-nowrap">
              {c}
            </Link>
          ))}
        </nav>

        {open && (
          <div className="md:hidden border-t border-border py-3 space-y-2">
            {!user && (
              <div className="flex gap-2 pb-2">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 rounded-full border border-border text-sm">Login</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 text-center py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">Sign Up</Link>
              </div>
            )}
            <Link to="/products" onClick={() => setOpen(false)} className="block py-1.5 text-sm font-medium">All Products</Link>
            {categories.map((c) => (
              <Link key={c} to="/products" search={{ category: c } as never} onClick={() => setOpen(false)} className="block py-1.5 text-sm text-muted-foreground">{c}</Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}