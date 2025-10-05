"use client";
import { useState } from "react";
import { Search, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const mockServices = [
  {
    id: 1,
    name: "Ruang Baca",
    description: "Nikmati ruang baca yang nyaman dan tenang.",
    slots: "3 slot tersedia hari ini",
    icon: "📖",
  },
  {
    id: 2,
    name: "Konsultasi Dosen",
    description: "Temukan waktu untuk konsultasi dengan dosen pembimbing.",
    slots: "2 slot tersedia minggu ini",
    icon: "👨‍🏫",
  },
  {
    id: 3,
    name: "Peminjaman Buku Premium",
    description: "Akses koleksi buku premium terbatas.",
    slots: "5 slot tersedia hari ini",
    icon: "📚",
  },
  {
    id: 4,
    name: "Workshop",
    description: "Ikuti workshop pengembangan diri dan penelitian.",
    slots: "1 slot tersedia besok",
    icon: "🛠️",
  },
];

export default function ServicesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockServices.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  const handleBookClick = () => {
    toast.error("Hampir Selesai! 🚀 Anda harus Login atau Daftar akun SLOTIFY gratis untuk mengamankan slot waktu ini. Hanya butuh satu menit!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 px-6 py-24">
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">Explore Library</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Temukan layanan dan slot waktu yang tersedia. Booking akan memerlukan akun SLOTIFY.</p>
      </div>

      {/* Search + Filter */}
      <div className="max-w-3xl mx-auto flex gap-3 mb-10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cari layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <button className="bg-purple-600 text-white px-5 rounded-lg hover:bg-purple-700">Filter</button>
      </div>

      {/* Services List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filtered.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
            <div className="text-4xl">{service.icon}</div>
            <h3 className="mt-4 text-xl font-bold text-gray-900">{service.name}</h3>
            <p className="text-gray-600 mt-2 flex-1">{service.description}</p>
            <div className="flex items-center gap-2 text-sm text-green-600 mt-3">
              <Clock size={16} /> {service.slots}
            </div>
            <button onClick={handleBookClick} className="mt-5 bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition">
              Book Slot
            </button>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-16 max-w-3xl mx-auto bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
        <h3 className="font-bold text-purple-700 text-xl">Kenapa halaman katalog ini penting?</h3>
        <ul className="text-gray-600 mt-4 list-disc list-inside text-left space-y-2">
          <li>
            <strong>Meningkatkan Konversi:</strong> Pengguna bisa melihat layanan dulu sebelum daftar.
          </li>
          <li>
            <strong>Validasi Konsep:</strong> Membuktikan sistem slot benar-benar berjalan.
          </li>
          <li>
            <strong>SEO Friendly:</strong> Halaman kaya konten untuk menarik user organik.
          </li>
        </ul>
      </div>
    </div>
  );
}
