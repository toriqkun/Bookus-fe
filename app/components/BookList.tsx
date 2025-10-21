"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/app/utils/axios";

interface Book {
  id: string;
  title: string;
  author?: string;
  coverImage?: string;
  genre?: string;
  price?: number;
  isActive: boolean;
}

interface BookListProps {
  cols?: string;
  search?: string;
}

export default function BookList({ cols = "lg:grid-cols-6", search = "" }: BookListProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/books/services");
        setBooks(res.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((b) => b.isActive).filter((b) => b.title.toLowerCase().includes(search.toLowerCase()) || (b.author?.toLowerCase().includes(search.toLowerCase()) ?? false));

  if (loading) return <div className="text-center py-10">Loading books...</div>;
  if (filteredBooks.length === 0) return <div className="text-center py-10 text-gray-500">Book not found.</div>;

  return (
    <div className={`grid grid-cols-3 sm:grid-cols-4 ${cols} gap-6`}>
      {filteredBooks.map((book) => (
        <Link key={book.id} href={`/book/${book.id}`} className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden">
          <Image src={book.coverImage || "/default-book.jpg"} alt={book.title} width={300} height={400} className="w-full h-56 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800 truncate">{book.title}</h3>
            <p className="text-sm text-gray-500">{book.author}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
