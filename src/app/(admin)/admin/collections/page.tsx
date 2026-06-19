"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: "", title: "", slug: "", description: "" });
  const [images, setImages] = useState<{ url: string; alt?: string }[]>([]);
  const [showForm, setShowForm] = useState(false);

  function fetchData() {
    setLoading(true);
    fetch("/api/admin/collections")
      .then((r) => r.json())
      .then((d) => setCollections(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData() }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/collections", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, image: images[0]?.url || null }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ id: "", title: "", slug: "", description: "" });
      setImages([]);
      fetchData();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this collection?")) return;
    await fetch("/api/admin/collections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  function handleEdit(coll: any) {
    setForm({ id: coll.id, title: coll.title, slug: coll.slug, description: coll.description || "" });
    setImages(coll.image ? [{ url: coll.image }] : []);
    setShowForm(true);
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif text-white">Collections</h1>
          <button onClick={() => { setForm({ id: "", title: "", slug: "", description: "" }); setImages([]); setShowForm(true) }} className="bg-[#C9A84C] hover:bg-[#B8973A] text-white text-sm px-4 py-2 rounded transition-colors">
            + New Collection
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8 max-w-lg space-y-4">
            <h3 className="text-white font-medium">{form.id ? "Edit Collection" : "New Collection"}</h3>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.id ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" required />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" required />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Image</label>
              <ImageUpload images={images} onChange={setImages} maxImages={1} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="bg-[#C9A84C] hover:bg-[#B8973A] text-white text-sm px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        )}

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
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Slug</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Image</th>
                  <th className="text-right px-4 py-3 text-neutral-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((coll: any) => (
                  <tr key={coll.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-white font-medium">{coll.title}</td>
                    <td className="px-4 py-3 text-neutral-400">{coll.slug}</td>
                    <td className="px-4 py-3">
                      {coll.image ? <img src={coll.image} alt="" className="w-10 h-10 rounded object-cover" /> : <span className="text-neutral-500">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(coll)} className="text-neutral-400 hover:text-[#C9A84C] text-xs mr-3">Edit</button>
                      <button onClick={() => handleDelete(coll.id)} className="text-neutral-400 hover:text-red-400 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
                {collections.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-neutral-500">No collections yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
