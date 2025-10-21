"use client";
import { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import Image from "next/image";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

interface Booking {
  id: string;
  user: { name: string };
  service: { title: string; coverImage?: string; price?: number };
  slot: { startTime: string; endTime: string };
  cancelReason?: string;
  status?: string;
}

export default function AdminCancelRequestsPage() {
  const [requests, setRequests] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCancelRequests = async () => {
    try {
      const { data } = await api.get("/bookings/all", { params: { status: "CANCELED" } });
      setRequests(data.data || []);
    } catch {
      toast.error("Gagal ambil data cancel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCancelRequests();
  }, []);

  // if (loading) return <p className="text-center py-6 text-gray-500">Loading...</p>;
  // if (!requests.length) return <p className="text-center py-6 text-gray-500">No cancellation data.</p>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
          <ArrowLeft size={27} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">Canceled Bookings</h2>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">Load data...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 text-center">No booking cancellation list.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {requests.map((r) => (
            <div key={r.id} className="bg-white shadow hover:shadow-lg rounded-md overflow-hidden">
              <div className="relative w-full h-58">
                <Image src={r.service.coverImage || "/default-book.jpg"} alt={r.service.title} fill className="object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-lg">{r.service.title}</h3>
                <p className="text-sm text-gray-600 mb-2">User: {r.user.name}</p>
                <p className="text-sm text-gray-600 mb-2">Price: Rp. {r.service.price?.toLocaleString("id-ID")}</p>
                <p className="text-xs text-gray-500 italic mb-4">Reason: {r.cancelReason}</p>

                {/* Status badge */}
                <p className="text-center text-red-700 bg-red-100 border border-red-300 py-1 rounded-full font-medium">{r.status || "CANCELED"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
