"use client";
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import api from "@/app/utils/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      return setError("Email and password required");
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      if (res.status === 200) {
        console.log("Login sukses:", res.data);
        router.push("/home");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Incorrect email or password";
      setError(msg);
    }
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      <form onSubmit={handleLogin} className="login bg-gray-100 shadow-lg rounded-xl w-96 px-7 pt-7 pb-15">
        <img src="/1.gif" alt="SLOTIFY" className="w-65 mx-auto mb-3" />
        <h1 className="text-3xl font-semibold text-purple-600 mb-1">Login</h1>
        <p className="text-lg mb-3">Sign in to continue</p>

        {/* Email */}
        <div className="mb-5 relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
          <input
            type="email"
            placeholder="Email"
            className="text-gray-700 rounded-md border border-purple-400 p-2 pr-9 w-full focus:outline-none focus:border-purple-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-3 relative">
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
          <input
            type="password"
            placeholder="Password"
            className="text-gray-700 rounded-md border border-purple-400 p-2 pr-9 w-full focus:outline-none focus:border-purple-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="absolute left-1 text-red-500 text-xs text-center mb-3">{error}</p>}
        </div>


        {/* Forgot Password */}
        <div className="w-full">
          <div className="relative">
            <a href="/forgot-password" className="absolute top-[-2px] right-0 text-gray-400 text-sm hover:text-purple-600">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white mt-6 px-4 py-2 rounded-full w-full cursor-pointer">
          Sign in
        </button>

        <p className="mt-3 text-sm text-center text-gray-400">
          Don’t have an account yet?
          <a href="/register" className="ml-1 text-purple-600 hover:underline">
            Create account
          </a>
        </p>
      </form>
    </main>
  );
}
