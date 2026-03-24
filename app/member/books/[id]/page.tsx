"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiBook, FiHash, FiMapPin, FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";
import Swal from "sweetalert2";

const API_URL = "http://127.0.0.1:8000/api/books";
const LOAN_API = "http://127.0.0.1:8000/api/loans";

type Category = { id: number; name: string; description?: string };
type Book = {
  id: number;
  title: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  published_year?: number;
  rack_code?: string;
  stock: number;
  cover?: string;
  category?: Category;
};

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBorrow, setShowBorrow] = useState(false);
  const [form, setForm] = useState({ borrow_date: "", return_date: "", qty: 1 });

  const fetchCurrentUser = async (token: string) => {
    const endpoint = "http://127.0.0.1:8000/api/profile";
    try {
      const userRes = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!userRes.ok) {
        const errText = await userRes.text().catch(() => "");
        console.warn(`fetchCurrentUser: ${endpoint} status ${userRes.status} ${userRes.statusText}`, errText);
        return null;
      }

      const userJson = await userRes.json();
      const userData = userJson.data ?? userJson;
      if (userData?.id) {
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }

      console.warn(`fetchCurrentUser: ${endpoint} returned user object without id`, userData);
      return null;
    } catch (err: any) {
      console.warn(`fetchCurrentUser: gagal nge-fetch ${endpoint}`, err.message || err);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      const tokenFromUrl = searchParams.get("token");
      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
        await fetchCurrentUser(tokenFromUrl);
        window.history.replaceState({}, document.title, `/member/books/${id}`);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      let userState = null;
      try {
        userState = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        userState = null;
      }

      if (!userState?.id) {
        userState = await fetchCurrentUser(token);
      }

      if (!userState?.id) {
        Swal.fire({ icon: "error", title: "Opps!", text: "Data pengguna tidak ditemukan. Silahkan login ulang." });
        router.push("/login");
        return;
      }

      fetchBook(token);
    };

    init();
  }, [id, searchParams, router]);

  const fetchBook = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setBook(data.data ?? data);
    } catch (err) {
      console.error("Gagal mengambil detail buku", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    if (!form.borrow_date || !form.return_date) {
      Swal.fire({ icon: "warning", title: "Perhatian", text: "Tanggal peminjaman dan pengembalian wajib diisi" });
      return;
    }

    const qty = Number(form.qty ?? 1);
    if (!qty || qty < 1 || qty > book.stock) {
      Swal.fire({ icon: "warning", title: "Perhatian", text: `Jumlah harus antara 1 dan ${book.stock}` });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      let user = null;
      try {
        user = JSON.parse(localStorage.getItem("user") || "null");
      } catch {
        user = null;
      }

      if (!user?.id) {
        user = await fetchCurrentUser(token);
      }

      if (!user?.id) {
        Swal.fire({ icon: "error", title: "Opps!", text: "Data pengguna tidak ditemukan. Silahkan login ulang." });
        router.push("/login");
        return;
      }

      const res = await fetch(LOAN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          loan_date: form.borrow_date,
          due_date: form.return_date,
          details: [{ book_id: book.id, qty, rack_code: book.rack_code || "-" }],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal meminjam");

      Swal.fire({
        icon: "success",
        title: "Peminjaman Berhasil!",
        text: "Silahkan ambil buku di rak yang tertera.",
        confirmButtonColor: "#4f46e5",
      });

      setShowBorrow(false);
      fetchBook(token || "");
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Opps!", text: err.message });
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (!book) return <div className="text-center py-20 text-slate-400 font-medium">Buku tidak ditemukan</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4 sm:px-0">

      <button
        onClick={() => router.push("/member/books")}
        className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-semibold text-sm"
      >
        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Katalog
      </button>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col lg:flex-row">
        
        <div className="lg:w-[400px] p-8 lg:p-10 bg-slate-50 flex flex-col items-center justify-start border-r border-slate-100">
          <div className="relative group w-full max-w-[280px]">
            <img
              src={book.cover ? `http://127.0.0.1:8000/storage/${book.cover}` : "/no-image.png"}
              alt={book.title}
              className="w-full aspect-[3/4.5] object-cover rounded-[2rem] shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-[2rem] shadow-inner pointer-events-none border border-black/5"></div>
          </div>
          
          <div className="mt-8 w-full space-y-4">
             <div className={`flex items-center gap-3 p-4 rounded-2xl border ${book.stock > 0 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                {book.stock > 0 ? <FiCheckCircle size={20}/> : <FiAlertCircle size={20}/>}
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Status Ketersediaan</p>
                  <p className="text-sm font-bold">{book.stock > 0 ? `Tersedia ${book.stock} pcs` : 'Sedang Kosong'}</p>
                </div>
             </div>
          </div>
        </div>

        <div className="flex-1 p-8 lg:p-12">
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider mb-4">
              {book.category?.name || "Uncategorized"}
            </span>
            <h1 className="text-4xl font-black text-slate-900 leading-tight mb-2 tracking-tight">
              {book.title}
            </h1>
            <p className="text-xl text-slate-400 font-medium italic">by {book.author || "Unknown Author"}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 py-8 border-y border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <FiHash size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">ISBN</p>
                <p className="text-sm font-bold text-slate-700">{book.isbn || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <FiBook size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Penerbit</p>
                <p className="text-sm font-bold text-slate-700">{book.publisher || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <FiCalendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tahun Terbit</p>
                <p className="text-sm font-bold text-slate-700">{book.published_year || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                <FiMapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Lokasi Rak</p>
                <p className="text-sm font-bold text-indigo-600">{book.rack_code || "-"}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Tentang Kategori Ini</h3>
            <p className="text-slate-500 leading-relaxed text-sm bg-slate-50 p-6 rounded-3xl italic">
              "{book.category?.description || "Tidak ada deskripsi tambahan untuk kategori ini."}"
            </p>
          </div>

          <div className="mt-10 flex gap-4">
            <button
              onClick={() => setShowBorrow(true)}
              disabled={book.stock === 0}
              className={`flex-1 py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-sm transition-all duration-300 ${
                book.stock === 0
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 active:scale-95"
              }`}
            >
              {book.stock === 0 ? "Stok Tidak Tersedia" : "Ajukan Peminjaman"}
            </button>
          </div>
        </div>
      </div>

      {showBorrow && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowBorrow(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Detail Pinjam</h2>
              <button onClick={() => setShowBorrow(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <FiX size={20}/>
              </button>
            </div>

            <form onSubmit={handleBorrow} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tanggal Pinjam</label>
                <div className="relative">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    onChange={(e) => setForm({ ...form, borrow_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Batas Kembali</label>
                <div className="relative">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                    onChange={(e) => setForm({ ...form, return_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Jumlah Buku</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, qty: Math.max(1, Number(form.qty ?? 1) - 1) })}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  >-</button>
                  <input
                    type="number"
                    min={1}
                    max={book.stock}
                    value={form.qty}
                    onChange={(e) => {
                      const value = Math.max(1, Math.min(book.stock, Number(e.target.value) || 1));
                      setForm({ ...form, qty: value });
                    }}
                    className="w-full text-center py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, qty: Math.min(book.stock, Number(form.qty ?? 1) + 1) })}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  >+</button>
                </div>
                <p className="text-[10px] text-slate-400">Stok tersedia: {book.stock}</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Konfirmasi Pinjam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}