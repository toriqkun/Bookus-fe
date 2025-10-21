// "use client";
// import { useEffect, useState } from "react";
// import api from "@/app/utils/axios";
// import Image from "next/image";

// export default function PendingAdminPage() {
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedBooking, setSelectedBooking] = useState<any>(null);

//   useEffect(() => {
//     const fetchPending = async () => {
//       try {
//         const { data } = await api.get("/bookings/all", { params: { status: "PENDING" } });
//         setBookings(data.data || []);
//       } catch (err) {
//         console.error("❌ Gagal ambil data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPending();
//   }, []);

//   const handleConfirm = async (id: string) => {
//     try {
//       await api.patch(`/bookings/status/${id}`, { status: "CONFIRMED" });
//       setBookings((prev) => prev.filter((b) => b.id !== id));
//       setSelectedBooking(null);
//     } catch (err) {
//       alert("Gagal konfirmasi booking");
//       console.error(err);
//     }
//   };

//   const handleCancel = async (id: string) => {
//     try {
//       await api.patch(`/bookings/status/${id}`, {
//         status: "CANCELED",
//         cancelReason: "Dibatalkan oleh admin",
//       });
//       setBookings((prev) => prev.filter((b) => b.id !== id));
//       setSelectedBooking(null);
//     } catch (err) {
//       alert("Gagal membatalkan booking");
//       console.error(err);
//     }
//   };

//   if (loading) return <p className="p-6 text-center text-gray-600">Memuat data...</p>;
//   if (!bookings.length) return <p className="p-6 text-center text-gray-500">Tidak ada booking pending.</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-6">🕓 Pending Booking User</h2>
//       <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
//         {bookings.map((b) => (
//           <div key={b.id} className="bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition flex flex-col relative">
//             {/* Cover */}
//             <div className="relative h-64 w-full">
//               <Image src={b.service?.coverImage || "/default-book.jpg"} alt={b.service?.title || "Book"} fill className="object-cover" />
//             </div>

//             {/* Info */}
//             <div className="p-3 flex flex-col justify-between flex-grow">
//               <div>
//                 <h3 className="font-semibold text-lg truncate">{b.service?.title}</h3>
//                 <p className="text-sm text-gray-500">User: {b.user?.name || "-"}</p>
//                 {b.slot && (
//                   <p className="text-xs text-gray-400 mt-1">
//                     {new Date(b.slot.startTime).toLocaleDateString("id-ID", {
//                       day: "2-digit",
//                       month: "2-digit",
//                       year: "numeric",
//                     })}{" "}
//                     -{" "}
//                     {new Date(b.slot.endTime).toLocaleDateString("id-ID", {
//                       day: "2-digit",
//                       month: "2-digit",
//                       year: "numeric",
//                     })}
//                   </p>
//                 )}
//               </div>
//               <div className="flex gap-2 mt-3">
//                 <button onClick={() => handleConfirm(b.id)} className="w-full py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200">
//                   Confirm
//                 </button>
//                 <button onClick={() => handleCancel(b.id)} className="w-full py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import toast from "react-hot-toast";

export default function PendingAdminPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const { data } = await api.get("/bookings/all", { params: { status: "PENDING" } });
        setBookings(data.data || []);
      } catch (err) {
        console.error("❌ Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleConfirm = async (id: string) => {
    try {
      await api.patch(`/bookings/status/${id}`, { status: "CONFIRMED" });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setSelectedBooking(null);
      toast.success("Successfully confirmed booking");
    } catch (err) {
      toast.error("Failed to confirm booking");
      console.error(err);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/bookings/status/${id}`, {
        status: "CANCELED",
        cancelReason,
      });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setSelectedBooking(null);
      setShowCancelModal(false);
      setCancelReason("");
      toast.success("Successfully canceled the booking");
    } catch (err) {
      toast.error("Failed canceled the booking");
      console.error(err);
    }
  };

  // if (loading) return <p className="p-6 text-center text-gray-600">Memuat data...</p>;
  // if (!bookings.length) return <p className="p-6 text-center text-gray-500">No pending books.</p>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
          <ArrowLeft size={27} />
        </button>
        <h1 className="text-2xl font-bold">Pending Booking User 🕒</h1>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Load data...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No pending books.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {bookings.map((b) => (
            <div key={b.id} onClick={() => setSelectedBooking(b)} className="cursor-pointer bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.02]">
              <div className="relative h-64 w-full">
                <Image src={b.service?.coverImage || "/default-book.jpg"} alt={b.service?.title || "Book"} fill className="object-cover" />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-lg truncate">{b.service?.title}</h3>
                <p className="text-sm text-gray-500">User: {b.user?.name || "-"}</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-medium">{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 MODAL DETAIL BOOKING */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] md:w-[500px] rounded-xl shadow-lg p-6 relative">
            {/* Tombol close */}
            <button onClick={() => setSelectedBooking(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer">
              <X size={27} />
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold text-center mb-4">Detail Booking</h2>

            {/* Isi konten */}
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-56 mb-4 rounded-md overflow-hidden shadow">
                <Image src={selectedBooking.service?.coverImage || "/default-book.jpg"} alt={selectedBooking.service?.title || "Book Cover"} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center">{selectedBooking.service?.title}</h3>
              <p className="text-gray-600 mb-2">{selectedBooking.service?.author || "Unknown Author"}</p>
              <p className="text-purple-600 font-semibold mb-2">Rp. {selectedBooking.service?.price?.toLocaleString("id-ID") || "-"}</p>
              <div className="w-full mt-3 pt-3 text-gray-700 space-y-2">
                <p className="flex">
                  <span className="w-35 font-medium">User</span>
                  <span>
                    : {selectedBooking.user?.name} ({selectedBooking.user?.email})
                  </span>
                </p>
                <p className="flex">
                  <span className="w-35 font-medium">Date</span>
                  <span>
                    : {new Date(selectedBooking.slot.startTime).toLocaleDateString("id-ID")} - {new Date(selectedBooking.slot.endTime).toLocaleDateString("id-ID")}
                  </span>
                </p>
                <p className="flex">
                  <span className="w-35 font-medium">Notes</span> : {selectedBooking.notes || "-"}
                </p>
              </div>
            </div>

            {/* Tombol aksi */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCancelModal(true);
                }}
                className="px-4 py-2 border border-purple-500 text-gray-800 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                Cancel Booking
              </button>
              <button onClick={() => handleConfirm(selectedBooking.id)} className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 cursor-pointer">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[380px] p-6 rounded-xl shadow-lg relative">
            <button onClick={() => setShowCancelModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer">
              <X size={25} />
            </button>
            <h3 className="text-lg font-semibold mb-3">Cancel Reason</h3>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Write the reason for cancellation..."
              className="w-full border rounded-md p-2 text-sm resize-none focus:outline-none"
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => handleCancel(selectedBooking.id)}
                disabled={!cancelReason.trim()}
                className={`px-4 py-2 rounded-md text-white transition ${cancelReason.trim() ? "bg-purple-600 hover:bg-purple-700 cursor-pointer" : "bg-purple-400 cursor-not-allowed"}`}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
