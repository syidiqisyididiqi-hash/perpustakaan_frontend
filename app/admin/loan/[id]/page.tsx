"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoansAPI } from "@/app/lib/api/loans";
import { LoadingCard } from "../../components/LoadingCard";

export default function LoanDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params?.id);

  const [loan, setLoan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return date.split("T")[0];
  };

  const fetchLoan = async () => {
    try {
      if (!id) return;

      const response: any = await LoansAPI.getById(id);

      if (response?.status && response?.data) {
        setLoan(response.data);
      } else {
        setLoan(null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setLoan(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoan();
  }, [id]);

  if (loading) return <LoadingCard />;

  if (!loan) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Data tidak ditemukan
      </div>
    );
  }

  const loanDetails = loan.loan_details || loan.loanDetails || [];
  const anyReturnedDetail = loanDetails.some((d: any) => d?.returned_at);
  const isReturned =
    loan.status === "returned" ||
    loan.return_date !== null ||
    anyReturnedDetail;

  const getReturnDateValue = () => {
    if (loan.return_date) return loan.return_date;
    if (anyReturnedDetail) {
      const dates = loanDetails
        .map((d: any) => d?.returned_at)
        .filter(Boolean)
        .sort((a: string, b: string) => (a > b ? -1 : 1));
      return dates[0] || null;
    }
    return null;
  };
  const displayReturnDate = formatDate(getReturnDateValue());

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
          <Info label="Tanggal Kembali" value={displayReturnDate} />

          <div>
            <p className="text-sm text-slate-500 mb-1">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isReturned
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {isReturned
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
              {loanDetails.length > 0 ? (
                loanDetails.map((d: any, i: number) => (
                  <tr key={d.id} className="border-t hover:bg-slate-50">
                    <td className="p-4 text-center">{i + 1}</td>
                    <td className="p-4 font-medium">
                      {d.book?.title || "-"}
                    </td>
                    <td className="p-4 text-center">
                      {d.rack_code || d.book?.rack_code || "-"}
                    </td>
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
          className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:opacity-90"
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