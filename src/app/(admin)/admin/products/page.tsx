"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ProductForm } from "@/components/admin/product-form";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  function fetchData() {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch("/api/admin/collections").then((r) => r.json()),
    ])
      .then(([p, c, coll]) => {
        setProducts(Array.isArray(p) ? p : []);
        setCategories(Array.isArray(c) ? c : []);
        setCollections(Array.isArray(coll) ? coll : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData() }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch {}
  }

  function handleEdit(product: any) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleNew() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
  }

  if (showForm) {
    return (
      <div className="flex min-h-screen bg-neutral-950">
        <AdminSidebar />
        <div className="flex-1 p-8 overflow-y-auto max-h-screen">
          <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-white text-sm mb-6">
            ← Back to Products
          </button>
          <ProductForm
            product={editingProduct}
            categories={categories}
            collections={collections}
            onSave={() => { setShowForm(false); fetchData() }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif text-white">Products</h1>
          <button onClick={handleNew} className="bg-[#C9A84C] hover:bg-[#B8973A] text-white text-sm px-4 py-2 rounded transition-colors">
            + New Product
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-800">
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Price</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Category</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Stock</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Featured</th>
                  <th className="text-right px-4 py-3 text-neutral-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-white font-medium">{product.title}</td>
                    <td className="px-4 py-3 text-white">
                      {product.discountPrice ? (
                        <><span className="text-[#C9A84C]">{formatPrice(product.discountPrice)}</span> <span className="text-neutral-500 line-through text-xs">{formatPrice(product.price)}</span></>
                      ) : formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3 text-neutral-400">{product.category?.title || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        product.stockStatus === "In Stock" ? "bg-emerald-400/10 text-emerald-400" :
                        product.stockStatus === "Limited Stock" ? "bg-yellow-400/10 text-yellow-400" :
                        "bg-red-400/10 text-red-400"
                      }`}>{product.stockStatus}</span>
                    </td>
                    <td className="px-4 py-3">{product.featured ? <span className="text-[#C9A84C]">★</span> : "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(product)} className="text-neutral-400 hover:text-[#C9A84C] text-xs mr-3">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="text-neutral-400 hover:text-red-400 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">No products yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
