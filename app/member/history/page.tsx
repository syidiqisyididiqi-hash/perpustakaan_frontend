"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:8000/api/my-loans";

type History = {
  id: number;
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
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  const getStatus = (h: History) => {
    if (!h.returnedAt) return "dipinjam";
    if (h.fine > 0) return "terlambat";
    return "selesai";
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
            fineId: detail.fine_id,
            book: detail.book?.title || "-",
            rack: detail.rack_code || "-",
            borrowDate: new Date(loan.loan_date).toLocaleDateString("id-ID"),
            dueDate: new Date(loan.due_date).toLocaleDateString("id-ID"),
            returnedAt: detail.returned_at
              ? new Date(detail.returned_at).toLocaleDateString("id-ID")
              : null,
            fine: detail.fine_total || 0,
            fineStatus: detail.fine_status,
            overdueDays: detail.overdue_days || 0,
          }))
        );

        setHistories(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handlePayFine = async (method: string) => {
    if (!selectedFine) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://127.0.0.1:8000/api/fines/${selectedFine}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "paid",
            payment_method: method,
          }),
        }
      );

      const result = await res.json();

      if (result.status) {
        alert(`Denda dibayar via ${method} ✅`);
        setShowPayment(false);
        setSelectedFine(null);
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalFine = histories.reduce((sum, h) => sum + h.fine, 0);
  const belumKembali = histories.filter((h) => !h.returnedAt).length;
  const totalBuku = histories.length;

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          📚 Riwayat Peminjaman
        </h1>
        <p className="text-sm text-gray-500">
          Daftar semua buku yang pernah kamu pinjam
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-sm text-gray-500">Total Buku</p>
          <h2 className="text-xl font-bold text-gray-800">
            {totalBuku}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-sm text-gray-500">Belum Kembali</p>
          <h2 className="text-xl font-bold text-yellow-600">
            {belumKembali}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border">
          <p className="text-sm text-gray-500">Total Denda</p>
          <h2 className="text-xl font-bold text-red-600">
            {formatRupiah(totalFine)}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-slate-100 text-xs uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3 text-center">No</th>
                <th className="px-4 py-3 text-left">Buku</th>
                <th className="px-4 py-3 text-center">Rak</th>
                <th className="px-4 py-3 text-center">Pinjam</th>
                <th className="px-4 py-3 text-center">Jatuh Tempo</th>
                <th className="px-4 py-3 text-center">Kembali</th>
                <th className="px-4 py-3 text-right">Denda</th>
                <th className="px-4 py-3 text-center">Telat</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Denda</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : histories.length > 0 ? (
                histories.map((h, i) => {
                  const status = getStatus(h);

                  return (
                    <tr
                      key={h.id}
                      className={`hover:bg-slate-50 transition ${
                        h.fine > 0 ? "bg-red-50/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-center font-medium">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 font-medium">{h.book}</td>
                      <td className="px-4 py-3 text-center">{h.rack}</td>
                      <td className="px-4 py-3 text-center">{h.borrowDate}</td>
                      <td className="px-4 py-3 text-center">{h.dueDate}</td>
                      <td className="px-4 py-3 text-center">
                        {h.returnedAt || "-"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-red-600">
                        {h.fine > 0 ? formatRupiah(h.fine) : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {h.overdueDays > 0 ? (
                          <span className="text-red-600 font-medium">
                            {h.overdueDays} hari
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            status === "dipinjam"
                              ? "bg-yellow-100 text-yellow-700"
                              : status === "terlambat"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {h.fine > 0 ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              h.fineStatus === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {h.fineStatus === "paid" ? "Lunas" : "Belum"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {h.fine > 0 && h.fineStatus !== "paid" ? (
                          <button
                            onClick={() => {
                              setSelectedFine(h.fineId);
                              setShowPayment(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-medium transition"
                          >
                            Bayar
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="text-center py-10 text-gray-500">
                    📚 Belum ada riwayat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800">
              Pilih Metode Pembayaran
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePayFine("cash")}
                className="p-3 border rounded-xl hover:bg-gray-50"
              >
                💵 Cash
              </button>

              <button
                onClick={() => handlePayFine("dana")}
                className="p-3 border rounded-xl hover:bg-purple-50 text-purple-600 font-medium"
              >
                🟣 DANA
              </button>

              <button
                onClick={() => handlePayFine("ovo")}
                className="p-3 border rounded-xl hover:bg-green-50 text-green-600 font-medium"
              >
                🟢 OVO
              </button>

              <button
                onClick={() => handlePayFine("gopay")}
                className="p-3 border rounded-xl hover:bg-blue-50 text-blue-600 font-medium"
              >
                🔵 GoPay
              </button>
            </div>

            <button
              onClick={() => setShowPayment(false)}
              className="w-full text-sm text-gray-500 hover:underline"
            >
              Batal
            </button>
          </div>
        </div>
      )}

    </div>
  );
}