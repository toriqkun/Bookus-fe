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
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        if (redirect) router.replace("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router, redirect]);

  return { user, loading };
}
