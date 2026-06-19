"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchData() {
    setLoading(true);
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData() }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-400/10 text-yellow-400",
    paid: "bg-emerald-400/10 text-emerald-400",
    processing: "bg-blue-400/10 text-blue-400",
    shipped: "bg-purple-400/10 text-purple-400",
    delivered: "bg-emerald-400/10 text-emerald-400",
    cancelled: "bg-red-400/10 text-red-400",
    expired: "bg-red-400/10 text-red-400",
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-serif text-white mb-8">Orders</h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Order</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Items</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Date</th>
                  <th className="text-right px-4 py-3 text-neutral-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-neutral-400 font-mono text-xs">{order.id.slice(0, 8)}</td>
                    <td className="px-4 py-3">
                      <div className="text-white">{order.customerName}</div>
                      <div className="text-neutral-500 text-xs">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{order.items?.length || 0}</td>
                    <td className="px-4 py-3 text-white font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || "bg-neutral-700 text-neutral-300"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="text-xs bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white focus:outline-none focus:border-[#C9A84C]"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-500">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
