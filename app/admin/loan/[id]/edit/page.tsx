"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FiUser, FiCalendar } from "react-icons/fi";
import { LoansAPI } from "@/app/lib/api/loans";
import { UsersAPI } from "@/app/lib/api/users";
import { BooksAPI } from "@/app/lib/api/book";
import { LoadingCard } from "@/app/admin/components/LoadingCard";
import { Alert } from "@/app/lib/alert";

type User = { id: number; name: string };
type Book = { id: number; title: string; rack_code: string };
type Detail = { id?: number; book_id: string; qty: number; rack_code: string };

export default function EditLoanPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [form, setForm] = useState({
    user_id: "",
    loan_date: "",
    due_date: "",
    return_date: "",
    status: "borrowed",
  });
  const [details, setDetails] = useState<Detail[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchUsers();
    fetchBooks();
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

  const fetchBooks = async () => {
    try {
      const data: any = await BooksAPI.getAll();
      if (data.status) setBooks(data.data);
    } catch {
      Alert.error("Gagal mengambil data buku");
    }
  };

  const fetchLoan = async () => {
    try {
      const data: any = await LoansAPI.getById(Number(id));
      if (!data.status) throw new Error("Data pinjaman tidak ditemukan");

      const loan = data.data;
      const toDate = (d: string | null) => (d ? d.split("T")[0] : "");

      setForm({
        user_id: String(loan.user_id),
        loan_date: toDate(loan.loan_date),
        due_date: toDate(loan.due_date),
        return_date: toDate(loan.return_date),
        status: loan.return_date ? "returned" : "borrowed",
      });

      setDetails(
        (loan.loan_details || []).map((d: any) => ({
          id: d.id,
          book_id: String(d.book_id),
          qty: d.qty,
          rack_code: d.rack_code,
        }))
      );
    } catch (err: any) {
      Alert.error(err.message || "Gagal mengambil data pinjaman");
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
          value === "returned" ? new Date().toISOString().split("T")[0] : "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookChange = (index: number, bookId: string) => {
    const book = books.find((b) => b.id === Number(bookId));
    setDetails((prev) =>
      prev.map((d, i) =>
        i === index
          ? { ...d, book_id: bookId, rack_code: book?.rack_code || "" }
          : d
      )
    );
  };

  const handleQtyChange = (index: number, qty: number) => {
    setDetails((prev) =>
      prev.map((d, i) => (i === index ? { ...d, qty: qty > 0 ? qty : 1 } : d))
    );
  };

  const addRow = () => setDetails((prev) => [...prev, { book_id: "", qty: 1, rack_code: "" }]);
  const removeRow = (index: number) => {
    if (details.length === 1) return Alert.error("Minimal harus ada 1 buku");
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const isFormValid = () =>
    form.user_id &&
    form.loan_date &&
    form.due_date &&
    details.every((d) => d.book_id);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid()) return Alert.error("Lengkapi semua data sebelum menyimpan");

    setLoading(true);

    try {
      const payload = {
        user_id: Number(form.user_id),
        loan_date: form.loan_date,
        due_date: form.due_date,
        return_date: form.return_date || undefined,
        details: details.map((d) => ({
          id: d.id,
          book_id: Number(d.book_id),
          qty: d.qty,
          rack_code: d.rack_code,
          returned_at: form.status === "returned" ? new Date().toISOString() : null,
        })),
      };

      const data: any = await LoansAPI.update(Number(id), payload);
      if (!data.status) throw new Error(data.message || "Gagal update pinjaman");

      Alert.success("Pinjaman berhasil diupdate");
      router.push("/admin/loan");
    } catch (err: any) {
      Alert.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <LoadingCard />;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit Pinjaman</h1>
          <p className="text-indigo-100 text-sm mt-1">Perbarui data pinjaman</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-4">
              <h2 className="font-semibold text-slate-700 border-b pb-2">Informasi Pinjaman</h2>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">User</label>
                <select
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm"
                >
                  <option value="">Pilih User</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Tanggal Pinjam</label>
                  <input type="date" name="loan_date" value={form.loan_date} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm" />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-slate-700">Batas Pengembalian</label>
                  <input type="date" name="due_date" value={form.due_date} onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Tanggal Dikembalikan</label>
                <input type="date" name="return_date" value={form.return_date} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm" />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Status Pinjaman</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm">
                  <option value="borrowed">Masih Dipinjam</option>
                  <option value="returned">Sudah Dikembalikan</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="font-semibold text-slate-700 border-b pb-2">Daftar Buku</h2>
              {details.map((d, i) => (
                <div key={i} className="grid md:grid-cols-4 gap-4">
                  <select value={d.book_id} onChange={e => handleBookChange(i, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm">
                    <option value="">Pilih Buku</option>
                    {books.map(b => (
                      <option key={b.id} value={b.id}>{b.title} ({b.rack_code})</option>
                    ))}
                  </select>

                  <input type="number" min={1} value={d.qty} onChange={e => handleQtyChange(i, Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm" />

                  <input type="text" value={d.rack_code} readOnly
                    className="w-full px-4 py-2.5 rounded-xl border text-sm bg-gray-100" />

                  <button type="button" onClick={() => removeRow(i)}
                    className="bg-red-500 text-white rounded-xl px-4 py-2">Hapus</button>
                </div>
              ))}
              <button type="button" onClick={addRow}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl">Tambah Buku</button>
            </div>

            <div className="flex gap-3 mt-4">
              <button type="button" onClick={() => router.back()} className="flex-1 border py-3 rounded-xl">Batal</button>
              <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl flex justify-center items-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? "Menyimpan..." : "Update Pinjaman"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}