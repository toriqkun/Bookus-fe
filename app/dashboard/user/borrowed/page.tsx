"use client";
import { useEffect, useState } from "react";
import api from "@/app/utils/axios";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

interface Booking {
  id: string;
  book: { title: string; coverImage?: string };
  startDate: string;
  endDate: string;
  service: { title: string; author: string; coverImage?: string };
  slot: { startTime: string; endTime: string };
}

export default function BorrowedUserPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  // const [loading, setLoading] = useState(true);
  const [timers, setTimers] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchBorrowed = async () => {
      try {
        const { data } = await api.get("/bookings", { params: { status: "BORROWED" } });
        setBookings(data.bookings || []);

        const initialTimers: Record<string, number> = {};
        (data.bookings || []).forEach((b: Booking) => {
          const now = new Date().getTime();
          const end = new Date(b.slot.endTime).getTime();
          initialTimers[b.id] = Math.max(Math.floor((end - now) / 1000), 0);
        });
        setTimers(initialTimers);
      } catch (err) {
        console.error("❌ Gagal ambil data:", err);
      }
    };
    fetchBorrowed();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated: Record<string, number> = {};
        Object.keys(prev).forEach((id) => {
          updated[id] = Math.max(prev[id] - 1, 0);
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d > 0 ? d + "d " : ""}${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // if (loading) return <p className="p-6 text-center text-gray-600">Memuat data...</p>;
  // if (!bookings.length) return <p className="p-6 text-center text-gray-500">Belum ada buku yang sedang dipinjam.</p>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => window.history.back()} className="ml-1 cursor-pointer">
          <ArrowLeft size={27} />
        </button>
        <h2 className="text-2xl font-semibold">Books borrowed 📚</h2>
      </div>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">There are no books to borrow yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {bookings.map((b) => {
            const timer = timers[b.id] || 0;
            return (
              <div key={b.id} className="bg-white rounded-md shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image src={b.service?.coverImage || "/default-book.jpg"} alt={b.service?.title || "Book Cover"} fill className="object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{b.service?.title}</h3>
                  <p className="text-sm text-gray-600 truncate mb-2">{b.service?.author}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(b.slot.startTime).toLocaleDateString("id-ID")} - {new Date(b.slot.endTime).toLocaleDateString("id-ID")}
                  </p>
                  <p className="text-xs text-red-500 mt-2">Remaining time: {formatTimer(timer)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
