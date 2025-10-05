"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/app/utils/axios";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      toast.error("Token tidak ditemukan");
      router.push("/login");
      return;
    }

    const verify = async () => {
      try {
        await api.get(`/auth/verify?token=${token}`);
        toast.success("Email berhasil diverifikasi, silakan login.");
        router.push("/login");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Verifikasi gagal");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [params, router]);

  return <div className="flex items-center justify-center h-screen">{loading ? <p>Verifying...</p> : <p>Redirecting...</p>}</div>;
}
