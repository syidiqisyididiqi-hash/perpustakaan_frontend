"use client";

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/api/loans";
const API_USERS = "http://127.0.0.1:8000/api/users";

export default function CreateLoanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  const [form, setForm] = useState({
    user_id: "",
    loan_date: "",
    due_date: "",
    return_date: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_USERS);
      const data = await res.json();
      if (data.status) setUsers(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menambahkan pinjaman");
      }
      alert("Pinjaman berhasil ditambahkan!");
      router.push("/admin/loan");
    } catch (error: any) {
      alert("Gagal menambahkan pinjaman: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Tambah Pinjaman</h1>
          <p className="text-indigo-100 text-sm">Tambahkan data pinjaman buku</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-5">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Section title="Detail Pinjaman">

              <Field label="User">
                <Select
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  placeholder="Pilih User"
                  options={users.map((u) => ({ value: u.id, label: u.name }))}
                />
              </Field>

              <Field label="Tanggal Pinjam">
                <Input name="loan_date" type="date" value={form.loan_date} onChange={handleChange} />
              </Field>

              <Field label="Tanggal Jatuh Tempo">
                <Input name="due_date" type="date" value={form.due_date} onChange={handleChange} />
              </Field>

              <Field label="Tanggal Dikembalikan">
                <Input name="return_date" type="date" value={form.return_date} onChange={handleChange} />
              </Field>

            </Section>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
              >
                {loading ? "Menyimpan..." : "Simpan Pinjaman"}
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

function Field({ label, children }: any) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function Input({ name, onChange, value, type = "text" }: any) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
    />
  );
}

function Select({ name, onChange, value, options, placeholder }: any) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
    >
      <option value="">{placeholder}</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}