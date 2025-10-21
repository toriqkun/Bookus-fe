"use client";
import { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function UserCompletedPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompleted() {
      try {
        const { data } = await api.get("/bookings");
        const userBookings = data.bookings || data;
        const completed = userBookings.filter((b: any) => b.status === "COMPLETED");
        setBookings(completed);
      } catch (err) {
        console.error("❌ Gagal mengambil data:", err);
      }
    }
    fetchCompleted();
  }, []);

  return (
    <main className="p-8 min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
          <ArrowLeft size={27} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Completed Books</h1>
      </div>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No loans have been completed yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
              <div className="relative w-full h-62">
                <Image src={b.service?.coverImage || "/book-covers/placeholder.jpg"} alt={b.service?.title || ""} fill className="object-cover" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">{b.service?.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{b.service?.author}</p>
                <p className="text-xs text-gray-500">
                  {new Date(b.slot?.startTime).toLocaleDateString("id-ID")} → {new Date(b.slot?.endTime).toLocaleDateString("id-ID")}
                </p>
                <span className="inline-block mt-2 text-xs font-medium bg-green-200 text-green-700 px-4 py-1 rounded-full">COMPLETED</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
