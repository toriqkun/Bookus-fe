"use client";
import useAuth from "@/app/utils/useAuth";
import AdminDashboard from "@/app/components/AdminDashboard";

export default function AdminPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard user={user} />
    </div>
  );
}
