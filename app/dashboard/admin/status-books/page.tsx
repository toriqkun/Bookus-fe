"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/app/utils/axios";
import toast from "react-hot-toast";
import { ArrowLeft, Search } from "lucide-react";
// import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author?: string;
  coverImage?: string;
  isActive: boolean;
  createdAt: string;
}

export default function StatusBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  // const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  // const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase().trim();

    const filtered = books.filter((b) => {
      const titleMatch = b.title.toLowerCase().includes(q);
      const authorMatch = b.author?.toLowerCase().includes(q) ?? false;
      const status = b.isActive ? "active" : "inactive";
      const statusMatch = q === "" ? true : status.startsWith(q);
      return titleMatch || authorMatch || statusMatch;
    });

    setFilteredBooks(filtered);
  }, [search, books]);

  const fetchBooks = async () => {
    try {
      // setLoading(true);
      const { data } = await api.get("/books/services");
      setBooks(data.data || data);
      setFilteredBooks(data.data || data);
    } catch (err) {
      console.error("Gagal memuat buku:", err);
      toast.error("Failed to load book list");
    }
  };

  const toggleBookStatus = async (book: Book) => {
    try {
      if (book.isActive) {
        await api.patch(`/books/services/${book.id}`);
        toast.success(`"${book.title}" dinonaktifkan`);
      } else {
        await api.patch(`/books/services/restore/${book.id}`);
        toast.success(`"${book.title}" reactivated`);
      }
      setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...b, isActive: !b.isActive } : b)));
      setSelectedBook(null);
    } catch (err) {
      console.error("Gagal ubah status buku:", err);
      toast.error("Failed to load book list");
    }
  };

  // if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Loading books...</div>;

  // if (books.length === 0) return <div className="flex justify-center items-center h-screen text-gray-500">No books added yet</div>;

  return (
    <main className="min-h-screen p-10 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
            <ArrowLeft size={27} />
          </button>
          <h1 className="text-3xl font-bold">Status Books 📚</h1>
        </div>

        {/* Input Search dengan Icon */}
        <div className="relative w-100">
          <input
            type="text"
            placeholder="Search by title, author, or status (active/inactive)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-purple-500 focus:outline-none text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Grid Buku */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => setSelectedBook(book)}
            className={`cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-[1.02] overflow-hidden border-2 ${
              book.isActive ? "border-green-400" : "border-gray-300 opacity-75"
            }`}
          >
            <Image src={book.coverImage || "/default-book.jpg"} alt={book.title} width={300} height={400} className="w-full h-60 object-cover" />
            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg text-gray-800 truncate">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{book.author || "-"}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${book.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                {book.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-lg relative">
            <h2 className="text-lg font-semibold mb-2 text-center">Update Status Book</h2>
            <Image src={selectedBook.coverImage || "/default-book.jpg"} alt={selectedBook.title} width={120} height={160} className="object-cover rounded-md mx-auto mb-3" />
            <p className="text-center text-gray-700 font-medium mb-4">{selectedBook.title}</p>
            <p className="text-sm text-center text-gray-500 mb-4">
              Current Status: <b className={selectedBook.isActive ? "text-green-600" : "text-gray-600"}>{selectedBook.isActive ? "Active" : "Inactive"}</b>
            </p>

            <div className="flex justify-center gap-3">
              <button onClick={() => setSelectedBook(null)} className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-200 text-gray-700">
                Cancel
              </button>
              <button
                onClick={() => toggleBookStatus(selectedBook)}
                className={`px-4 py-2 rounded-lg ${selectedBook.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
              >
                {selectedBook.isActive ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
