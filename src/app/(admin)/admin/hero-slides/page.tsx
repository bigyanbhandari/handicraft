"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { ImageUpload } from "@/components/admin/image-upload";

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ id: "", title: "", subtitle: "", ctaText: "", ctaLink: "", image: "" });
  const [images, setImages] = useState<{ url: string; alt?: string }[]>([]);
  const [showForm, setShowForm] = useState(false);

  function fetchData() {
    setLoading(true);
    fetch("/api/admin/hero-slides")
      .then((r) => r.json())
      .then((d) => setSlides(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchData() }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const method = form.id ? "PUT" : "POST";
    const payload = { ...form, image: images[0]?.url || form.image, order: 0, active: true };

    const res = await fetch("/api/admin/hero-slides", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowForm(false);
      setForm({ id: "", title: "", subtitle: "", ctaText: "", ctaLink: "", image: "" });
      setImages([]);
      fetchData();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this slide?")) return;
    await fetch("/api/admin/hero-slides", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchData();
  }

  function handleEdit(slide: any) {
    setForm({ id: slide.id, title: slide.title, subtitle: slide.subtitle || "", ctaText: slide.ctaText || "", ctaLink: slide.ctaLink || "", image: slide.image || "" });
    setImages(slide.image ? [{ url: slide.image }] : []);
    setShowForm(true);
  }

  async function toggleActive(slide: any) {
    await fetch("/api/admin/hero-slides", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...slide, active: !slide.active }),
    });
    fetchData();
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif text-white">Hero Slides</h1>
          <button onClick={() => { setForm({ id: "", title: "", subtitle: "", ctaText: "", ctaLink: "", image: "" }); setImages([]); setShowForm(true) }} className="bg-[#C9A84C] hover:bg-[#B8973A] text-white text-sm px-4 py-2 rounded transition-colors">
            + New Slide
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave} className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-8 max-w-2xl space-y-4">
            <h3 className="text-white font-medium">{form.id ? "Edit Slide" : "New Slide"}</h3>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" required />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Subtitle</label>
              <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">CTA Text</label>
                <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">CTA Link</label>
                <input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Background Image</label>
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
          <div className="space-y-4">
            {slides.map((slide: any) => (
              <div key={slide.id} className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex items-center gap-5">
                {slide.image && (
                  <div className="w-32 h-20 rounded overflow-hidden bg-neutral-800 shrink-0">
                    <img src={slide.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium">{slide.title}</h3>
                  {slide.subtitle && <p className="text-neutral-400 text-sm truncate">{slide.subtitle}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => toggleActive(slide)} className={`text-xs px-3 py-1 rounded-full ${slide.active ? "bg-emerald-400/10 text-emerald-400" : "bg-neutral-700 text-neutral-400"}`}>
                    {slide.active ? "Active" : "Inactive"}
                  </button>
                  <button onClick={() => handleEdit(slide)} className="text-neutral-400 hover:text-[#C9A84C] text-xs">Edit</button>
                  <button onClick={() => handleDelete(slide.id)} className="text-neutral-400 hover:text-red-400 text-xs">Delete</button>
                </div>
              </div>
            ))}
            {slides.length === 0 && (
              <p className="text-center text-neutral-500 py-10">No slides yet. Add your first hero slide!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
