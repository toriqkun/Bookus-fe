"use client";
import BookList from "../components/BookList";

export default function LibraryPage() {
  return (
    <main className="flex flex-col w-full h-screen p-10 bg-gradient-to-br from-purple-200 via-pink-100 to-blue-100">
      <h1 className="text-3xl font-bold mb-3 pl-1">All Books</h1>
      <div className="w-full">
        <div className="mb-10">
          <BookList cols="lg:grid-cols-7" />
        </div>
      </div>
    </main>
  );
}
