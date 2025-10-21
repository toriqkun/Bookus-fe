"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Book, ShoppingCart, CheckCircle, Clock, XCircle, Repeat, Archive, FileText } from "lucide-react";
import api from "@/app/utils/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { socket } from "@/app/utils/socket";

type User = {
  id: string;
  role: string;
  name?: string;
  avatarImage?: string;
};

type Service = {
  id: string;
  title: string;
  author?: string;
  coverImage?: string | null;
  isActive: boolean;
  createdAt: string;
};

type Booking = {
  id: string;
  userId: string;
  userName?: string;
  serviceId: string;
  serviceTitle?: string;
  status: string;
  createdAt: string;
};

interface AdminDashboardProps {
  user: User;
  // onLogout?: () => void;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activePanel, setActivePanel] = useState<string>("pending");

  const counts = useMemo(
    () => ({
      allBooks: services.length,
      activeBooks: services.filter((s) => s.isActive).length,
      statusBooks: services.filter((s) => s.isActive).length,
      pending: bookings.filter((b) => (b.status || "").toUpperCase() === "PENDING").length,
      canceled: bookings.filter((b) => (b.status || "").toUpperCase() === "CANCELED").length,
      rescheduled: bookings.filter((b) => (b.status || "").toUpperCase() === "RESCHEDULED").length,
      confirmed: bookings.filter((b) => (b.status || "").toUpperCase() === "CONFIRMED").length,
      borrowed: bookings.filter((b) => (b.status || "").toUpperCase() === "BORROWED").length,
      completed: bookings.filter((b) => (b.status || "").toUpperCase() === "COMPLETED").length,
    }),
    [bookings, services]
  );

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchServices(), fetchBookings()]);
  };

  const fetchServices = async () => {
    try {
      setLoadingServices(true);
      const { data } = await api.get("/books/services");
      setServices(data.data || data);
    } catch (err) {
      console.error("Failed fetching services", err);
    } finally {
      setLoadingServices(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const { data } = await api.get("/bookings/all", { params: { limit: 1500 } });
      console.log("📦 Raw bookings response:", data);
      const allBookings = data.data || data;

      console.log(
        "🧾 Sample status list:",
        allBookings.slice(0, 5).map((b: any) => b.status)
      );
      setBookings(allBookings);
    } catch (err) {
      console.error("Failed fetching bookings", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    socket.on("service:copiesUpdated", (data) => {
      setServices((prev) => prev.map((s) => (s.id === data.serviceId ? { ...s, copies: data.updatedCopies } : s)));
    });

    socket.on("booking:statusChanged", (data) => {
      setBookings((prev) => prev.map((b) => (b.id === data.bookingId ? { ...b, status: data.newStatus } : b)));
    });

    return () => {
      socket.off("service:copiesUpdated");
      socket.off("booking:statusChanged");
    };
  }, []);

  const handleRestoreBook = async (id: string) => {
    try {
      await api.patch(`/services/restore/${id}`);
      setServices((prev) => prev.map((s) => (s.id === id ? { ...s, isActive: true } : s)));
    } catch (err) {
      console.error("restore failed", err);
      alert("Gagal mengaktifkan kembali buku");
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/confirm`, { action: "confirm" });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "CONFIRMED" } : b)));
    } catch (err) {
      console.error("confirm booking failed", err);
      alert("Gagal mengkonfirmasi booking");
    }
  };

  const handleMarkBorrowed = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/confirm`, { action: "borrowed" });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "BORROWED" } : b)));
    } catch (err) {
      console.error(err);
      alert("Gagal menandai sebagai dipinjam");
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/confirm`, { action: "complete" });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "COMPLETED" } : b)));
    } catch (err) {
      console.error(err);
      alert("Gagal menyelesaikan booking");
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/cancel`, {
        reason: "Canceled by admin",
      });
      setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: "CANCELED" } : b)));
    } catch (err) {
      console.error(err);
      alert("Gagal membatalkan booking");
    }
  };

  const bookingsByStatus = (status: string) => bookings.filter((b) => b.status === status);

  function StatCard({ id, title, count, icon: Icon }: { id: string; title: string; count: number; icon: any }) {
    const active = activePanel === id;
    const router = useRouter();

    const handleClick = () => {
      if (id === "allBooks") {
        router.push("/dashboard/admin/books");
      } else if (id === "statusBooks") {
        router.push("/dashboard/admin/status-books");
      } else if (id === "pending") {
        router.push("/dashboard/admin/pending-booking");
      } else if (id === "confirmed") {
        router.push("/dashboard/admin/confirm-booking");
      } else if (id === "borrowed") {
        router.push("/dashboard/admin/borrow-books");
      } else if (id === "canceled") {
        router.push("/dashboard/admin/cancel-booking");
      } else if (id === "rescheduled") {
        router.push("/dashboard/admin/reschedule-booking");
      } else if (id === "completed") {
        router.push("/dashboard/admin/completed");
      } else {
        setActivePanel(id);
      }
    };

    return (
      <div
        onClick={handleClick}
        className={`cursor-pointer p-4 bg-white rounded-2xl shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.01] ${active ? "ring-2 ring-purple-200" : ""}`}
      >
        <div className="p-3 bg-purple-50 rounded-lg">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-semibold">{count}</p>
        </div>
      </div>
    );
  }

  function BookingRow({ booking }: { booking: Booking }) {
    return (
      <div className="flex items-center justify-between gap-4 p-3 border-b last:border-b-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-16 bg-gray-100 rounded-md overflow-hidden relative">
            <Image src={(booking as any).serviceCover || "/book-covers/placeholder.jpg"} alt="" fill style={{ objectFit: "cover" }} />
          </div>
          <div>
            <p className="font-medium text-sm">{booking.serviceTitle || "Unknown Book"}</p>
            <p className="text-xs text-gray-500">User: {booking.userName}</p>
            <p className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {booking.status === "PENDING" && (
            <>
              <button onClick={() => handleConfirmBooking(booking.id)} className="px-3 py-1 rounded-md bg-green-50 text-green-700 text-sm">
                Confirm
              </button>
              <button onClick={() => handleCancelBooking(booking.id)} className="px-3 py-1 rounded-md bg-red-50 text-red-700 text-sm">
                Cancel
              </button>
            </>
          )}

          {booking.status === "CONFIRMED" && (
            <button onClick={() => handleMarkBorrowed(booking.id)} className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-sm">
              Mark Borrowed
            </button>
          )}

          {booking.status === "BORROWED" && (
            <button onClick={() => handleCompleteBooking(booking.id)} className="px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm">
              Complete
            </button>
          )}

          <span className="text-xs text-gray-400">{booking.status}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-15">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Summary of book and borrowing activities</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            <Image src={user?.avatarImage || "/default-avatar.jpg"} alt="avatar" width={44} height={44} className="rounded-full object-cover border-2 border-purple-500" />
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard id="allBooks" title="All Books" count={counts.allBooks} icon={Book} />
        <StatCard id="statusBooks" title="Status Books" count={counts.statusBooks} icon={Archive} />
        <StatCard id="pending" title="Pending Booking" count={counts.pending} icon={Clock} />
        <StatCard id="confirmed" title="Confirm Booking" count={counts.confirmed} icon={CheckCircle} />
        <StatCard id="borrowed" title="Borrowed Books" count={counts.borrowed} icon={ShoppingCart} />
        <StatCard id="rescheduled" title="Reschedule" count={counts.rescheduled} icon={Repeat} />
        <StatCard id="canceled" title="Canceled" count={counts.canceled} icon={XCircle} />
        <StatCard id="completed" title="Completed" count={counts.completed} icon={FileText} />
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">{activePanel.toUpperCase()} BOOKINGS</h3>
          <button onClick={fetchAll} className="text-sm px-3 py-1 rounded-md bg-gray-100">
            Refresh
          </button>
        </div>

        {loadingBookings ? (
          <p className="p-4 text-center text-gray-500">Loading bookings...</p>
        ) : bookingsByStatus(activePanel).length === 0 ? (
          <p className="p-4 text-center text-gray-500">No bookings in this category.</p>
        ) : (
          bookingsByStatus(activePanel).map((b) => <BookingRow key={b.id} booking={b} />)
        )}
      </div>
    </div>
  );
}
