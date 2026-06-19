"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  images: { url: string; alt?: string }[];
  onChange: (images: { url: string; alt?: string }[]) => void;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, maxImages = 10 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const newImages = [...images];
      for (let i = 0; i < files.length && newImages.length < maxImages; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          newImages.push({ url: data.url, alt: file.name.replace(/\.[^/.]+$/, "") });
        }
      }
      onChange(newImages);
    } catch {
      alert("Failed to upload images");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function updateAlt(index: number, alt: string) {
    const updated = images.map((img, i) => i === index ? { ...img, alt } : img);
    onChange(updated);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative group w-24 h-24 bg-neutral-800 rounded overflow-hidden border border-neutral-700">
            <img src={img.url} alt={img.alt || ""} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button type="button" onClick={() => removeImage(i)} className="text-red-400 text-xs bg-black/50 px-2 py-1 rounded">Delete</button>
            </div>
            <input
              type="text"
              value={img.alt || ""}
              onChange={(e) => updateAlt(i, e.target.value)}
              placeholder="Alt text"
              className="absolute bottom-0 left-0 right-0 text-[10px] px-1 py-0.5 bg-black/70 text-white border-0 outline-none"
            />
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 border-2 border-dashed border-neutral-600 rounded flex items-center justify-center text-neutral-500 hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors text-xs"
          >
            {uploading ? (
              <span className="w-5 h-5 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
            ) : (
              "+ Upload"
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
