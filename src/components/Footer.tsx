import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center font-bold">V</div>
            <span className="font-bold text-xl">VeloraCart</span>
          </div>
          <p className="text-sm text-primary-foreground/70">Premium beauty, skincare, and wellness — delivered to your door.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products" search={{ category: "Skincare" } as never}>Skincare</Link></li>
            <li><Link to="/products" search={{ category: "Makeup" } as never}>Makeup</Link></li>
            <li><Link to="/products" search={{ category: "Fragrance" } as never}>Fragrance</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/profile">My Profile</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Help</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>Shipping & Returns</li>
            <li>Contact Us</li>
            <li>FAQ</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} VeloraCart. All rights reserved.
      </div>
    </footer>
  );
}