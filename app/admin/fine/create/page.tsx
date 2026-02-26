"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

const API_FINE = "http://127.0.0.1:8000/api/fines";
const API_LOAN = "http://127.0.0.1:8000/api/loans";

export default function CreateFinePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loans, setLoans] = useState<any[]>([]);

  const [form, setForm] = useState({
    loan_id: "",
    rack_code: "",
    overdue_days: "0",
    total_fine: "0",
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await fetch(API_LOAN);
      const data = await res.json();
      if (data.status) setLoans(data.data);
    } catch (err) {
      console.error("Failed to fetch loans", err);
    }
  };

  useEffect(() => {
    if (!form.loan_id) return;

    const loan = loans.find((l) => l.id.toString() === form.loan_id);
    if (!loan) return;

    const rack = loan.loan_details?.[0]?.book?.rack_code || "-";
    let lateDays = 0;

    if (loan.return_date) {
      const today = new Date();
      const due = new Date(loan.return_date);
      if (today > due) {
        const diffTime = Math.abs(today.getTime() - due.getTime());
        lateDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }

    const finePerDay = 5000;
    const total = lateDays * finePerDay;

    setForm((prev) => ({
      ...prev,
      rack_code: rack,
      overdue_days: lateDays.toString(),
      total_fine: total.toString(),
    }));
  }, [form.loan_id, loans]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        loan_id: parseInt(form.loan_id),
        overdue_days: parseInt(form.overdue_days),
        total_fine: parseFloat(form.total_fine),
        status: "unpaid",
      };

      const res = await fetch(API_FINE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan denda");

      router.push("/admin/fine");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Tambah Denda</h1>
          <p className="text-red-100 text-sm">Data otomatis dihitung dari loan</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Section title="Pilih Loan">
              <Select
                name="loan_id"
                value={form.loan_id}
                onChange={handleChange}
                options={loans}
                placeholder="Pilih Loan"
              />
            </Section>

            <Section title="Informasi Otomatis">
              <Input readOnly value={form.rack_code} placeholder="Rack" />
              <Input readOnly value={form.overdue_days} placeholder="Hari Telat" />
              <Input
                readOnly
                value={form.total_fine ? `Rp ${Number(form.total_fine).toLocaleString("id-ID")}` : "Rp 0"}
                placeholder="Total Denda"
              />
            </Section>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || !form.loan_id}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-semibold shadow hover:bg-red-700 disabled:bg-slate-400"
              >
                {loading ? "Menyimpan..." : "Simpan Denda"}
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

function Input({ type = "text", ...props }: any) {
  return (
    <input
      type={type}
      {...props}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 outline-none"
    />
  );
}

function Select({ name, value, onChange, options, placeholder }: any) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"
    >
      <option value="">-- {placeholder} --</option>
      {options.map((opt: any) => (
        <option key={opt.id} value={opt.id}>
          Loan #{opt.id} — {opt.user?.name}
        </option>
      ))}
    </select>
  );
}