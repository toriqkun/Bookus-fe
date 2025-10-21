"use client";
import { useState } from "react";
import useAuth from "@/app/utils/useAuth";
import BookList from "../components/BookList";
import { Search } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [search, setSearch] = useState("");

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <main className="flex flex-col w-full h-screen p-10 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      {/* Header + Search */}
      <div className="flex justify-between items-center mb-6 pt-12">
        <h1 className="text-3xl font-bold pl-1">All Books</h1>

        {/* Search Input */}
        <div className="relative w-100">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-purple-500 focus:outline-none text-sm"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Book List */}
      <div className="w-full">
        <BookList cols="lg:grid-cols-8" search={search} />
      </div>
    </main>
  );
}
