"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FiBook, FiClock, FiAlertCircle, FiCheckCircle, 
  FiCalendar, FiMapPin, FiX, FiCreditCard, FiInbox 
} from "react-icons/fi";
import Swal from "sweetalert2";

const API_URL = "http://127.0.0.1:8000/api/my-loans";

type History = {
  id: number;
  loanId: number;
  detailId: number;
  fineId: number | null;
  book: string;
  rack: string;
  borrowDate: string;
  dueDate: string;
  returnedAt: string | null;
  fine: number;
  fineStatus: string | null;
  overdueDays: number;
};

export default function HistoryPage() {
  const router = useRouter();
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFine, setSelectedFine] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatus = (h: History) => {
    if (!h.returnedAt) return { label: "Dipinjam", color: "bg-amber-50 text-amber-600 border-amber-100", icon: <FiClock /> };
    if (h.fine > 0 && h.fineStatus !== "paid") return { label: "Terlambat", color: "bg-red-50 text-red-600 border-red-100", icon: <FiAlertCircle /> };
    return { label: "Selesai", color: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <FiCheckCircle /> };
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/login"); return; }

      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();

      if (data.status) {
        const mapped = data.data.flatMap((loan: any) =>
          loan.loan_details.map((detail: any) => {
            const loanId = loan.id || loan.loan_id || detail.loan_id || null;
            const detailId = detail.id || detail.detail_id || null;

            return {
              id: detail.id ?? detail.detail_id ?? Math.floor(Math.random() * 1000000),
              loanId,
              detailId,
              fineId: detail.fine_id,
              book: detail.book?.title || "-",
              rack: detail.rack_code || "-",
              borrowDate: new Date(loan.loan_date).toLocaleDateString("id-ID"),
              dueDate: new Date(loan.due_date).toLocaleDateString("id-ID"),
              returnedAt: detail.returned_at ? new Date(detail.returned_at).toLocaleDateString("id-ID") : null,
              fine: detail.fine_total || 0,
              fineStatus: detail.fine_status,
              overdueDays: detail.overdue_days || 0,
            };
          })
        );
        setHistories(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handlePayFine = async (method: string) => {
    if (!selectedFine) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/fines/${selectedFine}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", payment_method: method }),
      });
      const result = await res.json();
      if (result.status) {
        Swal.fire({ icon: 'success', title: 'Pembayaran Berhasil', text: `Denda lunas via ${method}`, confirmButtonColor: '#4f46e5' });
        setShowPayment(false);
        setSelectedFine(null);
        fetchHistory();
      }
    } catch (err) { console.error(err); }
  };

  const handleReturn = async (loanId: number | null, detailId: number | null) => {
    if (!loanId) {
      Swal.fire({ icon: "error", title: "Error", text: "ID pinjaman tidak tersedia. Tidak dapat melakukan pengembalian." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const payload = { return_date: new Date().toISOString().split("T")[0] };

      const res = await fetch(`http://127.0.0.1:8000/api/loans/${loanId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error("Gagal return loan", res.status, errText);
        Swal.fire({ icon: "error", title: "Gagal", text: "Tidak dapat mengembalikan buku (status API)." });
        return;
      }

      const result = await res.json();
      if (result.status) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Buku telah dikembalikan", confirmButtonColor: "#4f46e5" });
        fetchHistory();
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: result.message || "Tidak dapat mengembalikan buku" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Terjadi kesalahan saat proses pengembalian" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FiBook className="text-indigo-600" /> Riwayat Pinjam
          </h1>
          <p className="text-slate-500 font-medium">Pantau semua aktivitas peminjaman buku Anda.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Buku", val: histories.length, color: "text-indigo-600", bg: "bg-indigo-50", icon: <FiBook /> },
          { label: "Belum Kembali", val: histories.filter(h => !h.returnedAt).length, color: "text-amber-600", bg: "bg-amber-50", icon: <FiClock /> },
          { label: "Total Denda", val: formatRupiah(histories.reduce((s, h) => s + (h.fineStatus !== 'paid' ? h.fine : 0), 0)), color: "text-red-600", bg: "bg-red-50", icon: <FiAlertCircle /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
              <h2 className="text-2xl font-black text-slate-900">{stat.val}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Detail Buku</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Periode</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Denda</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="py-20 text-center text-slate-300 animate-pulse font-bold uppercase tracking-widest">Memuat Data...</td></tr>
              ) : histories.length > 0 ? (
                histories.map((h) => {
                  const status = getStatus(h);
                  return (
                    <tr key={h.id} className="group hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight">{h.book}</span>
                          <span className="text-[10px] flex items-center gap-1 text-slate-400 font-bold mt-1 uppercase">
                            <FiMapPin className="text-indigo-400" /> Rak: {h.rack}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-500 font-medium">
                            <FiCalendar size={12}/> {h.borrowDate} — {h.dueDate}
                          </div>
                          {h.returnedAt && (
                            <div className="text-emerald-500 font-bold flex items-center gap-2">
                              <FiCheckCircle size={12}/> Kembali: {h.returnedAt}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        {h.fine > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-red-600">{formatRupiah(h.fine)}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${h.fineStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                              {h.fineStatus === 'paid' ? 'Lunas' : `Telat ${h.overdueDays} Hari`}
                            </span>
                          </div>
                        ) : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="px-6 py-5 text-center">
                        {!h.returnedAt ? (
                          <button
                            onClick={() => handleReturn(h.loanId, h.detailId)}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 hover:-translate-y-0.5 active:scale-95"
                          >
                            Kembalikan
                          </button>
                        ) : h.fine > 0 && h.fineStatus !== "paid" ? (
                          <button
                            onClick={() => { setSelectedFine(h.fineId); setShowPayment(true); }}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:-translate-y-0.5 active:scale-95"
                          >
                            Bayar
                          </button>
                        ) : (
                          <FiCheckCircle className="inline text-emerald-400" size={20} />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <FiInbox size={48} />
                      <p className="font-black uppercase tracking-widest text-xs">Belum ada riwayat</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowPayment(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Metode Bayar</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Pilih salah satu</p>
              </div>
              <button onClick={() => setShowPayment(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><FiX /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "cash", label: "Cash", icon: "💵", color: "hover:border-green-500 hover:bg-green-50" },
                { id: "dana", label: "DANA", icon: "🟣", color: "hover:border-indigo-500 hover:bg-indigo-50" },
                { id: "ovo", label: "OVO", icon: "🟢", color: "hover:border-purple-500 hover:bg-purple-50" },
                { id: "gopay", label: "GoPay", icon: "🔵", color: "hover:border-sky-500 hover:bg-sky-50" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => handlePayFine(m.id)}
                  className={`flex flex-col items-center gap-3 p-6 border-2 border-slate-50 rounded-[2rem] transition-all duration-300 group ${m.color}`}
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{m.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{m.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors"
            >
              Batal / Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}