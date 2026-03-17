"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000/api/my-loans";

type History = {
  id: number;
  book: string;
  borrowDate: string;
  dueDate: string;
  returnedAt: string | null;
  fine: number;
  status: string;
};

export default function HistoryPage() {
  const router = useRouter();

  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (value: number) => {
    return `Rp ${Number(value).toLocaleString("id-ID")}`;
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (data.status) {
        const mapped = data.data.flatMap((loan: any) =>
          loan.loan_details.map((detail: any) => ({
            id: detail.id,
            book: detail.book?.title || "-",
            borrowDate: loan.loan_date
              ? new Date(loan.loan_date).toLocaleDateString("id-ID")
              : "-",
            dueDate: loan.due_date
              ? new Date(loan.due_date).toLocaleDateString("id-ID")
              : "-",
            returnedAt: detail.returned_at
              ? new Date(detail.returned_at).toLocaleDateString("id-ID")
              : null,
            fine: Number(detail.fine?.total_fine) || 0,
            status: loan.status,
          }))
        );

        setHistories(mapped);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Riwayat Peminjaman
        </h1>
        <p className="text-sm text-slate-500">
          Daftar buku yang pernah kamu pinjam
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4 text-center">No</th>
                <th className="p-4 text-left">Buku</th>
                <th className="p-4 text-center">Tanggal Pinjam</th>
                <th className="p-4 text-center">Jatuh Tempo</th>
                <th className="p-4 text-center">Tanggal Kembali</th>
                <th className="p-4 text-center">Denda</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              ) : histories.length > 0 ? (
                histories.map((h, index) => (
                  <tr key={h.id} className="border-t hover:bg-slate-50">
                    <td className="p-4 text-center font-semibold">
                      {index + 1}
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {h.book}
                    </td>

                    <td className="p-4 text-center">{h.borrowDate}</td>

                    <td className="p-4 text-center">{h.dueDate}</td>

                    <td className="p-4 text-center">
                      {h.returnedAt ? h.returnedAt : "-"}
                    </td>

                    <td className="p-4 text-center font-semibold text-red-600">
                      {h.fine > 0 ? formatRupiah(h.fine) : "-"}
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          h.status === "returned"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {h.status === "returned"
                          ? "Dikembalikan"
                          : "Dipinjam"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Tidak ada riwayat peminjaman
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}