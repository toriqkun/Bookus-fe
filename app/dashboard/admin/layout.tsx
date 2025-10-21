"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/utils/useAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDelayedLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !delayedLoading) {
      if (!user) {
        router.replace("/login");
        return;
      }

      if (user.role !== "ADMIN") {
        router.replace("/dashboard");
        return;
      }
    }
  }, [user, loading, delayedLoading, router]);

  if (loading || delayedLoading) {
    return <div className="flex h-screen items-center justify-center text-gray-600">Checking access...</div>;
  }

  if (user?.role === "ADMIN") {
    return <>{children}</>;
  }

  return null;
}
