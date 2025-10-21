// "use client";
// import { useState, useEffect } from "react";
// import api from "@/app/utils/axios";
// import Image from "next/image";
// import { Plus, Loader2, X } from "lucide-react";

// type Book = {
//   id: string;
//   title: string;
//   author?: string;
//   isbn?: string;
//   description?: string;
//   coverImage?: string | null;
//   genre?: string;
//   price?: number;
//   durationDays?: number;
//   isActive: boolean;
//   createdAt: string;
// };

// export default function AdminBooksPage() {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [uploading, setUploading] = useState(false);
//   const [selectedBook, setSelectedBook] = useState<Book | null>(null);
//   const [form, setForm] = useState({
//     title: "",
//     author: "",
//     isbn: "",
//     description: "",
//     price: "",
//     totalPages: "",
//     genre: "",
//     durationDays: "",
//   });
//   const [cover, setCover] = useState<File | null>(null);

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const fetchBooks = async () => {
//     try {
//       setLoading(true);
//       const { data } = await api.get("/books/services");
//       setBooks(data.data || data);
//     } catch (err) {
//       console.error("❌ Failed to fetch books", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setUploading(true);
//       const formData = new FormData();
//       Object.entries(form).forEach(([key, value]) => formData.append(key, value));
//       if (cover) formData.append("cover", cover);

//       if (selectedBook) {
//         // 🔧 Jika sedang edit buku
//         await api.put(`/books/services/${selectedBook.id}`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("✅ Buku berhasil diperbarui!");
//       } else {
//         // ➕ Jika tambah buku baru
//         await api.post("/books/services", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("✅ Buku berhasil ditambahkan!");
//       }

//       setShowModal(false);
//       setForm({
//         title: "",
//         author: "",
//         isbn: "",
//         description: "",
//         price: "",
//         durationDays: "",
//         totalPages: "",
//         genre: "",
//       });
//       setCover(null);
//       setSelectedBook(null);
//       fetchBooks();
//     } catch (err) {
//       console.error("❌ Gagal submit buku:", err);
//       alert("Gagal menyimpan buku");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Yakin ingin menghapus buku ini?")) return;
//     try {
//       await api.delete(`/books/services/${id}`);
//       alert("✅ Buku berhasil dihapus!");
//       fetchBooks();
//     } catch (err) {
//       console.error("❌ Gagal menghapus buku:", err);
//       alert("Gagal menghapus buku");
//     }
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold">📚 My Books</h1>
//         <button
//           onClick={() => {
//             setSelectedBook(null);
//             setForm({
//               title: "",
//               author: "",
//               isbn: "",
//               description: "",
//               price: "",
//               totalPages: "",
//               genre: "",
//               durationDays: "",
//             });
//             setCover(null);
//             setShowModal(true);
//           }}
//           className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//         >
//           <Plus size={18} />
//           Add Book
//         </button>
//       </div>

//       {/* Book List */}
//       {loading ? (
//         <p className="text-gray-500">Loading books...</p>
//       ) : books.length === 0 ? (
//         <p className="text-gray-400 text-center">no books have been written yet</p>
//       ) : (
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {books.map((book) => (
//             <div key={book.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition flex flex-col">
//               <div className="relative h-48 cursor-pointer group" onClick={() => setSelectedBook(book)}>
//                 <Image src={book.coverImage || "/book-covers/placeholder.jpg"} alt={book.title} fill className="object-cover group-hover:opacity-90 transition" />
//               </div>

//               {/* 📄 Info Buku */}
//               <div className="p-3 flex flex-col flex-grow justify-between">
//                 <div>
//                   <h3 className="font-semibold text-lg truncate">{book.title}</h3>
//                   <p className="text-sm text-gray-500">{book.author || "Unknown"}</p>
//                 </div>

//                 {/* 🔘 Tombol Aksi */}
//                 <div className="flex gap-3 items-center pt-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setSelectedBook(book);
//                       setForm({
//                         title: book.title,
//                         author: book.author || "",
//                         isbn: book.isbn || "",
//                         description: book.description || "",
//                         price: String(book.price || ""),
//                         totalPages: "",
//                         genre: book.genre || "",
//                         durationDays: String(book.durationDays || ""),
//                       });
//                       setShowModal(true);
//                     }}
//                     className="w-full text-white hover:bg-green-600 rounded-lg bg-green-400 py-1 px-4"
//                   >
//                     Edit
//                   </button>

//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleDelete(book.id);
//                     }}
//                     className="w-full text-white hover:bg-red-600 bg-red-500 rounded-lg py-1 px-4"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* MODAL ADD BOOK */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
//             <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
//               <X size={20} />
//             </button>

//             <h2 className="text-lg font-semibold mb-4">{selectedBook ? "Edit Buku" : "Tambah Buku Baru"}</h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm mb-1">Title *</label>
//                 <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full border rounded-md p-2" />
//               </div>

//               <div>
//                 <label className="block text-sm mb-1">Author</label>
//                 <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full border rounded-md p-2" />
//               </div>

//               <div>
//                 <label className="block text-sm mb-1">ISBN</label>
//                 <input type="text" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} className="w-full border rounded-md p-2" />
//               </div>

//               <div>
//                 <label className="block text-sm mb-1">Description</label>
//                 <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-md p-2" />
//               </div>

//               <div className="grid grid-cols-3 gap-3">
//                 <div>
//                   <label className="block text-sm mb-1">Price</label>
//                   <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border rounded-md p-2" />
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-1">Pages</label>
//                   <input type="number" value={form.totalPages} onChange={(e) => setForm({ ...form, totalPages: e.target.value })} className="w-full border rounded-md p-2" />
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-1">Duration</label>
//                   <input type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} className="w-full border rounded-md p-2" />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm mb-1">Genre (maks. 3, pisahkan koma)</label>
//                 <input type="text" placeholder="misal: Fantasy, Mystery" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="w-full border rounded-md p-2" />
//               </div>

//               <div>
//                 <label className="block text-sm mb-1">Cover Buku</label>
//                 <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] || null)} className="w-full text-sm" />
//               </div>

//               <div className="flex justify-end gap-3 mt-4">
//                 <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">
//                   Batal
//                 </button>
//                 <button type="submit" disabled={uploading} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2">
//                   {uploading && <Loader2 size={16} className="animate-spin" />}
//                   Simpan
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* MODAL DETAIL BUKU */}
//       {selectedBook && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg relative">
//             <button onClick={() => setSelectedBook(null)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
//               <X size={20} />
//             </button>

//             <div className="flex flex-col items-center text-center">
//               <Image src={selectedBook.coverImage || "/book-covers/placeholder.jpg"} alt={selectedBook.title} width={150} height={200} className="object-cover rounded-md mb-4" />
//               <h2 className="text-xl font-semibold mb-2">{selectedBook.title}</h2>
//               <p className="text-sm text-gray-600 mb-1">
//                 <b>Penulis:</b> {selectedBook.author || "Unknown"}
//               </p>
//               <p className="text-sm text-gray-600 mb-1">
//                 <b>ISBN:</b> {selectedBook.isbn || "-"}
//               </p>
//               <p className="text-sm text-gray-600 mb-1">
//                 <b>Genre:</b> {selectedBook.genre || "-"}
//               </p>
//               <p className="text-sm text-gray-600 mb-1">
//                 <b>Harga:</b> {selectedBook.price ? `Rp ${selectedBook.price.toLocaleString()}/Day` : "Rp 0/Day"}
//               </p>
//               {selectedBook.durationDays && (
//                 <p className="text-sm text-gray-600 mb-1">
//                   <b>Durasi:</b> {selectedBook.durationDays === 1 ? "1 Day" : `${selectedBook.durationDays} Days`}
//                 </p>
//               )}
//               <p className="text-sm text-gray-600 mt-3 text-center">{selectedBook.description || "Tidak ada deskripsi"}</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import api from "@/app/utils/axios";
import { Plus, ArrowLeft, Search, Ellipsis} from "lucide-react";
import Image from "next/image";
import BookFormModal from "@/app/components/BookFormModal";
import BookDetailModal from "@/app/components/BookDetailModal";
import toast from "react-hot-toast";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailBook, setDetailBook] = useState<any | null>(null);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/books/services");
      setBooks(data.data || data);
    } catch (err) {
      console.error("❌ Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setUploading(true);

      if (selectedBook) {
        await api.put(`/books/services/${selectedBook.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Successfully updated the book");
      } else {
        await api.post("/books/services", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Successfully added book");
      }

      fetchBooks();
      setModalOpen(false);
      setSelectedBook(null);
    } catch (err) {
      console.error("❌ Gagal submit:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/books/services/${id}`);
      toast.success("Successfully deleted the book");
      fetchBooks();
    } catch (err) {
      console.error("❌ Gagal menghapus buku:", err);
      toast.error("Failed to delete book");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-5">
          <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
            <ArrowLeft size={30} />
          </button>
          <h1 className="text-3xl font-bold">My Books 📚</h1>
        </div>

        <div className="flex gap-5">
          <div className="relative flex w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search />
            </span>
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              setSelectedBook(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
          >
            <Plus size={18} />
            Add Book
          </button>
        </div>
      </div>

      {/* Book List */}
      {loading ? (
        <p className="text-gray-500">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-400 text-center">no books have been written yet</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {books
            .filter((book) => book.title.toLowerCase().includes(searchQuery.toLowerCase()) || (book.author || "unknown").toLowerCase().includes(searchQuery.toLowerCase()))
            .map((book) => {
              const isOpen = openDropdowns[book.id] || false;

              return (
                <div key={book.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition flex flex-col relative">
                  {/* Dropdown Button */}
                  <div className="absolute top-2 right-2 z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdowns((prev) => ({ ...prev, [book.id]: !prev[book.id] }));
                      }}
                      className="bg-black/40 hover:bg-black/60 rounded-full text-white cursor-pointer"
                    >
                      <Ellipsis size={25} />
                    </button>

                    {isOpen && (
                      <div className="absolute right-0 w-28 bg-white border border-purple-600 rounded-lg shadow-lg flex flex-col z-30 overflow-hidden">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBook(book);
                            setModalOpen(true);
                            setOpenDropdowns((prev) => ({ ...prev, [book.id]: false }));
                          }}
                          className="px-3 py-2 hover:bg-gray-200 text-left text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(book.id);
                            setOpenDropdowns((prev) => ({ ...prev, [book.id]: false }));
                          }}
                          className="px-3 py-2 hover:bg-gray-200 text-left text-sm text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Book Cover */}
                  <div
                    className="relative h-64 w-full cursor-pointer"
                    onClick={() => {
                      setDetailBook(book);
                      setSelectedBook(null);
                    }}
                  >
                    <Image src={book.coverImage || "/book-covers/placeholder.jpg"} alt={book.title} fill className="object-contain" />
                  </div>

                  {/* Card Info */}
                  <div className="p-3 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="font-semibold text-lg truncate">{book.title}</h3>
                      <p className="text-sm text-gray-500">{book.author || "Unknown"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Modals */}
      <BookFormModal show={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} initialData={selectedBook} loading={uploading} />
      <BookDetailModal book={detailBook} onClose={() => setDetailBook(null)} />
    </div>
  );
}
