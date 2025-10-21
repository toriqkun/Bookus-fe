"use client";
import { useEffect, useState } from "react";
import { CalendarDays, Clock, CheckCircle, FileText, Archive, XCircle, RefreshCcw } from "lucide-react";
import api from "@/app/utils/axios";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { socket } from "@/app/utils/socket";
import Image from "next/image";

interface UserDashboardProps {
  user: any;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<string>("all");

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookRes, bookingRes] = await Promise.all([api.get("/books/services"), api.get("/bookings")]);

        const booksData = Array.isArray(bookRes.data) ? bookRes.data : bookRes.data?.data || [];
        const bookingsData = Array.isArray(bookingRes.data) ? bookingRes.data : bookingRes.data?.bookings || [];

        setBooks(booksData);
        setBookings(bookingsData);
      } catch (err) {
        console.error("Gagal memuat data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    socket.on("service:copiesUpdated", (data) => {
      setBooks((prev) => prev.map((b) => (b.id === data.serviceId ? { ...b, copies: data.updatedCopies } : b)));
    });

    socket.on("booking:statusChanged", (data) => {
      setBookings((prev) => prev.map((b) => (b.id === data.bookingId ? { ...b, status: data.newStatus } : b)));
    });

    return () => {
      socket.off("service:copiesUpdated");
      socket.off("booking:statusChanged");
    };
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-600 text-lg">Loading...</div>;
  }

  const counts = {
    pending: bookings.filter((b) => b.status === "PENDING").length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
    borrowed: bookings.filter((b) => b.status === "BORROWED").length,
    canceled: bookings.filter((b) => b.status === "CANCELED").length,
    rescheduled: bookings.filter((b) => b.status === "RESCHEDULED").length,
  };

  const filteredBookings = activeStatus === "all" ? bookings : bookings.filter((b) => b.status.toLowerCase().includes(activeStatus.toLowerCase()));

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6 md:p-10">
      {/* Profil Header */}
      {/* <div className="w-full flex flex-col md:flex-row items-center gap-6 bg-white shadow-md rounded-2xl p-6 mb-10 pt-12">
        <img src={user.avatarImage || "/default-avatar.jpg"} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-purple-200" />
        <div className="w-full flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <UserCircle className="w-6 h-6 text-purple-500" />
              {user.name}
            </h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-400 mt-1">Member since: {new Date(user.createdAt).toLocaleDateString("id-ID")}</p>
          </div>
          <div className="pr-3">
            <Link href="" className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-lg text-white">
              Edit Profile
            </Link>
          </div>
        </div>
      </div> */}
      <div className="flex items-center justify-between mb-6 pt-10">
        <div>
          <h1 className="text-2xl font-bold">User Dashboard</h1>
          <p className="text-sm text-gray-500">Summary of book and borrowing activities</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
            <Image src={user?.avatarImage || "/default-avatar.jpg"} alt="avatar" width={44} height={44} className="rounded-full object-cover border-2 border-purple-500" />
          </div>
        </div>
      </div>

      {/* 🔹 Booking Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <StatCard
          title="Pending"
          count={counts.pending}
          icon={Clock}
          color="bg-yellow-50 text-yellow-700 py-5"
          active={activeStatus === "pending"}
          onClick={() => router.push("/dashboard/user/pending")}
        />
        <StatCard
          title="Confirmed"
          count={counts.confirmed}
          icon={CheckCircle}
          color="bg-blue-50 text-blue-700 py-5"
          active={activeStatus === "confirmed"}
          onClick={() => router.push("/dashboard/user/confirmed")}
        />
        <StatCard
          title="Borrowed"
          count={counts.borrowed}
          icon={Archive}
          color="bg-purple-50 text-purple-700 py-5"
          active={activeStatus === "borrowed"}
          onClick={() => router.push("/dashboard/user/borrowed")}
        />
        <StatCard
          title="Completed"
          count={counts.completed}
          icon={FileText}
          color="bg-green-50 text-green-700 py-5"
          active={activeStatus === "completed"}
          onClick={() => router.push("/dashboard/user/completed")}
        />
        <StatCard title="Canceled" count={counts.canceled} icon={XCircle} color="bg-red-50 text-red-700 py-5" onClick={() => router.push("/dashboard/user/canceled")} />
        <StatCard title="Rescheduled" count={counts.rescheduled} icon={RefreshCcw} color="bg-pink-50 text-pink-700 py-5" onClick={() => router.push("/dashboard/user/rescheduled")} />
      </div>

      {/* Riwayat Booking */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-600">
            <CalendarDays className="w-5 h-5" />
            Book order history
            {/* ({activeStatus === "All" ? "Today" : activeStatus}) */}
          </h3>
          {/* <button onClick={() => setActiveStatus("all")} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md">
            Show All
          </button> */}
        </div>

        {filteredBookings.length === 0 ? (
          <p className="text-gray-500">There is no order history in this category</p>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div key={b.id} className="bg-white shadow-md rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{b.book?.title}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(b.startDate).toLocaleDateString("id-ID")} → {new Date(b.endDate).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <span
                  className={`mt-2 sm:mt-0 px-3 py-1 text-sm font-medium rounded-full ${
                    b.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-700"
                      : b.status === "CONFIRMED"
                      ? "bg-blue-100 text-blue-700"
                      : b.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ title, count, icon: Icon, color, onClick, active }: { title: string; count: number; icon: any; color: string; onClick: () => void; active?: boolean }) {
  return (
    <div onClick={onClick} className={`cursor-pointer flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm transition-transform hover:scale-[1.02] ${active ? "ring-2 ring-purple-200" : ""}`}>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold">{count}</p>
      </div>
    </div>
  );
}
