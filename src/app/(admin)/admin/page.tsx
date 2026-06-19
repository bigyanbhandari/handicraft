"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/admin/sidebar";

interface DashboardData {
  productCount: number;
  orderCount: number;
  categoryCount: number;
  userCount: number;
  revenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-serif text-white mb-8">Dashboard</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: "Products", value: data.productCount, href: "/admin/products" },
                { label: "Orders", value: data.orderCount, href: "/admin/orders" },
                { label: "Categories", value: data.categoryCount, href: "/admin/categories" },
                { label: "Revenue", value: formatPrice(data.revenue), href: "/admin/orders" },
              ].map((item) => (
                <Link key={item.label} href={item.href} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-[#C9A84C]/30 transition-colors">
                  <p className="text-neutral-400 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-2xl font-semibold text-white">{item.value}</p>
                </Link>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-serif text-white mb-4">Recent Orders</h2>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="text-left px-4 py-3 text-neutral-400 font-medium">Customer</th>
                      <th className="text-left px-4 py-3 text-neutral-400 font-medium">Status</th>
                      <th className="text-left px-4 py-3 text-neutral-400 font-medium">Total</th>
                      <th className="text-left px-4 py-3 text-neutral-400 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((order: any) => (
                      <tr key={order.id} className="border-b border-neutral-800 last:border-0">
                        <td className="px-4 py-3 text-white">{order.customerName}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            order.status === "paid" ? "bg-emerald-400/10 text-emerald-400" :
                            order.status === "pending" ? "bg-yellow-400/10 text-yellow-400" :
                            "bg-red-400/10 text-red-400"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-white">{formatPrice(order.total)}</td>
                        <td className="px-4 py-3 text-neutral-400">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </td>
                      </tr>
                    ))}
                    {data.recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">No orders yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p className="text-neutral-500">Failed to load dashboard data.</p>
        )}
      </div>
    </div>
  );
}
