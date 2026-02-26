"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { FiBookOpen, FiHash, FiDollarSign } from "react-icons/fi";

const API_FINE = "http://127.0.0.1:8000/api/fines";
const API_LOAN = "http://127.0.0.1:8000/api/loans";

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
    fetchLoans();
    fetchFine();
  }, []);

  const fetchLoans = async () => {
    const res = await fetch(API_LOAN);
    const data = await res.json();
    if (data.status) setLoans(data.data);
  };

  const fetchFine = async () => {
    try {
      const res = await fetch(`${API_FINE}/${id}`);
      const data = await res.json();
      const fine = data.data;

      setForm({
        loan_id: fine.loan_id.toString(),
        rack_code: fine.rack_code,
        overdue_days: fine.overdue_days.toString(),
        total_fine: fine.total_fine.toString(),
        status: fine.status,
      });
    } catch {
      alert("Gagal mengambil data denda");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (!form.loan_id) return;

    const loan = loans.find((l) => l.id.toString() === form.loan_id);
    if (!loan) return;

    const rack = loan.loan_details?.[0]?.book?.rack_code || "-";

    setForm((prev) => ({
      ...prev,
      rack_code: rack,
    }));
  }, [form.loan_id, loans]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await fetch(`${API_FINE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overdue_days: Number(form.overdue_days),
          status: form.status,
        }),
      });

      router.push("/admin/fine");
    } catch {
      alert("Gagal update denda");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-red-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit Denda</h1>
          <p className="text-red-100 text-sm mt-1">Perbarui data denda peminjaman</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <Section title="Informasi Loan">
              <Select
                name="loan_id"
                value={form.loan_id}
                onChange={handleChange}
                options={loans}
              />
            </Section>

            <Section title="Informasi Denda">
              <Input icon={<FiHash />} value={form.rack_code} readOnly />
              <Input
                icon={<FiBookOpen />}
                name="overdue_days"
                value={form.overdue_days}
                onChange={handleChange}
                type="number"
              />
              <Input
                icon={<FiDollarSign />}
                value={`Rp ${Number(form.total_fine).toLocaleString("id-ID")}`}
                readOnly
              />
            </Section>

            <Section title="Status">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
              >
                <option value="unpaid">Belum Dibayar</option>
                <option value="paid">Sudah Dibayar</option>
              </select>
            </Section>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-slate-300 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-red-700 flex justify-center items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Menyimpan..." : "Update Denda"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}


function Section({ title, children }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-slate-700 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Input({ icon, ...props }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm outline-none"
      />
    </div>
  );
}

function Select({ name, value, onChange, options }: any) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
    >
      <option value="">Pilih Loan</option>
      {options.map((opt: any) => (
        <option key={opt.id} value={opt.id}>
          Loan #{opt.id} — {opt.user?.name}
        </option>
      ))}
    </select>
  );
}