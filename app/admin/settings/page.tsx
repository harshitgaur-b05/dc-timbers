"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function SiteSettingsPage() {
  const [heroBannerImage, setHeroBannerImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setHeroBannerImage(data.heroBannerImage || "");
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("folder", "dctimbers/settings");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setHeroBannerImage(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroBannerImage }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save settings");
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-stone-400 font-medium">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-3xl font-black uppercase"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Site Settings
        </h1>
        <p className="text-sm opacity-60 mt-1">Manage global website settings and imagery.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded font-medium">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded font-medium">
          ✅ Settings saved successfully!
        </div>
      )}

      <div className="bg-white border border-stone-200 rounded-lg p-6">
        <h2 className="font-black text-lg uppercase text-stone-700 mb-5 pb-3 border-b border-stone-100">
          Homepage Hero Banner
        </h2>
        <div className="space-y-4">
          <div className="relative w-full h-64 bg-stone-100 rounded-lg overflow-hidden flex items-center justify-center border border-stone-200">
            {heroBannerImage ? (
              <Image src={heroBannerImage} alt="Hero Banner Preview" fill className="object-cover" />
            ) : (
              <div className="text-center text-stone-400">
                <span className="material-symbols-outlined text-4xl mb-2">image</span>
                <p className="text-sm">No banner image set</p>
              </div>
            )}
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-stone-200 text-stone-700 font-bold text-sm rounded hover:bg-stone-300 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload New Image"}
              </button>
              {heroBannerImage && (
                <button
                  type="button"
                  onClick={() => setHeroBannerImage("")}
                  className="px-4 py-2 bg-red-100 text-red-700 font-bold text-sm rounded hover:bg-red-200"
                >
                  Remove Image
                </button>
              )}
            </div>
            <p className="text-xs text-stone-400 mt-2">Recommended size: 1920x1080 (JPG, WEBP). Will be cropped automatically to fit.</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2.5 bg-amber-600 text-white font-black text-sm uppercase tracking-wider rounded shadow hover:bg-amber-700 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
