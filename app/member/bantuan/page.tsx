"use client";

import { useState } from "react";
import {
  FiHelpCircle,
  FiChevronDown,
  FiMail,
  FiPhone,
  FiSearch,
} from "react-icons/fi";

export default function BantuanPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const faqs = [
    {
      q: "Bagaimana cara meminjam buku?",
      a: "Masuk ke halaman Books, pilih buku, lalu klik tombol Pinjam."
    },
    {
      q: "Bagaimana cara melihat riwayat peminjaman?",
      a: "Masuk ke menu History untuk melihat semua riwayat."
    },
    {
      q: "Kenapa saya terkena denda?",
      a: "Denda muncul jika melewati tanggal pengembalian."
    },
    {
      q: "Bagaimana cara menghubungi admin?",
      a: "Hubungi melalui email admin@library.com atau datang langsung."
    },
    {
      q: "Apakah ada batasan jumlah buku?",
      a: "Jumlah buku tergantung kebijakan perpustakaan."
    },
    {
      q: "Bagaimana jika lupa mengembalikan buku?",
      a: "Segera hubungi admin, kemungkinan akan dikenakan denda."
    }
  ];

  const filtered = faqs.filter((item) =>
    item.q.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-100">
              <FiHelpCircle className="text-blue-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
              Pusat Bantuan
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm w-full md:w-80">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari bantuan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full text-sm"
            />
          </div>
        </div>

        <div className="space-y-3 mb-10">
          {filtered.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <p className="font-semibold text-gray-900 text-left">
                  {item.q}
                </p>
                <FiChevronDown
                  size={20}
                  className={`text-blue-600 transition-transform ${
                    open === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {open === index && (
                <div className="px-6 py-4 bg-blue-50 border-t border-blue-100">
                  <p className="text-gray-700 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 mb-10">
            Tidak ditemukan bantuan 😢
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <FiMail className="text-emerald-600" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900">Email</h3>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Hubungi kami melalui email:
            </p>
            <a
              href="mailto:admin@library.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              syayidsyayid262@gmail.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-rose-100">
                <FiPhone className="text-rose-600" size={20} />
              </div>
              <h3 className="font-semibold text-gray-900">
                Jam Operasional
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              Senin - Jumat: 08:00 - 17:00
              <br />
              Sabtu: 09:00 - 14:00
              <br />
              Minggu: Tutup
            </p>
          </div>
        </div>

        <div className="mt-10 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-blue-800 text-sm">
            Jika masih mengalami kendala, silakan hubungi admin untuk bantuan lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  );
}