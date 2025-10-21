"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface BookFormModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  initialData?: any;
  loading?: boolean;
}

export default function BookFormModal({ show, onClose, onSubmit, initialData, loading }: BookFormModalProps) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    price: "",
    totalPages: "",
    genre: "",
    durationDays: "",
    copies: "1",
  });
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        author: initialData.author || "",
        isbn: initialData.isbn || "",
        description: initialData.description || "",
        price: String(initialData.price || ""),
        totalPages: String(initialData.totalPages || ""),
        genre: initialData.genre || "",
        durationDays: String(initialData.durationDays || ""),
        copies: String(initialData.copies || "1"),
      });
      setCoverPreview(initialData.coverImage || null);
    } else {
      setForm({
        title: "",
        author: "",
        isbn: "",
        description: "",
        price: "",
        totalPages: "",
        genre: "",
        durationDays: "",
        copies: "1",
      });
      setCoverPreview(null);
      setCoverFile(null);
    }
  }, [initialData]);

  if (!show) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => fd.append(key, value));
    if (coverFile) fd.append("cover", coverFile);
    await onSubmit(fd);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-[900px] max-h-[90vh] overflow-y-auto flex">
        {/* LEFT: COVER UPLOAD AREA */}
        <div className="w-1/3 p-5 flex flex-col items-center mt-8">
          <div
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) {
                setCoverFile(file);
                setCoverPreview(URL.createObjectURL(file));
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            className="relative w-63 h-90 mb-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer overflow-hidden"
          >
            {coverPreview ? (
              <>
                <Image src={coverPreview} alt="Cover Preview" fill className="object-cover rounded-lg" />
                {/* Tombol delete di pojok kanan atas */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCoverPreview(null);
                    setCoverFile(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <label htmlFor="cover-upload" className="flex flex-col items-center justify-center text-gray-500 text-sm cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0 0l-3-3m3 3l3-3" />
                </svg>
                <p className="font-medium">Drop file to upload</p>
                <p className="text-xs text-gray-400">or click to browse</p>
              </label>
            )}
            <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        {/* RIGHT: FORM */}
        <form onSubmit={handleSubmit} className="w-2/3 p-6 pt-2 space-y-3">
          <h2 className="text-2xl font-semibold mb-3">{initialData ? "Update Book" : "Add New Book"}</h2>

          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} className="w-full border rounded-lg p-2" required />
          <input name="author" placeholder="Author" value={form.author} onChange={handleChange} className="w-full border rounded-lg p-2" />
          <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} className="w-full border rounded-lg p-2" />

          {/* GRID untuk Price, Pages, Duration */}
          <div className="grid grid-cols-4 gap-3">
            <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="border rounded-lg p-2" />
            <input name="totalPages" type="number" placeholder="Pages" value={form.totalPages} onChange={handleChange} className="border rounded-lg p-2" />
            <input name="copies" type="number" placeholder="Copies" value={form.copies} onChange={handleChange} className="border rounded-lg p-2" />
            <input name="durationDays" type="number" placeholder="Duration" value={form.durationDays} onChange={handleChange} className="border rounded-lg p-2" />
          </div>

          <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} className="w-full border rounded-lg p-2" />

          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border rounded-lg p-2 h-24 resize-none" />

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-200 cursor-pointer">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
              {loading ? "Saving..." : initialData ? "Save" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
