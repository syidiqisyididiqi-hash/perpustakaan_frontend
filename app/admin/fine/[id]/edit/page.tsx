"use client";

import { LoadingCard } from "@/app/admin/components/LoadingCard";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FiBookOpen, FiHash, FiDollarSign } from "react-icons/fi";
import { Alert } from "@/app/lib/alert";

const API_URL = "http://127.0.0.1:8000/api/fines";
const LOAN_API = "http://127.0.0.1:8000/api/loans";

export default function EditFinePage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [form, setForm] = useState({
    loan_id: "",
    rack_code: "",
    overdue_days: "0",
    total_fine: "0",
    status: "unpaid",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const loanRes = await fetch(LOAN_API);
        const loanData = await loanRes.json();

        if (loanData.status) {
          setLoans(loanData.data);
        }

        const fineRes = await fetch(`${API_URL}/${id}`);
        const fineData = await fineRes.json();

        if (!fineData.status) {
          Alert.error("Data denda tidak ditemukan");
          router.push("/admin/fine");
          return;
        }

        const fine = fineData.data;

        const loanId = fine.loan_detail?.loan?.id || "";
        const rackCode = fine.loan_detail?.book?.rack_code || "-";

        setForm({
          loan_id: loanId.toString(),
          rack_code: rackCode,
          overdue_days: fine.overdue_days?.toString() || "0",
          total_fine: fine.total_fine?.toString() || "0",
          status: fine.status || "unpaid",
        });
      } catch (err) {
        console.error(err);
        Alert.error("Gagal mengambil data denda");
      } finally {
        setPageLoading(false);
      }
    };

    if (id) loadData();
  }, [id, router]);

  useEffect(() => {
    const dailyRate = 5000;
    const total = Number(form.overdue_days) * dailyRate;

    setForm((prev) => ({
      ...prev,
      total_fine: total.toString(),
    }));
  }, [form.overdue_days]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: form.status,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.status) {
        Alert.error(data.message || "Gagal update denda");
        return;
      }

      await Alert.success("Status denda berhasil diperbarui");
      router.push("/admin/fine");
    } catch (err) {
      console.error(err);
      Alert.error("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <LoadingCard />;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit Denda</h1>
          <p className="text-red-100 text-sm mt-1">
            Perbarui status denda
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Informasi Loan</h3>

              <select
                name="loan_id"
                value={form.loan_id}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border bg-slate-100"
              >
                {loans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    {loan.id} - {loan.user?.name || "Unknown"}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-2.5 border rounded-xl">
                <FiHash />
                <input
                  value={form.rack_code}
                  readOnly
                  className="flex-1 outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 border rounded-xl">
                <FiBookOpen />
                <input
                  value={form.overdue_days}
                  readOnly
                  className="flex-1 outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center gap-3 px-4 py-2.5 border rounded-xl">
                <FiDollarSign />
                <input
                  value={`Rp ${Number(form.total_fine).toLocaleString("id-ID")}`}
                  readOnly
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Status</h3>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-xl"
              >
                <option value="unpaid">Belum Dibayar</option>
                <option value="paid">Sudah Dibayar</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border py-3 rounded-xl"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl"
              >
                {loading ? "Menyimpan..." : "Update Denda"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}