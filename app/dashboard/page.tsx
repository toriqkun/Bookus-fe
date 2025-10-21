"use client";

import { useRouter } from "next/navigation";
import useAuth from "@/app/utils/useAuth";
import api from "@/app/utils/axios";
import AdminDashboard from "@/app/components/AdminDashboard";
import UserDashboard from "@/app/components/UserDashboard";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      router.push("/login");
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  if (!user) return null;

  if (user.role === "ADMIN") {
    return <AdminDashboard user={user} />;
  }

  if (user.role === "USER") {
    return <UserDashboard user={user} />;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-gray-500">Role tidak dikenali: {user.role}</p>
    </div>
  );
}
