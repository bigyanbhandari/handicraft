"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AdminStoriesPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: "", title: "", slug: "", excerpt: "", content: "", author: "", tags: "" });
  const [images, setImages] = useState<{ url: string; alt?: string }[]>([]);
  const [showForm, setShowForm] = useState(false);

  function fetchData() {
    setLoading(true);
    fetch("/api/admin/stories")
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData() }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/stories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        coverImage: images[0]?.url || null,
        tags: form.tags.split(",").map((s: string) => s.trim()).filter(Boolean),
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ id: "", title: "", slug: "", excerpt: "", content: "", author: "", tags: "" });
      setImages([]);
      fetchData();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this story?")) return;
    await fetch("/api/admin/stories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  function handleEdit(post: any) {
    setForm({
      id: post.id, title: post.title, slug: post.slug,
      excerpt: post.excerpt || "", content: post.content || "",
      author: post.author || "", tags: post.tags?.join(", ") || "",
    });
    setImages(post.coverImage ? [{ url: post.coverImage }] : []);
    setShowForm(true);
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif text-white">Stories</h1>
          <button onClick={() => { setForm({ id: "", title: "", slug: "", excerpt: "", content: "", author: "", tags: "" }); setImages([]); setShowForm(true) }} className="bg-[#C9A84C] hover:bg-[#B8973A] text-white text-sm px-4 py-2 rounded transition-colors">
            + New Story
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8 max-w-2xl space-y-4">
            <h3 className="text-white font-medium">{form.id ? "Edit Story" : "New Story"}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.id ? form.slug : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" required />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" required />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Author</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Cover Image</label>
                <ImageUpload images={images} onChange={setImages} maxImages={1} />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Excerpt</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Content (markdown/HTML)</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={8} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm text-white font-mono focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Tags (comma separated)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" placeholder="tradition, craftsmanship, temple" />
              </div>
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
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Author</th>
                  <th className="text-left px-4 py-3 text-neutral-400 font-medium">Date</th>
                  <th className="text-right px-4 py-3 text-neutral-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post: any) => (
                  <tr key={post.id} className="border-b border-neutral-800 last:border-0 hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-white font-medium">{post.title}</td>
                    <td className="px-4 py-3 text-neutral-400">{post.author || "—"}</td>
                    <td className="px-4 py-3 text-neutral-400 text-xs">
                      {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(post)} className="text-neutral-400 hover:text-[#C9A84C] text-xs mr-3">Edit</button>
                      <button onClick={() => handleDelete(post.id)} className="text-neutral-400 hover:text-red-400 text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-neutral-500">No stories yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
