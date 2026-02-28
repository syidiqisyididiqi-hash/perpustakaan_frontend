"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoansAPI } from "@/app/lib/api/loans";
import { LoadingCard } from "../../components/LoadingCard";


export default function LoanDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (date: string) => {
    if (!date) return "-";
    return date.split("T")[0];
  };

  const fetchLoan = async () => {
    try {
      const data: any = await LoansAPI.getById(Number(id));
      if (data.status) {
        setLoan(data.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchLoan();
  }, [id]);

  if (loading) {
    return <LoadingCard />;
  }

  if (!loan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Data tidak ditemukan
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Detail Pinjaman</h1>
          <p className="text-indigo-100 text-sm">
            Informasi lengkap transaksi peminjaman buku
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border grid md:grid-cols-2 gap-6">
          <Info label="User" value={loan.user?.name} />
          <Info label="Tanggal Pinjam" value={formatDate(loan.loan_date)} />
          <Info label="Tanggal Kembali" value={formatDate(loan.return_date)} />

          <div>
            <p className="text-sm text-slate-500 mb-1">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                loan.return_date
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {loan.return_date
                ? "Sudah Dikembalikan"
                : "Belum Dikembalikan"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <div className="p-5 border-b font-semibold text-lg">
            Daftar Buku Dipinjam
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-center">No</th>
                <th className="p-4 text-left">Judul Buku</th>
                <th className="p-4 text-center">Rack</th>
                <th className="p-4 text-center">Qty</th>
              </tr>
            </thead>

            <tbody>
              {loan.loan_details?.length > 0 ? (
                loan.loan_details.map((d: any, i: number) => (
                  <tr key={d.id} className="border-t hover:bg-slate-50">
                    <td className="p-4 text-center">{i + 1}</td>
                    <td className="p-4 font-medium">
                      {d.book?.title || "-"}
                    </td>
                    <td className="p-4 text-center">{d.rack_code}</td>
                    <td className="p-4 text-center">{d.qty}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-slate-400">
                    Tidak ada buku dipinjam
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          onClick={() => router.push("/admin/loan")}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl"
        >
          Kembali
        </button>

      </div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}