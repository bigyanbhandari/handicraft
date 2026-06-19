"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "◈" },
  { label: "Products", href: "/admin/products", icon: "◆" },
  { label: "Categories", href: "/admin/categories", icon: "⊞" },
  { label: "Collections", href: "/admin/collections", icon: "⊟" },
  { label: "Orders", href: "/admin/orders", icon: "📦" },
  { label: "Stories", href: "/admin/stories", icon: "📖" },
  { label: "Hero Slides", href: "/admin/hero-slides", icon: "🖼" },
  { label: "Pages", href: "/admin/pages", icon: "📄" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-56 bg-neutral-900 border-r border-neutral-800 flex flex-col">
      <div className="p-5 border-b border-neutral-800">
        <Link href="/admin" className="text-lg font-serif text-white">Ratnagiri</Link>
        <p className="text-xs text-neutral-500 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                isActive
                  ? "text-[#C9A84C] bg-[#C9A84C]/5 border-r-2 border-[#C9A84C]"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-neutral-800">
        <Link href="/" className="block text-xs text-neutral-500 hover:text-neutral-300 mb-3 transition-colors">
          ← View Store
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-xs text-neutral-500 hover:text-red-400 transition-colors text-left"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
