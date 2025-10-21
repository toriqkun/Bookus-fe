"use client";
import { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function AdminCompletedPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompleted() {
      try {
        const { data } = await api.get("/bookings/all", {
          params: { status: "COMPLETED" },
        });
        setBookings(data.data || []);
      } catch (err) {
        console.error("❌ Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompleted();
  }, []);

return (
  <div className="p-6">
    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
      <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
        <ArrowLeft size={27} />
      </button>
      <h1 className="text-2xl font-bold">Completed Bookings</h1>
    </div>

    {/* Daftar Booking */}
    {loading ? (
      <p className="text-gray-500 text-center">Load data...</p>
    ) : bookings.length === 0 ? (
      <p className="text-gray-500 text-center">No completed bookings yet.</p>
    ) : (
      <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="cursor-pointer bg-white rounded-md shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-[1.02]"
          >
            <div className="relative h-64 w-full">
              <Image
                src={b.service?.coverImage || "/book-covers/placeholder.jpg"}
                alt={b.service?.title || "Book"}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="font-semibold text-lg truncate">{b.service?.title}</h3>
              <p className="text-sm text-gray-500">User: {b.user?.name || "-"}</p>
              {b.slot && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(b.slot.startTime).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  -{" "}
                  {new Date(b.slot.endTime).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              )}
              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                COMPLETED
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}
