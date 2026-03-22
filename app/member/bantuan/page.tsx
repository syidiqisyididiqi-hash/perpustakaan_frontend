"use client";

import { useState } from "react";
import {
  FiHelpCircle,
  FiChevronDown,
  FiMail,
  FiClock,
  FiSearch,
  FiMessageCircle,
  FiInfo,
  FiInbox
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa"; 

export default function BantuanPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const whatsappNumber = "628123456789"; 
  const message = encodeURIComponent("Halo Admin, saya butuh bantuan terkait sistem perpustakaan.");

  const faqs = [
    {
      q: "Bagaimana cara meminjam buku?",
      a: "Masuk ke halaman Books, pilih buku yang tersedia, lalu klik tombol Pinjam. Pastikan kuota peminjaman Anda masih tersedia."
    },
    {
      q: "Bagaimana cara melihat riwayat peminjaman?",
      a: "Semua daftar buku yang sedang dipinjam maupun yang sudah dikembalikan dapat dilihat pada menu 'History' di sidebar."
    },
    {
      q: "Kenapa saya terkena denda?",
      a: "Sistem secara otomatis menghitung denda jika Anda mengembalikan buku melewati batas tanggal jatuh tempo yang ditentukan."
    },
    {
      q: "Bagaimana cara menghubungi admin?",
      a: "Anda bisa mengirimkan pesan melalui email resmi kami atau mengunjungi meja sirkulasi pada jam operasional."
    },
    {
      q: "Apakah ada batasan jumlah buku?",
      a: "Ya, setiap anggota memiliki batas maksimal peminjaman sesuai dengan kategori keanggotaan masing-masing."
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
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
        
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
              <FiInfo /> Layanan Support
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Pusat Bantuan
            </h1>
            <p className="text-slate-500 text-lg font-medium">Temukan jawaban cepat untuk kendala Anda.</p>
          </div>

          <div className="relative group w-full md:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Cari pertanyaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
            />
          </div>
        </header>

        <div className="space-y-4">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">Pertanyaan Populer</h2>
          {filtered.length > 0 ? (
            filtered.map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-[1.5rem] border transition-all duration-500 overflow-hidden ${
                  open === index 
                    ? "border-blue-500 shadow-xl shadow-blue-100 translate-x-1" 
                    : "border-slate-100 hover:border-blue-200 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => setOpen(open === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <span className={`font-bold transition-colors duration-300 ${open === index ? "text-blue-600" : "text-slate-700 group-hover:text-blue-500"}`}>
                    {item.q}
                  </span>
                  <div className={`p-2 rounded-full transition-all duration-500 ${open === index ? "bg-blue-600 text-white rotate-180" : "bg-slate-50 text-slate-400"}`}>
                    <FiChevronDown size={18} />
                  </div>
                </button>

                <div className={`transition-all duration-500 ease-in-out ${open === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-6 pb-6 pt-2">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-sm leading-relaxed font-medium">
                      {item.a}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <FiInbox size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pertanyaan tidak ditemukan</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-6">
          <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
                <FiMail />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Email</h3>
                <p className="text-lg font-black text-slate-800 tracking-tight">Kirim Pesan</p>
              </div>
            </div>
            <a
              href="mailto:syayidsyayid262@gmail.com"
              className="inline-flex items-center gap-2 text-emerald-600 font-black text-sm hover:gap-4 transition-all"
            >
              syayidsyayid262@gmail.com <FiMessageCircle />
            </a>
          </div>

          <div className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-100 transition-all duration-500">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-500">
                <FiClock />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Office Hours</h3>
                <p className="text-lg font-black text-slate-800 tracking-tight">Jam Operasional</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Senin - Jumat: <span className="text-slate-800">08:00 - 17:00</span></p>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-tighter">Sabtu: <span className="text-slate-800">09:00 - 14:00</span></p>
            </div>
          </div>
        </div>

        <footer className="p-8 bg-blue-600 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-blue-200">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-black text-white mb-1 tracking-tight">Belum menemukan jawaban?</h3>
            <p className="text-blue-100 text-sm font-medium">Tim admin kami siap membantu kendala teknis Anda.</p>
          </div>
          <a 
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-lg"
          >
            <FaWhatsapp size={18} />
            Hubungi Admin Sekarang
          </a>
        </footer>

      </div>
    </div>
  );
}