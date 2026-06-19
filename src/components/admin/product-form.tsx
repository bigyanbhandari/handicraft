"use client";

import { useState } from "react";
import { ImageUpload } from "@/components/admin/image-upload";

interface Props {
  product: any | null;
  categories: any[];
  collections: any[];
  onSave: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, categories, collections, onSave, onCancel }: Props) {
  const [form, setForm] = useState({
    title: product?.title || "",
    slug: product?.slug || "",
    price: product?.price?.toString() || "",
    discountPrice: product?.discountPrice?.toString() || "",
    description: product?.description || "",
    materials: product?.materials?.join(", ") || "",
    craftType: product?.craftType || "",
    origin: product?.origin || "",
    occasion: product?.occasion?.join(", ") || "",
    stockStatus: product?.stockStatus || "In Stock",
    featured: product?.featured || false,
    categoryId: product?.categoryId || "",
    collectionId: product?.collectionId || "",
  });
  const [images, setImages] = useState<{ url: string; alt?: string }[]>(product?.images || []);
  const [saving, setSaving] = useState(false);

  function setField(field: string, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const data = {
      ...form,
      price: form.price,
      discountPrice: form.discountPrice || null,
      materials: form.materials.split(",").map((s: string) => s.trim()).filter(Boolean),
      occasion: form.occasion.split(",").map((s: string) => s.trim()).filter(Boolean),
      images,
    };

    try {
      const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
      const method = product ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onSave();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save");
      }
    } catch {
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  function autoSlug(title: string) {
    setField("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      <h2 className="text-xl font-serif text-white">{product ? "Edit Product" : "New Product"}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Title</label>
          <input value={form.title} onChange={(e) => { setField("title", e.target.value); if (!product) autoSlug(e.target.value) }} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" required />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Slug</label>
          <input value={form.slug} onChange={(e) => setField("slug", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" required />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Craft Type</label>
          <input value={form.craftType} onChange={(e) => setField("craftType", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Price (₹)</label>
          <input type="number" value={form.price} onChange={(e) => setField("price", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" required />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Discount Price</label>
          <input type="number" value={form.discountPrice} onChange={(e) => setField("discountPrice", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Stock Status</label>
          <select value={form.stockStatus} onChange={(e) => setField("stockStatus", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]">
            <option value="In Stock">In Stock</option>
            <option value="Limited Stock">Limited Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Pre-order">Pre-order</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Category</label>
          <select value={form.categoryId} onChange={(e) => setField("categoryId", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]">
            <option value="">None</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Collection</label>
          <select value={form.collectionId} onChange={(e) => setField("collectionId", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]">
            <option value="">None</option>
            {collections.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Origin</label>
          <input value={form.origin} onChange={(e) => setField("origin", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Featured</label>
            <select value={form.featured ? "true" : "false"} onChange={(e) => setField("featured", e.target.value === "true")} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]">
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Description</label>
        <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={3} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
      </div>

      <div>
        <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Materials (comma separated)</label>
        <input value={form.materials} onChange={(e) => setField("materials", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" placeholder="Gold, Silver, Gemstone" />
      </div>

      <div>
        <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Occasion (comma separated)</label>
        <input value={form.occasion} onChange={(e) => setField("occasion", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" placeholder="Wedding, Festival, Daily Wear" />
      </div>

      <div>
        <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1.5">Images</label>
        <ImageUpload images={images} onChange={setImages} />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="submit" disabled={saving} className="bg-[#C9A84C] hover:bg-[#B8973A] text-white text-sm px-6 py-2.5 rounded transition-colors disabled:opacity-50">
          {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={onCancel} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm px-6 py-2.5 rounded transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
