"use client";
import { useState } from "react";
import { Lock } from "lucide-react";
import api from "@/app/utils/axios";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); 

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) return toast.error("All fields are required ❌");
    if (password !== confirm) return toast.error("Passwords do not match ❌");
    if (!token) return toast.error("Invalid or missing token ❌");

    try {
      setLoading(true);
      const res = await api.post("/auth/reset-password", { token, password });
      if (res.status === 200) {
        toast.success("Password successfully reset ✅");
        router.push("/login");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to reset password ❌";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center px-5 h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      <form onSubmit={handleReset} className="reset bg-gray-100 shadow-lg rounded-xl w-96 px-7 pt-7 pb-15">
        <img src="/4.gif" alt="SLOTIFY" className="w-60 mx-auto mb-3" />
        <h1 className="text-2xl font-semibold text-purple-600">Reset Password</h1>
        <p className="text-sm mb-3">Enter your new password below</p>

        {/* New Password */}
        <div className="mb-5 relative group">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 transition-colors duration-200 group-focus-within:text-purple-600" size={18} />
          <input
            type="password"
            placeholder="New Password"
            className="text-gray-700 rounded-md border border-purple-400 p-2 pr-9 w-full focus:outline-none focus:border-purple-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4 relative group">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 transition-colors duration-200 group-focus-within:text-purple-600" size={18} />
          <input
            type="password"
            placeholder="Confirm Password"
            className="text-gray-700 rounded-md border border-purple-400 p-2 pr-9 w-full focus:outline-none focus:border-purple-600"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-purple-500 hover:bg-purple-600 text-white mt-2 px-4 py-2 rounded-full w-full cursor-pointer ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </main>
  );
}
