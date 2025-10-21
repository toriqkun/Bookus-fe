// "use client";
// import { useEffect, useState } from "react";
// import api from "@/app/utils/axios";
// import Image from "next/image";

// export default function ConfirmUserPage() {
//   const [bookings, setBookings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchConfirm = async () => {
//       try {
//         const { data } = await api.get("/bookings", { params: { status: "CONFIRMED" } });
//         setBookings(data.bookings || []);
//       } catch (err) {
//         console.error("❌ Gagal ambil data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchConfirm();
//   }, []);

//   const handleUserConfirm = async (id: string) => {
//     try {
//       await api.patch(`/bookings/status/${id}`, { status: "BORROWED" });
//       setBookings((prev) => prev.filter((b) => b.id !== id));
//       alert("📚 Buku berhasil dikonfirmasi diambil!");
//     } catch (err) {
//       console.error("❌ Gagal konfirmasi:", err);
//     }
//   };

//   if (loading) return <p className="p-6 text-center text-gray-600">Memuat data...</p>;
//   if (!bookings.length) return <p className="p-6 text-center text-gray-500">Tidak ada booking yang dikonfirmasi admin.</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-6">📘 Buku Siap Diambil</h2>
//       <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
//         {bookings.map((b) => (
//           <div key={b.id} className="bg-white rounded-md shadow-sm hover:shadow-md transition transform hover:scale-[1.02] overflow-hidden border-2 border-green-300">
//             <div className="relative h-64 w-full">
//               <Image src={b.service?.coverImage || "/default-book.jpg"} alt={b.service?.title || "Book Cover"} fill className="object-cover" />
//             </div>
//             <div className="p-4 text-center">
//               <h3 className="font-semibold text-lg text-gray-800 truncate">{b.service?.title}</h3>
//               <p className="text-sm text-gray-500">{b.service?.author}</p>
//               <p className="text-xs text-gray-400 mt-1">
//                 {new Date(b.slot.startTime).toLocaleDateString("id-ID")} - {new Date(b.slot.endTime).toLocaleDateString("id-ID")}
//               </p>

//               <button onClick={() => handleUserConfirm(b.id)} className="mt-3 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md">
//                 Confirmed
//               </button>
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

interface Booking {
  id: string;
  service: { title: string; author?: string; coverImage?: string; price?: number };
  slot: { startTime: string; endTime: string };
  status: string;
  notes?: string;
  isCanceling?: boolean;
  isRescheduling?: boolean;
}

export default function ConfirmUserPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  // const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  const fetchConfirm = async () => {
    try {
      const { data } = await api.get("/bookings", { params: { status: "CONFIRMED" } });
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("❌ Gagal ambil data:", err);
    }
  };

  useEffect(() => {
    fetchConfirm();
  }, []);

  const handleCancelBooking = async (id: string) => {
    try {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, isCanceling: true } : b)));

      await api.patch(`/bookings/cancel/${id}`, { cancelReason });
      toast.success("Successfully canceled booking");

      setShowCancelModal(false);
      setSelectedBooking(null);

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, isCanceling: false } : b)));
    }
  };

  const handleRescheduleBooking = async (id: string) => {
    try {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, isRescheduling: true } : b)));

      await api.patch(`/bookings/reschedule/${id}`, {
        newStartDate: newStart,
        newEndDate: newEnd || null,
        notes: selectedBooking?.notes || "-",
      });
      toast.success("Successfully rescheduled booking");

      setShowReschedule(false);
      setSelectedBooking(null);

      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reschedule");
    } finally {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, isRescheduling: false } : b)));
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
          <ArrowLeft size={27} />
        </button>
        <h2 className="text-2xl font-semibold">Confirmed Bookings</h2>
      </div>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No confirmed bookings found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {bookings.map((b) => (
            <div key={b.id} className="relative">
              {(b.isCanceling || b.isRescheduling) && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-xs text-gray-700 font-medium z-10">
                  {b.isCanceling ? "Waiting for admin confirmation (cancel)" : "Waiting for admin confirmation (reschedule)"}
                </div>
              )}
              <div
                onClick={() => setSelectedBooking(b)}
                className={`cursor-pointer bg-white rounded-md shadow-sm hover:shadow-md transition transform hover:scale-[1.02] overflow-hidden ${
                  b.isCanceling || b.isRescheduling ? "opacity-60" : ""
                }`}
              >
                <Image src={b.service?.coverImage || "/default-book.jpg"} alt={b.service?.title || "Book Cover"} width={300} height={400} className="w-full h-60 object-cover" />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{b.service?.title}</h3>
                  <p className="text-sm text-gray-500">{b.service?.author || "-"}</p>
                  <p className="text-sm text-gray-600 mt-1">Rp. {b.service?.price?.toLocaleString("id-ID") || "-"}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(b.slot.startTime).toLocaleDateString("id-ID")} - {new Date(b.slot.endTime).toLocaleDateString("id-ID")}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">{b.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail Booking */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] md:w-[500px] rounded-xl shadow-lg p-6 relative">
            <button onClick={() => setSelectedBooking(null)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer">
              <X size={27} />
            </button>

            <h2 className="text-xl font-semibold text-center mb-4">Booking Details</h2>

            <div className="flex flex-col items-center">
              <div className="relative w-40 h-56 mb-4 rounded-md overflow-hidden shadow">
                <Image src={selectedBooking.service?.coverImage || "/default-book.jpg"} alt={selectedBooking.service?.title || "Book Cover"} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 text-center">{selectedBooking.service?.title}</h3>
              <p className="text-gray-600 mb-2">{selectedBooking.service?.author || "Unknown Author"}</p>
              {/* <p className="text-purple-600 font-semibold mb-2">Rp. {selectedBooking.service?.price?.toLocaleString("id-ID") || "-"}</p>

              <p className="text-sm text-gray-600 mb-4">
                {new Date(selectedBooking.slot.startTime).toLocaleDateString("id-ID")} - {new Date(selectedBooking.slot.endTime).toLocaleDateString("id-ID")}
              </p> */}
              <div className="w-full mt-3 pt-3 text-gray-700 space-y-2">
                <p className="flex">
                  <span className="w-35 font-medium">Price</span>
                  <span>: {selectedBooking.service?.price?.toLocaleString("id-ID") || "-"}</span>
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

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCancelModal(true);
                    setCancelReason("");
                  }}
                  className="px-4 py-2 border border-gray-400 text-gray-800 rounded-md hover:bg-gray-200 cursor-pointer"
                >
                  Cancel Booking
                </button>
                <button onClick={() => setShowReschedule(true)} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 cursor-pointer">
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cancel Reason */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-[400px] relative">
            <button onClick={() => setShowCancelModal(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold cursor-pointer">
              <X size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">Cancel Booking</h3>

            <label className="block text-sm font-medium text-gray-600 mb-1">Reason for Cancellation</label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Write your reason..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 resize-none h-24"
            />

            <div className="text-center mt-4">
              <button
                onClick={() => handleCancelBooking(selectedBooking.id)}
                disabled={!cancelReason.trim()}
                className={`px-4 py-2 rounded-md text-white transition ${cancelReason.trim() ? "bg-purple-600 hover:bg-purple-700 cursor-pointer" : "bg-purple-400 cursor-not-allowed"}`}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Reschedule (tidak berubah) */}
      {showReschedule && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 w-[400px] relative">
            <button onClick={() => setShowReschedule(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold">
              <X size={24} />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">Reschedule Booking</h3>

            <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
            <input type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3" />

            <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
            <input type="date" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowReschedule(false)} className="px-4 py-2 border border-gray-300 text-gray-800 rounded-md hover:bg-gray-200">
                Cancel
              </button>
              <button onClick={() => handleRescheduleBooking(selectedBooking.id)} className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
