"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (res.ok) setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  function setSetting(key: string, value: any) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-neutral-950">
        <AdminSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-y-auto max-h-screen">
        <h1 className="text-2xl font-serif text-white mb-8">Site Settings</h1>

        <form onSubmit={handleSave} className="max-w-2xl space-y-6">
          <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
            <h2 className="text-white font-medium">Homepage Hero</h2>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Hero Title</label>
              <input value={settings.heroTitle || "Where Heritage Meets Elegance"} onChange={(e) => setSetting("heroTitle", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Hero Subtitle</label>
              <textarea value={settings.heroSubtitle || ""} onChange={(e) => setSetting("heroSubtitle", e.target.value)} rows={2} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
            <h2 className="text-white font-medium">Brand Info</h2>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Store Name</label>
              <input value={settings.storeName || "Ratnagiri"} onChange={(e) => setSetting("storeName", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Tagline</label>
              <input value={settings.tagline || "Handcrafted Indian Jewelry"} onChange={(e) => setSetting("tagline", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Contact Email</label>
              <input type="email" value={settings.contactEmail || ""} onChange={(e) => setSetting("contactEmail", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Contact Phone</label>
              <input value={settings.contactPhone || ""} onChange={(e) => setSetting("contactPhone", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Address</label>
              <textarea value={settings.address || ""} onChange={(e) => setSetting("address", e.target.value)} rows={3} className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
            <h2 className="text-white font-medium">Social Links</h2>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Instagram</label>
              <input value={settings.instagramUrl || ""} onChange={(e) => setSetting("instagramUrl", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Facebook</label>
              <input value={settings.facebookUrl || ""} onChange={(e) => setSetting("facebookUrl", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Pinterest</label>
              <input value={settings.pinterestUrl || ""} onChange={(e) => setSetting("pinterestUrl", e.target.value)} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
            <h2 className="text-white font-medium">Shipping & Returns</h2>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Free Shipping Threshold (₹)</label>
              <input type="number" value={settings.freeShippingThreshold || 25000} onChange={(e) => setSetting("freeShippingThreshold", parseInt(e.target.value))} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 uppercase tracking-wider mb-1">Standard Shipping Cost (₹)</label>
              <input type="number" value={settings.shippingCost || 499} onChange={(e) => setSetting("shippingCost", parseInt(e.target.value))} className="w-full h-10 px-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white focus:outline-none focus:border-[#C9A84C]" />
            </div>
          </section>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="bg-[#C9A84C] hover:bg-[#B8973A] text-white text-sm px-6 py-2.5 rounded transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Settings"}
            </button>
            {saved && <span className="text-emerald-400 text-sm">Settings saved!</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
