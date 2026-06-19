"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";

const NAV_LINKS = [
  { href: "/jewelry", label: "All Jewelry" },
  { href: "/jewelry?category=temple-jewelry", label: "Temple" },
  { href: "/jewelry?category=kundan-jewelry", label: "Kundan" },
  { href: "/jewelry?category=jadau-jewelry", label: "Jadau" },
  { href: "/jewelry?category=silver-jewelry", label: "Silver" },
  { href: "/jewelry?category=brass-jewelry", label: "Brass" },
  { href: "/jewelry?category=gemstone-jewelry", label: "Gemstone" },
  { href: "/collections", label: "Collections" },
  { href: "/stories", label: "Stories" },
];

export function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const itemCount = useCartStore((s) => s.items.reduce((a, b) => a + b.quantity, 0));

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) setUser(d.user);
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setShowUserMenu(false);
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-100">
      <div className="bg-neutral-900 text-white text-center text-xs tracking-widest py-2 uppercase">
        Complimentary Shipping on All Orders
      </div>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center lg:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <Link href="/" className="flex items-center">
            <span className="text-2xl font-serif tracking-wider text-neutral-900">
              RATNAGIRI
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-neutral-700 hover:text-[#C9A84C] transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 hover:text-[#C9A84C] transition-colors">
              <Search className="h-5 w-5" />
            </button>

            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="p-2 hover:text-[#C9A84C] transition-colors">
                <User className="h-5 w-5" />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-neutral-200 rounded-sm shadow-lg py-2 z-50">
                  {user ? (
                    <>
                      <p className="px-4 py-1.5 text-xs text-neutral-500 truncate">{user.email}</p>
                      <hr className="my-1 border-neutral-100" />
                      <Link href="/orders" className="block px-4 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                        My Orders
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                        Sign In
                      </Link>
                      <Link href="/register" className="block px-4 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link href="/cart" className="relative p-2 hover:text-[#C9A84C] transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#C9A84C] text-white text-[10px] flex items-center justify-center font-medium"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form action="/jewelry" method="GET" className="py-4 flex gap-2">
                <Input name="q" placeholder="Search jewelry..." className="flex-1" autoFocus />
                <Button type="submit">Search</Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-neutral-100"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm tracking-wide text-neutral-700 hover:text-[#C9A84C]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
