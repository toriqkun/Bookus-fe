"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/utils/axios";

export default function useAuth(redirect = true) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/auth/profile");
        setUser(res.data.user || res.data);
      } catch (err) {
        if (redirect) router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router, redirect]);

  return { user, loading, setUser };
}
