"use client";

import { useState } from "react";
import {
  FiBookOpen,
  FiArrowRight,
  FiCheckCircle,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

export default function PanduanPage() {
  const [search, setSearch] = useState("");
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [kategori, setKategori] = useState("Semua");

  const panduan = [
    {
      no: 1,
      judul: "Login",
      kategori: "Akun",
      deskripsi: "Masukkan email dan password untuk masuk ke sistem.",
    },
    {
      no: 2,
      judul: "Melihat Buku",
      kategori: "Buku",
      deskripsi: "Buka halaman Books untuk melihat daftar buku.",
    },
    {
      no: 3,
      judul: "Meminjam Buku",
      kategori: "Buku",
      deskripsi: "Klik tombol Pinjam pada buku yang ingin dipinjam.",
    },
    {
      no: 4,
      judul: "Mengembalikan Buku",
      kategori: "Buku",
      deskripsi: "Kembalikan buku sebelum jatuh tempo.",
    },
    {
      no: 5,
      judul: "Melihat Denda",
      kategori: "Transaksi",
      deskripsi: "Masuk ke My Loans untuk melihat denda.",
    },
  ];

  const kategoriList = ["Semua", "Akun", "Buku", "Transaksi"];

  const filtered = panduan.filter((item) => {
    return (
      (kategori === "Semua" || item.kategori === kategori) &&
      item.judul.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-100">
              <FiBookOpen className="text-green-600" size={28} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
              Panduan Penggunaan
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm w-full md:w-80">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Cari panduan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none w-full text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {kategoriList.map((item) => (
            <button
              key={item}
              onClick={() => setKategori(item)}
              className={`px-4 py-2 rounded-full text-sm border transition ${
                kategori === item
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all"
              style={{
                width: `${
                  activeStep ? (activeStep / panduan.length) * 100 : 0
                }%`,
              }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Progress: {activeStep || 0} / {panduan.length}
          </p>
        </div>

        <div className="grid gap-6">
          {filtered.map((item, index) => (
            <div
              key={item.no}
              onClick={() => setActiveStep(item.no)}
              className={`cursor-pointer rounded-xl p-6 border transition-all duration-300 ${
                activeStep === item.no
                  ? "bg-green-50 border-green-300 shadow-md"
                  : "bg-white border-gray-100 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 font-bold">
                  {item.no}
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.judul}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.deskripsi}
                  </p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {item.kategori}
                  </span>
                </div>

                {index < filtered.length - 1 && (
                  <FiArrowRight className="text-gray-300 rotate-90 mt-2 hidden md:block" />
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 mt-10">
            Tidak ditemukan panduan 😢
          </div>
        )}

        <div className="mt-10 p-6 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <FiCheckCircle className="text-green-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">
                Tips Penting
              </h3>
              <p className="text-green-800 text-sm">
                Selalu cek status peminjaman di halaman My Loans dan jangan
                sampai melewati tanggal jatuh tempo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}