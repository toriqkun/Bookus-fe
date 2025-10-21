"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";
import api from "@/app/utils/axios";
import toast from "react-hot-toast";
import { useAuth } from "@/app/context/AuthContext";

export default function ProfilePage() {
  const { user, loading, setUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatarImage: null as File | null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        avatarImage: null,
      });
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatarImage: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);
      if (formData.avatarImage) data.append("avatar", formData.avatarImage);

      const res = await api.patch("/auth/update-profile", data);
      const updatedUser = res.data.user || res.data.data;
      setUser(updatedUser);
      toast.success("Profile updated successfully");
      setShowModal(false);
      setPreview(null);
    } catch (err) {
      console.error("Gagal update profil", err);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-gray-400">Loading profile...</div>;
  }
  if (!user) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100 text-gray-200 flex justify-center items-center pt-18 px-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        {/* LEFT SECTION */}
        <div className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-lg flex-1">
          <div className="relative">
            <Image src={preview || user.avatarImage || "/default-avatar.jpg"} alt="avatar" width={300} height={300} className="rounded-full border-4 border-purple-400 object-cover" />
          </div>
          {/* <h2 className="text-2xl text-gray-900 font-semibold mt-4">{user.name || "User"}</h2> */}
          <p className="text-purple-600 mt-3 text-lg font-medium">{user.role === "USER" ? "Member User" : user.role}</p>
          {user.role === "USER" && (
            <p className="text-gray-800 mt-2 text-sm">
              Member since:{" "}
              {new Date(user.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white rounded-2xl shadow-lg flex-[2] flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900 p-3">Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 px-3 py-4">
              <div>
                <p className="text-md text-gray-500">Name</p>
                <p className="text-gray-900">{user.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-gray-900">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{user.phone || "—"}</p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="flex justify-end mt-8 p-3">
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Profile</h2>

            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <Image src={preview || user.avatarImage || "/default-avatar.jpg"} alt="avatar" width={100} height={100} className="rounded-full border-2 border-purple-600 object-cover" />
                <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-purple-700">
                  <Pencil size={14} />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-800 mb-1">Name</p>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-500 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-purple-800"
                />
              </div>
              <div>
                <p className="text-gray-800 mb-1">Phone</p>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-gray-500 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:border-purple-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPreview(null);
                }}
                className="px-4 py-2 border border-purple-700 text-gray-900 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
              <button disabled={saving} onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 cursor-pointer">
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
