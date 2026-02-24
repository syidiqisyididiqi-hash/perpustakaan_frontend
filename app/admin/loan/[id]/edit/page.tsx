"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FiUser, FiCalendar } from "react-icons/fi";

const API_URL = "http://127.0.0.1:8000/api/loans";
const API_USERS = "http://127.0.0.1:8000/api/users";

export default function EditLoanPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState({
    user_id: "",
    loan_date: "",
    due_date: "",
    return_date: "",
    status: "borrowed",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchLoan();
  }, [id]);

  const fetchUsers = async () => {
    const res = await fetch(API_USERS);
    const data = await res.json();
    if (data.status) setUsers(data.data);
  };

  const fetchLoan = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      const loan = data.data;

      // compute default dates:
      const toDateString = (d: any) => (d ? String(d).split("T")[0] : "");

      const loanDateStr = toDateString(loan.loan_date) || new Date().toISOString().split("T")[0];

      let dueDateStr = toDateString(loan.due_date);
      if (!dueDateStr) {
        const base = loan.loan_date ? new Date(loan.loan_date) : new Date();
        const due = new Date(base);
        due.setDate(due.getDate() + 7); // default due +7 days
        dueDateStr = due.toISOString().split("T")[0];
      }

      const returnDateStr = toDateString(loan.return_date) || "";

      setForm({
        user_id: loan.user_id,
        loan_date: loanDateStr,
        due_date: dueDateStr,
        return_date: returnDateStr,
        status: returnDateStr ? "returned" : "borrowed",
      });
    } catch {
      alert("Gagal mengambil data pinjaman");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "status") {
      setForm({
        ...form,
        status: value,
        return_date: value === "returned"
          ? new Date().toISOString().split("T")[0]
          : "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          user_id: form.user_id,
          loan_date: form.loan_date,
          due_date: form.due_date,
          return_date: form.return_date || null,
        }),
      });

      if (!res.ok) throw new Error();

      router.push("/admin/loan");
    } catch {
      alert("Terjadi kesalahan saat update pinjaman");
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

        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit Pinjaman</h1>
          <p className="text-indigo-100 text-sm mt-1">Perbarui data pinjaman</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <Section title="Informasi Pinjaman">

              <Field label="User">
                <Select
                  icon={<FiUser />}
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  options={users.map(u => ({ value: u.id, label: u.name }))}
                />
              </Field>

              <Field label="Tanggal Pinjam">
                <Input
                  icon={<FiCalendar />}
                  name="loan_date"
                  type="date"
                  value={form.loan_date}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Batas Pengembalian">
                <Input
                  icon={<FiCalendar />}
                  name="due_date"
                  type="date"
                  value={form.due_date}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Tanggal Dikembalikan">
                <Input
                  icon={<FiCalendar />}
                  name="return_date"
                  type="date"
                  value={form.return_date}
                  onChange={handleChange}
                />
              </Field>

              <Field label="Status Pinjaman">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="borrowed">Masih Dipinjam</option>
                  <option value="returned">Sudah Dikembalikan</option>
                </select>
              </Field>

            </Section>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-slate-300 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition flex justify-center items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Menyimpan..." : "Update Pinjaman"}
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
      <p className="text-sm font-medium text-slate-600">{label}</p>
      {children}
    </div>
  );
}

function Input({ icon, name, value, onChange, type = "text" }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

function Select({ icon, name, value, onChange, options }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        <option value="">Pilih User</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}