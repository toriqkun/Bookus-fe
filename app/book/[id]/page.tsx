// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import api from "@/app/utils/axios";
// import { Star } from "lucide-react";

// export default function BookDetailPage() {
//   const { id } = useParams();
//   const [book, setBook] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [tab, setTab] = useState<"description" | "specification">("description");
//   const [favorite, setFavorite] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [maxEndDate, setMaxEndDate] = useState("");
//   const [totalPrice, setTotalPrice] = useState(0);

//   useEffect(() => {
//     if (!id) return;
//     const fetchBook = async () => {
//       try {
//         const res = await api.get(`/books/services/${id}`);
//         setBook(res.data.data);
//       } catch (error) {
//         console.error("Gagal ambil detail buku:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBook();
//   }, [id]);

//   useEffect(() => {
//     if (book && startDate) {
//       const start = new Date(startDate);
//       const end = new Date(start);
//       end.setDate(start.getDate() + (book.durationDays || 1));
//       setMaxEndDate(end.toISOString().split("T")[0]);
//     }
//   }, [startDate, book]);

//   const handleBooking = async () => {
//     try {
//       if (!startDate || !endDate) {
//         alert("Silakan pilih tanggal mulai dan selesai!");
//         return;
//       }

//       const res = await api.post("/bookings", {
//         serviceId: book.id,
//         startDate,
//         endDate,
//       });

//       alert(res.data.message || "Booking berhasil dibuat!");
//       setShowModal(false);
//     } catch (err: any) {
//       console.error("Gagal booking:", err);
//       alert(err.response?.data?.message || "Gagal melakukan booking.");
//     }
//   };

//   if (loading) return <div className="p-10 text-center">Loading book details...</div>;
//   if (!book) return <div className="p-10 text-center text-red-500">Buku tidak ditemukan</div>;

//   return (
//     <main className="h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 px-35 pb-20 pt-15">
//       <div className="mx-auto overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0">
//         {/* Left: Cover Image */}
//         <div className="relative w-full max-w-[410px] h-[560px] mx-auto rounded-md overflow-hidden">
//           <Image src={book.coverImage || "/default-book.jpg"} alt={book.title} fill className="object-cover p-5" />
//         </div>

//         {/* Right: Book Info */}
//         <div className="px-4 md:px-15 flex flex-col">
//           <h1 className="text-3xl font-bold mb-5">{book.title}</h1>

//           {/* Tabs */}
//           <div className="flex mb-7 bg-gray-300 rounded-md">
//             <button
//               onClick={() => setTab("description")}
//               className={`w-full m-1 py-[5px] px-3 font-medium ${tab === "description" ? "bg-purple-500 text-white rounded-md items-center" : "text-gray-500"}`}
//             >
//               Description
//             </button>
//             <button
//               onClick={() => setTab("specification")}
//               className={`w-full m-1 py-[5px] px-3 font-medium ${tab === "specification" ? "border-b-2 bg-purple-500 text-white rounded-md items-center" : "text-gray-500"}`}
//             >
//               Specification
//             </button>
//           </div>

//           {/* Tab Content */}
//           <div className="flex-1 overflow-y-auto px-3">
//             {tab === "description" ? (
//               <p className="text-gray-700 text-lg [text-indent:1.5rem] leading-relaxed whitespace-pre-line">{book.description || "No description available."}</p>
//             ) : (
//               <div className="space-y-4 text-gray-700">
//                 <p className="text-lg">
//                   <span className="font-semibold w-40 inline-block">Author</span>: {book.author || "Unknown"}
//                 </p>
//                 <p className="text-lg">
//                   <span className="font-semibold w-40 inline-block">ISBN</span>: {book.isbn || "-"}
//                 </p>
//                 <p className="text-lg">
//                   <span className="font-semibold w-40 inline-block">Genre</span>: {book.genre || "-"}
//                 </p>
//                 <p className="text-lg">
//                   <span className="font-semibold w-40 inline-block">Pages</span>: {book.totalPages || "-"}
//                 </p>
//                 <p className="text-lg">
//                   <span className="font-semibold w-40 inline-block">Copies</span>: {book.copies || "-"}
//                 </p>
//                 <p className="text-lg">
//                   <span className="font-semibold w-40 inline-block">Borrow Limit</span>: {book.durationDays ? `${book.durationDays} Days` : "-"}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Bottom section */}
//           <div className="mt-8 items-center">
//             <div>
//               <p className="text-3xl text-end font-semibold text-gray-800 mb-4">${book.price ? book.price.toLocaleString("id-ID") : "0"}/Day</p>
//             </div>

//             <div className="flex gap-3">
//               {/* Favorite button */}
//               <button
//                 onClick={() => setFavorite(!favorite)}
//                 className={`p-3 rounded-lg border ${favorite ? "bg-yellow-400 border-purple-500 text-white" : "hover:bg-gray-200 border-purple-500 text-gray-600 cursor-pointer"} transition`}
//               >
//                 <Star className={`w-5 h-5 ${favorite ? "fill-yellow-500" : ""}`} />
//               </button>

//               {/* Booking button */}
//               <button onClick={() => setShowModal(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium px-6 py-1 rounded-lg transition cursor-pointer">
//                 Booking Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Modal Booking */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
//             <h2 className="text-xl font-semibold mb-4 text-center">Booking "{book.title}"</h2>

//             <label className="block mb-3">
//               <span className="text-sm font-medium text-gray-700">Start Date</span>
//               <input
//                 type="date"
//                 min={new Date().toISOString().split("T")[0]}
//                 className="w-full border rounded-md px-3 py-2 mt-1"
//                 value={startDate}
//                 onChange={(e) => {
//                   setStartDate(e.target.value);
//                   setEndDate(""); // reset endDate setiap ganti start
//                 }}
//               />
//             </label>

//             <label className="block mb-3">
//               <span className="text-sm font-medium text-gray-700">End Date</span>
//               <input
//                 type="date"
//                 className="w-full border rounded-md px-3 py-2 mt-1"
//                 value={endDate}
//                 min={startDate || ""}
//                 max={maxEndDate || ""}
//                 disabled={!startDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//               />
//             </label>

//             <div className="flex justify-between items-center mb-4">
//               <p className="text-gray-600">Total Price</p>
//               <p className="text-lg font-semibold text-purple-700">{totalPrice ? `$${totalPrice.toLocaleString("id-ID")}` : "-"}</p>
//             </div>

//             <div className="flex justify-end gap-3">
//               <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
//                 Cancel
//               </button>
//               <button onClick={handleBooking} disabled={!startDate || !endDate} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50">
//                 Confirm Booking
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/app/utils/axios";
import { Star, Info, ArrowLeft } from "lucide-react";
import { socket } from "@/app/utils/socket";
import toast from "react-hot-toast";
import useAuth from "@/app/utils/useAuth";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth(false);

  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"description" | "specification">("description");
  const [favorite, setFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxEndDate, setMaxEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/services/${id}`);
        setBook(res.data.data);
      } catch (error) {
        console.error("Gagal ambil detail buku:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    socket.on("service:copiesUpdated", (data) => {
      if (book && data.serviceId === book.id) {
        setBook((prev: any) => ({
          ...prev,
          copies: data.updatedCopies,
        }));
      }
    });

    return () => {
      socket.off("service:copiesUpdated");
    };
  }, [book]);

  useEffect(() => {
    if (book && startDate) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(start.getDate() + (book.durationDays || 1));

      const endStr = end.toISOString().split("T")[0];
      setMaxEndDate(endStr);

      setEndDate((prev) => prev || endStr);
    }
  }, [startDate, book]);

  useEffect(() => {
    if (book) {
      setTotalPrice(book.price || 0);
    }
  }, [book]);

  const handleOpenBooking = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setShowModal(true);
  };

  const handleBooking = async () => {
    try {
      if (!user) {
        setShowLoginModal(true);
        return;
      }

      if (!startDate) {
        // alert("Silakan pilih tanggal mulai!");
        return;
      }

      const res = await api.post("/bookings", {
        serviceId: book.id,
        startDate,
        endDate: endDate || null,
        notes: notes.trim() || null,
      });

      toast.success(`Successfully booked the "${book.title}" book`);
      setShowModal(false);

      setBook((prev: any) => ({
        ...prev,
        copies: prev.copies > 0 ? prev.copies - 1 : 0,
      }));

      setStartDate("");
      setEndDate("");
      setNotes("");
      setTotalPrice(0);
    } catch (err: any) {
      console.error("Gagal booking:", err);
      toast.error(err.response?.data?.message || "Failed to create booking.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading book details...</div>;
  if (!book) return <div className="p-10 text-center text-red-500">Books not found.</div>;

  return (
    <main className="h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 px-35 pb-20 pt-8">
      <div className="mb-6">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 ml-1 cursor-pointer">
          <ArrowLeft size={30} />
          <span className="text-3xl font-medium">BACK</span>
        </button>
      </div>
      <div className="mx-auto overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0">
        {/* Left: Cover Image */}
        <div className="relative w-full max-w-[410px] h-[560px] mx-auto rounded-md overflow-hidden">
          <Image src={book.coverImage || "/default-book.jpg"} alt={book.title} fill className="object-cover p-5" />
        </div>

        {/* Right: Book Info */}
        <div className="px-4 md:px-15 flex flex-col">
          <h1 className="text-3xl font-bold mb-5">{book.title}</h1>

          {/* Tabs */}
          <div className="flex mb-7 bg-gray-300 rounded-md">
            <button onClick={() => setTab("description")} className={`w-full m-1 py-[5px] px-3 font-medium ${tab === "description" ? "bg-purple-500 text-white rounded-md" : "text-gray-500"}`}>
              Description
            </button>
            <button onClick={() => setTab("specification")} className={`w-full m-1 py-[5px] px-3 font-medium ${tab === "specification" ? "bg-purple-500 text-white rounded-md" : "text-gray-500"}`}>
              Specification
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto px-3">
            {tab === "description" ? (
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">{book.description || "No description available."}</p>
            ) : (
              <div className="space-y-4 text-gray-700">
                <p>
                  <span className="font-semibold w-40 inline-block">Author</span>: {book.author || "Unknown"}
                </p>
                <p>
                  <span className="font-semibold w-40 inline-block">Genre</span>: {book.genre || "-"}
                </p>
                <p>
                  <span className="font-semibold w-40 inline-block">ISBN</span>: {book.isbn || "-"}
                </p>
                <p>
                  <span className="font-semibold w-40 inline-block">Copies</span>: {book.copies || "-"}
                </p>
                <p>
                  <span className="font-semibold w-40 inline-block">Total Pages</span>: {book.totalPages || "-"}
                </p>
                <p>
                  <span className="font-semibold w-40 inline-block">Borrow Limit</span>: {book.durationDays ? `${book.durationDays} Days` : "-"}
                </p>
              </div>
            )}
          </div>

          {/* Bottom section */}
          <div className="mt-8 items-center">
            <p className="text-3xl text-end font-semibold text-gray-800 mb-4">Rp. {book.price ? book.price.toLocaleString("id-ID") : "0"}</p>
            <div className="flex gap-3">
              {/* Favorite button */}
              {/* <button
                onClick={() => setFavorite(!favorite)}
                className={`p-3 rounded-lg border ${favorite ? "bg-yellow-400 border-purple-500 text-white" : "hover:bg-gray-200 border-purple-500 text-gray-600"} transition`}
              >
                <Star className={`w-5 h-5 ${favorite ? "fill-yellow-500" : ""}`} />
              </button> */}

              {/* Booking button */}
              <button onClick={handleOpenBooking} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium px-6 py-2 rounded-lg transition cursor-pointer">
                Booking Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Booking */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[400px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-center">Booking "{book.title}"</h2>

            {/* Start Date */}
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">Start Date</span>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                className="w-full border rounded-md px-3 py-2 mt-1"
                value={startDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setStartDate(value);

                  if (book?.durationDays) {
                    const start = new Date(value);
                    const end = new Date(start);
                    end.setDate(start.getDate() + book.durationDays);

                    const endStr = end.toISOString().split("T")[0];
                    setMaxEndDate(endStr);

                    setEndDate(endStr);
                  }
                }}
              />
            </label>

            {/* End Date */}
            <label className="block mb-3">
              <span className="text-sm font-medium text-gray-700">End Date (optional)</span>
              <input
                type="date"
                className="w-full border rounded-md px-3 py-2 mt-1"
                value={endDate}
                min={startDate || ""}
                max={maxEndDate || ""}
                disabled={!startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>

            {/* Notes */}
            <label className="block mb-4">
              <span className="text-sm font-medium text-gray-700">Notes (optional)</span>
              <textarea
                className="w-full border rounded-md px-3 py-2 mt-1 resize-none"
                rows={3}
                placeholder="Add your notes here (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </label>

            {/* Total Price */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-purple-700 font-medium">Total Price</p>
              <p className="text-lg font-semibold text-gray-700">{book.price ? `Rp. ${book.price.toLocaleString("id-ID")}` : "-"}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-purple-500 rounded-md hover:bg-gray-200 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleBooking} disabled={!startDate} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 cursor-pointer">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-xl w-[360px] text-center">
            <p className=" px-3 flex gap-1 items-center text-gray-700 border-b">
              <span className="text-gray-900 text-lg font-medium">Information</span>
              <Info size={15} className="mt-[1px]" />
            </p>
            <div className="py-2 px-3">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800 py-8">Please login first!</h3>
              <button onClick={() => router.push("/login")} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-lg cursor-pointer">
                OKE
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
