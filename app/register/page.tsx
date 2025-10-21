"use client";
import { useState, useEffect } from "react";
import { Mail, Lock, User, CircleCheckBig } from "lucide-react";
import api from "@/app/utils/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ fullname?: string; username?: string; email?: string; password?: string; confirmPassword?: string }>({});
  const [submitError, setSubmitError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const isEmailValid = (v: string) => /\S+@\S+\.\S+/.test(v);
  const isPasswordValid = (v: string) => v.length >= 8;
  const isFullnameValid = (v: string) => v.length >= 4 && v.length <= 20;

  useEffect(() => {
    const newErrors: typeof errors = {};
    if (fullname && !isFullnameValid(fullname)) newErrors.fullname = "Fullname minimum 4-50 characters";
    if (email && !isEmailValid(email)) newErrors.email = "Please enter a valid email address.";
    if (password && !isPasswordValid(password)) newErrors.password = "Password minimum 8 characters";
    if (confirmPassword && confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
  }, [fullname, email, password, confirmPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    // if (!fullname || !email || !password || !confirmPassword) {
    //   setSubmitError("Please fill in all fields");
    //   return;
    // }
    if (Object.keys(errors).length > 0) {
      setSubmitError("Please fix the errors before submitting.");
      return;
    }

    try {
      const payload = {
        name: fullname,
        email,
        password,
        confirmPassword,
      };

      await api.post("/auth/register", payload);

      setShowModal(true);
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        const data = err.response.data;
        let errorMessage = "Failed to register: Bad Request";

        if (data.message) {
          errorMessage = data.message;
        } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          errorMessage = data.errors[0];
        }

        setSubmitError(errorMessage)
        toast.error(errorMessage);
      } else {
        const msg = err.response?.data?.message || "Internal server error";
        setSubmitError(msg)
        toast.error(msg);
      }
    }
  };

  const getInputStyle = (value: string, error?: string) => {
    if (!value) return { border: "border-purple-400", icon: "text-purple-400" };
    if (error) return { border: "border-red-500", icon: "text-red-500" };
    return { border: "border-purple-500", icon: "text-purple-500" };
  };

  return (
    <main className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      <form onSubmit={handleRegister} className="register bg-gray-100 rounded-xl w-96 px-7 pt-7 pb-15 shadow-xl">
        <img src="/2.gif" alt="SLOTIFY" className="w-50 mx-auto mb-3" />
        <h1 className="text-2xl font-semibold text-purple-600">Register</h1>
        <p className="text-md mb-3">Sign up to continue</p>

        {[
          {
            label: "Fullname",
            value: fullname,
            set: setFullname,
            error: errors.fullname,
            icon: User,
          },
          {
            label: "Email",
            value: email,
            set: setEmail,
            error: errors.email,
            icon: Mail,
          },
          {
            label: "Password",
            value: password,
            set: setPassword,
            error: errors.password,
            type: "password",
            icon: Lock,
          },
          {
            label: "Confirm Password",
            value: confirmPassword,
            set: setConfirmPassword,
            error: errors.confirmPassword,
            type: "password",
            icon: Lock,
          },
        ].map((f, i) => {
          const style = getInputStyle(f.value, f.error);
          const Icon = f.icon;
          return (
            <div key={i} className="mb-5 relative">
              <Icon className={`absolute right-3 top-1/2 -translate-y-1/2 ${style.icon}`} size={20} />
              <input
                type={f.type || "text"}
                placeholder={f.label}
                className={`w-full pr-10 pl-3 py-2 border rounded focus:outline-none ${style.border}`}
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
              />
              {/* Error validasi */}
              {f.error && <p className="text-xs text-red-500 absolute top-full left-1">{f.error}</p>}
            </div>
          );
        })}

        {/* Submit Error */}
        <div className="relative">{submitError && <p className="text-red-500 absolute top-[-5px] left-1 text-xs">{submitError}</p>}</div>

        {/* Submit */}
        <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white mt-5 px-4 py-2 rounded-full w-full cursor-pointer">
          Sign up
        </button>

        <p className="mt-3 text-sm text-center text-gray-400">
          Already have an account?
          <a href="/login" className="ml-1 text-purple-600 hover:underline">
            Sign in
          </a>
        </p>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-5 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-110 text-center">
            <CircleCheckBig
              className="text-green-600 text-center mx-auto mb-2 
             w-23 h-23 sm:w-28 sm:h-28"
            />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Success!</h2>
            <p className="text-gray-600 mb-4 text-md sm:text-lg">Check your email to confirm your account.</p>
            <button
              onClick={() => {
                setShowModal(false);
                router.push("/login");
              }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md w-full"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
