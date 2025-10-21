// "use client";
// import { useEffect, useState } from "react";
// import api from "@/app/utils/axios";
// import Image from "next/image";
// import toast from "react-hot-toast";
// import { Check, Loader2, Calendar, ArrowLeft } from "lucide-react";

// interface Booking {
//   id: string;
//   user: { name: string };
//   service: { title: string; coverImage?: string; price?: number };
//   slot: { startTime: string; endTime: string };
//   notes?: string;
//   newStartDate?: string;
//   newEndDate?: string;
// }

// export default function AdminRescheduleRequestsPage() {
//   const [requests, setRequests] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState<string | null>(null);

//   const fetchReschedules = async () => {
//     try {
//       const { data } = await api.get("/bookings/all", { params: { status: "RESCHEDULED" } });
//       setRequests(data.data || []);
//     } catch {
//       toast.error("Gagal ambil data reschedule");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchReschedules();
//   }, []);

//   const handleApprove = async (id: string) => {
//     try {
//       setProcessingId(id);
//       await api.patch(`/bookings/status/${id}`, { status: "CONFIRMED" });
//       toast.success("Reschedule confirmed");
//       setRequests((prev) => prev.filter((r) => r.id !== id));
//     } catch {
//       toast.error("Failed to confirm reschedule");
//     } finally {
//       setProcessingId(null);
//     }
//   };

//   // if (loading) return <p className="text-center py-6 text-gray-500">Loading reschedule requests...</p>;
//   // if (!requests.length) return <p className="text-center py-6 text-gray-500">Tidak ada permintaan reschedule.</p>;

//   return (
//     <div className="p-6">
//       <div className="flex items-center gap-4 mb-6">
//         <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
//           <ArrowLeft size={27} />
//         </button>
//         <h1 className="text-2xl font-bold">Reschedule Booking</h1>
//       </div>

//       {loading ? (
//         <p className="text-gray-500 text-center">Load data...</p>
//       ) : requests.length === 0 ? (
//         <p className="text-gray-500 text-center">No request for change of booking schedule.</p>
//       ) : (
//         <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//           {requests.map((r) => (
//             <div key={r.id} className="bg-white shadow rounded-xl overflow-hidden">
//               <div className="relative w-full h-58">
//                 <Image src={r.service.coverImage || "/default-book.jpg"} alt={r.service.title} fill className="object-cover" />
//               </div>
//               <div className="p-3 text-center">
//                 <h3 className="font-semibold text-lg">{r.service.title}</h3>
//                 <p className="text-sm text-gray-600 mb-2">User: {r.user.name}</p>
//                 {/* <p className="text-sm text-gray-600 mb-2">Price: Rp. {r.service.price?.toLocaleString("id-ID")}</p> */}
//                 <div className="text-sm text-gray-700 mb-3">
//                   <Calendar size={14} className="inline mr-1 text-green-500" />
//                   <span className="font-medium">New Schedule:</span> {r.newStartDate ? new Date(r.newStartDate).toLocaleDateString("id-ID") : "-"} →{" "}
//                   {r.newEndDate ? new Date(r.newEndDate).toLocaleDateString("id-ID") : "-"}
//                 </div>
//                 <p className="text-xs text-gray-500 italic mb-4">Notes: {r.notes || "-"}</p>

//                 <button
//                   onClick={() => handleApprove(r.id)}
//                   disabled={processingId === r.id}
//                   className="px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 w-full flex items-center justify-center"
//                 >
//                   {processingId === r.id ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Confirm
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { Check, Loader2, Calendar, ArrowLeft, X } from "lucide-react";

interface Booking {
  id: string;
  user: { name: string };
  service: { title: string; author: string; coverImage?: string; price?: number };
  slot: { startTime: string; endTime: string };
  notes?: string;
  newStartDate?: string;
  newEndDate?: string;
}

export default function AdminRescheduleRequestsPage() {
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Booking | null>(null);

  const fetchReschedules = async () => {
    try {
      const { data } = await api.get("/bookings/all", { params: { status: "RESCHEDULED" } });
      setRequests(data.data || []);
    } catch {
      toast.error("Gagal ambil data reschedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReschedules();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setProcessingId(id);
      await api.patch(`/bookings/status/${id}`, { status: "CONFIRMED" });
      toast.success("Reschedule confirmed");
      setRequests((prev) => prev.filter((r) => r.id !== id));
      setSelected(null);
    } catch {
      toast.error("Failed to confirm reschedule");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
          <ArrowLeft size={27} />
        </button>
        <h1 className="text-2xl font-bold">Reschedule Booking</h1>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Load data...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 text-center">No request for change of booking schedule.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {requests.map((r) => (
            <div key={r.id} onClick={() => setSelected(r)} className="bg-white shadow rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition">
              <div className="relative w-full h-64">
                <Image src={r.service.coverImage || "/default-book.jpg"} alt={r.service.title} fill className="object-cover" />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-xl">{r.service.title}</h3>
                <h3 className="text-sm mb-2">{r.service.author}</h3>
                <p className="text-sm text-gray-600 mb-1">User: {r.user.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Detail */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X size={22} />
            </button>

            <h2 className="text-xl font-semibold mb-4 text-center">Reschedule Detail</h2>
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-40 h-56 mb-3">
                <Image src={selected.service.coverImage || "/default-book.jpg"} alt={selected.service.title} fill className="object-cover rounded-lg" />
              </div>
              <h3 className="font-semibold text-xl">{selected.service.title}</h3>
              <p className="text-gray-500">{selected.service.author}</p>
            </div>

            {/* INFO GRID */}
            <div className="w-full mt-3 text-gray-700 space-y-2">
              <p className="flex">
                <span className="w-35 font-medium">User</span>
                <span>: {selected.user?.name}</span>
              </p>
              {/* <p className="flex">
                  <span className="w-35 font-medium">Date</span>
                  <span>
                    : {new Date(selected.slot.startTime).toLocaleDateString("id-ID")} - {new Date(selected.slot.endTime).toLocaleDateString("id-ID")}
                  </span>
                </p> */}
              <p className="flex">
                <span className="w-35 font-medium">Notes</span> : {selected.notes || "-"}
              </p>
            </div>

            <button
              onClick={() => handleApprove(selected.id)}
              disabled={processingId === selected.id}
              className="w-full bg-purple-600 text-white py-2.5 mt-5 rounded-md hover:bg-purple-700 flex items-center justify-center cursor-pointer"
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
