"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import api from "@/app/utils/axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required ❌");

    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });
      if (res.status === 200) {
        toast.success("Password reset link sent to your email ✅");
        setEmail("");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center px-5 h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      <form onSubmit={handleSubmit} className="forgot bg-gray-100 shadow-lg rounded-xl w-96 px-7 pt-7 pb-15">
        <img src="/3.gif" alt="SLOTIFY" className="w-60 mx-auto mb-3" />
        <h1 className="text-2xl font-semibold text-purple-600">Forgot Password</h1>
        <p className="text-sm text-gray-900 mb-3">Enter your email to receive reset instructions</p>

        {/* Email */}
        <div className="mb-5 relative group">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 transition-colors duration-200 group-focus-within:text-purple-600" size={18} />
          <input
            type="email"
            placeholder="Email"
            className="text-gray-700 rounded-md border border-purple-400 p-2 pr-9 w-full focus:outline-none focus:border-purple-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`bg-purple-500 hover:bg-purple-600 text-white mt-1 px-4 py-2 rounded-full w-full cursor-pointer ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="mt-3 text-sm text-center text-gray-400">
          Remember your password?
          <a href="/login" className="ml-1 text-purple-600 hover:underline">
            Back to Sign in
          </a>
        </p>
      </form>
    </main>
  );
}
