"use client";

import { useState } from "react";
import {
  FiBookOpen,
  FiCheckCircle,
  FiSearch,
  FiInfo,
  FiChevronRight,
  FiLayers,
  FiUser,
  FiBook,
  FiRepeat
} from "react-icons/fi";

export default function PanduanPage() {
  const [search, setSearch] = useState("");
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [kategori, setKategori] = useState("Semua");

  const panduan = [
    {
      no: 1,
      judul: "Login Akun",
      kategori: "Akun",
      icon: <FiUser />,
      deskripsi: "Gunakan email institusi dan password yang telah didaftarkan untuk mengakses dashboard perpustakaan.",
    },
    {
      no: 2,
      judul: "Eksplorasi Katalog",
      kategori: "Buku",
      icon: <FiBook />,
      deskripsi: "Telusuri ribuan judul melalui halaman Katalog. Gunakan fitur filter untuk mencari kategori spesifik.",
    },
    {
      no: 3,
      judul: "Proses Peminjaman",
      kategori: "Buku",
      icon: <FiCheckCircle />,
      deskripsi: "Pilih buku, klik tombol Pinjam, dan tentukan durasi pengembalian sesuai kebutuhan Anda.",
    },
    {
      no: 4,
      judul: "Pengembalian Tepat Waktu",
      kategori: "Buku",
      icon: <FiRepeat />,
      deskripsi: "Pastikan mengembalikan buku melalui petugas atau dropbox sebelum tanggal jatuh tempo berakhir.",
    },
    {
      no: 5,
      judul: "Pantau Transaksi",
      kategori: "Transaksi",
      icon: <FiLayers />,
      deskripsi: "Cek riwayat, status denda, dan masa pinjam secara real-time melalui menu My Loans.",
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
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider border border-emerald-100">
                <FiInfo /> Pusat Bantuan
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                Panduan Sistem
              </h1>
              <p className="text-slate-500 text-lg font-medium">Pelajari cara menggunakan aplikasi dengan mudah.</p>
            </div>

            <div className="relative group w-full md:w-80">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Cari instruksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
            {kategoriList.map((item) => (
              <button
                key={item}
                onClick={() => setKategori(item)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  kategori === item
                    ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200"
                    : "bg-white text-slate-500 border-slate-200 hover:border-emerald-500 hover:text-emerald-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <div className="mb-12 space-y-3">
          <div className="flex justify-between items-end px-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Learning Progress</span>
            <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
               {Math.round((activeStep || 0) / panduan.length * 100)}%
            </span>
          </div>
          <div className="h-3 bg-slate-200/50 rounded-full overflow-hidden border border-slate-100 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700 ease-out shadow-sm"
              style={{ width: `${(activeStep || 0) / panduan.length * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.no}
              onClick={() => setActiveStep(item.no)}
              className={`group cursor-pointer rounded-3xl p-6 border transition-all duration-500 ${
                activeStep === item.no
                  ? "bg-white border-emerald-500 shadow-xl shadow-emerald-100 translate-x-2"
                  : "bg-white border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-200/50"
              }`}
            >
              <div className="flex items-center gap-6">
                <div className={`flex items-center justify-center w-14 h-14 rounded-2xl text-xl transition-all duration-500 ${
                  activeStep === item.no 
                  ? "bg-emerald-600 text-white rotate-[360deg]" 
                  : "bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                }`}>
                  {item.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.kategori}</span>
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Step {item.no}</span>
                  </div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">
                    {item.judul}
                  </h2>
                  <div className={`overflow-hidden transition-all duration-500 ${activeStep === item.no ? 'max-h-20 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                      {item.deskripsi}
                    </p>
                  </div>
                </div>

                <FiChevronRight className={`text-slate-300 transition-all duration-300 ${activeStep === item.no ? 'rotate-90 text-emerald-500 scale-125' : 'group-hover:translate-x-1'}`} size={24} />
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-16 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Tidak Ada Hasil</h3>
            <p className="text-slate-400 text-sm font-medium mt-1">Coba kata kunci lain untuk menemukan bantuan.</p>
          </div>
        )}

        <footer className="mt-16 p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-300">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <FiBookOpen size={120} className="text-white" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 text-emerald-400 mb-3">
                    <FiCheckCircle size={24} />
                    <span className="font-black uppercase tracking-[0.3em] text-xs">Library Policy</span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Penting untuk Diingat!</h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xl font-medium">
                    Keterlambatan pengembalian akan dikenakan denda harian otomatis. Pastikan Anda melakukan perpanjangan buku 
                    minimal 2 hari sebelum masa pinjam berakhir melalui dashboard.
                </p>
            </div>
        </footer>
      </div>
    </div>
  );
}