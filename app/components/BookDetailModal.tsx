"use client";
import { X } from "lucide-react";
import Image from "next/image";

export default function BookDetailModal({ book, onClose }: { book: any; onClose: () => void }) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 px-8 w-[90%] max-w-md shadow-lg relative">
        {/* Tombol close */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer">
          <X size={25} />
        </button>

        <div className="flex flex-col items-center">
          {/* Cover */}
          <Image src={book.coverImage || "/book-covers/placeholder.jpg"} alt={book.title} width={150} height={200} className="object-cover rounded-md mb-2" />

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-4 text-center">{book.title}</h2>

          {/* Detail info - titik dua sejajar */}
          <div className="w-full text-sm text-gray-700 space-y-1">
            {[
              { label: "Author", value: book.author || "-" },
              { label: "ISBN", value: book.isbn || "-" },
              { label: "Genre", value: book.genre || "-" },
              { label: "Pages", value: book.totalPages || "-" },
              { label: "Copies", value: book.copies || 1 },
              {
                label: "Price",
                value: book.price ? `Rp ${book.price.toLocaleString()}` : "Rp 0",
              },
              {
                label: "Duration",
                value: book.durationDays === 1 ? "1 Day" : `${book.durationDays || 0} Days`,
              },
            ].map((item) => (
              <div key={item.label} className="grid grid-cols-[100px_10px_1fr] items-start">
                <span className="font-semibold">{item.label}</span>
                <span>:</span>
                <span>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Deskripsi */}
          <p className="text-sm text-gray-700 mt-8 w-full text-left [text-indent:1.25rem] leading-relaxed">{book.description || "Tidak ada deskripsi"}</p>
        </div>
      </div>
    </div>
  );
}
