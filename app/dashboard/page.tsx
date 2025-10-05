"use client";
import { useRouter } from "next/navigation";
import useAuth from "@/app/utils/useAuth";
import api from "@/app/utils/axios";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    } catch (err) {
      console.error("Logout gagal", err);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-purple-600">Welcome, {user.name} 🎉</h1>
        <p className="mt-2 text-gray-500">Ini halaman dashboard</p>

        {/* Tombol Logout */}
        <button onClick={handleLogout} className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Logout
        </button>
      </div>
    </main>
  );
}
