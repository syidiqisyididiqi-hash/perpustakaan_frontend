"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FiUser, FiCalendar } from "react-icons/fi";
import { LoansAPI } from "@/app/lib/api/loans";
import { UsersAPI } from "@/app/lib/api/users";
import { LoadingCard } from "@/app/admin/components/LoadingCard";
import { Alert } from "@/app/lib/alert";

const API_URL = "http://127.0.0.1:8000/api/loans";

type User = {
  id: number;
  name: string;
};

export default function EditLoanPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [users, setUsers] = useState<User[]>([]);

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
    if (!id) return;
    fetchUsers();
    fetchLoan();
  }, [id]);


  const fetchUsers = async () => {
    try {
      const data: any = await UsersAPI.getAll();
      if (data.status) setUsers(data.data);
    } catch {
      Alert.error("Gagal mengambil data user");
    }
  };

  const fetchLoan = async () => {
    try {
      const data: any = await LoansAPI.getById(Number(id));
      if (!data.status) throw new Error();
      const loan = data.data;

      const toDate = (d: string | null) =>
        d ? d.split("T")[0] : "";

      const loanDate = toDate(loan.loan_date);
      const dueDate = toDate(loan.due_date);
      const returnDate = toDate(loan.return_date);

      setForm({
        user_id: String(loan.user_id), 
        loan_date: loanDate,
        due_date: dueDate,
        return_date: returnDate,
        status: returnDate ? "returned" : "borrowed",
      });
    } catch {
      Alert.error("Gagal mengambil data pinjaman");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "status") {
      setForm((prev) => ({
        ...prev,
        status: value,
        return_date:
          value === "returned"
            ? new Date().toISOString().split("T")[0]
            : "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.user_id || !form.loan_date || !form.due_date) {
      Alert.error("Lengkapi data wajib");
      return;
    }

    try {
      setLoading(true);

      const data: any = await LoansAPI.update(Number(id), {
        loan_date: form.loan_date,
        due_date: form.due_date,
        return_date: form.return_date || undefined,
      });

      if (!data.status) {
        throw new Error(data.message || "Gagal update");
      }

      await Alert.success("Pinjaman berhasil diupdate");
      router.push("/admin/loan");
    } catch (err: any) {
      await Alert.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };


  if (pageLoading) {
    return <LoadingCard />;
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
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function Input({ icon, name, value, onChange, type = "text" }: any) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-3 text-slate-400">{icon}</div>}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

function Select({ icon, name, value, options, onChange }: any) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-3 text-slate-400">{icon}</div>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        {options.map((opt: any) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit Pinjaman</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Perbarui data pinjaman
          </p>
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
                  options={users.map((u) => ({
                    value: u.id,
                    label: u.name,
                  }))}
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
                  className="w-full px-4 py-2.5 rounded-xl border text-sm"
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
                className="flex-1 border py-3 rounded-xl"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"
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