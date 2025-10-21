"use client";
import { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function RescheduledPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);

  const fetchRescheduled = async () => {
    try {
      const { data } = await api.get("/bookings", { params: { status: "RESCHEDULED" } });
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRescheduled();
  }, []);

  // if (loading) return <p className="p-6 text-center text-gray-600">Memuat data...</p>;
  // if (!bookings.length) return <p className="p-6 text-center text-gray-500">No rescheduled bookings found.</p>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
          <ArrowLeft size={27} />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">Rescheduled Bookings</h2>
      </div>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No rescheduled bookings found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-md shadow-md overflow-hidden">
              <Image src={b.service?.coverImage || "/default-book.jpg"} alt={b.service?.title || "Book Cover"} width={300} height={400} className="w-full h-60 object-cover" />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg text-gray-800 truncate">{b.service?.title}</h3>
                <p className="text-sm text-gray-500">{b.service?.author || "-"}</p>
                <p className="text-sm text-gray-600 mt-1">Rp. {b.service?.price?.toLocaleString("id-ID") || "-"}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(b.slot.startTime).toLocaleDateString("id-ID")} - {new Date(b.slot.endTime).toLocaleDateString("id-ID")}
                </p>
                <p className="mt-3 bg-pink-200 text-pink-700 text-sm font-semibold py-1 px-3 rounded-full inline-block">{b.status}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
