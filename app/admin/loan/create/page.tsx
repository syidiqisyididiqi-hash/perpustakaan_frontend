"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LoansAPI } from "@/app/lib/api/loans";
import { UsersAPI } from "@/app/lib/api/users";
import { BooksAPI } from "@/app/lib/api/book";
import { LoadingCard } from "../../components/LoadingCard";
import { Alert } from "@/app/lib/alert";


type Detail = {
  book_id: string;
  rack_code: string;
  qty: number;
};

type User = {
  id: number;
  name: string;
};

type Book = {
  id: number;
  title: string;
  rack_code: string;
};

export default function CreateLoanPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    user_id: "",
    loan_date: "",
    due_date: "",
  });

  const [details, setDetails] = useState<Detail[]>([
    { book_id: "", rack_code: "", qty: 1 },
  ]);

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, []);


  const fetchUsers = async () => {
    try {
      const data: any = await UsersAPI.getAll();
      setUsers(data.data || []);
    } catch (err) {
      Alert.error("Gagal mengambil data user");
    }
  };

  const fetchBooks = async () => {
    try {
      const data: any = await BooksAPI.getAll();
      setBooks(data.data || []);
    } catch (err) {
      alert("Gagal mengambil data buku");
    }
  };

  const handleBookChange = (index: number, bookId: string) => {
    const selectedBook = books.find((b) => String(b.id) === bookId);

    setDetails((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              book_id: bookId,
              rack_code: selectedBook?.rack_code ?? "",
            }
          : item
      )
    );
  };

  const handleQtyChange = (index: number, value: number) => {
    setDetails((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, qty: value > 0 ? value : 1 }
          : item
      )
    );
  };

  const addRow = () => {
    setDetails((prev) => [
      ...prev,
      { book_id: "", rack_code: "", qty: 1 },
    ]);
  };

  const removeRow = (index: number) => {
    if (details.length === 1) {
      Alert.error("Minimal harus ada 1 buku");
      return;
    }
    setDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.user_id || !form.loan_date || !form.due_date) {
      Alert.error("Lengkapi data utama");
      return;
    }

    if (details.some((d) => !d.book_id)) {
      Alert.error("Semua buku harus dipilih");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        user_id: Number(form.user_id),
        loan_date: form.loan_date,
        due_date: form.due_date,
        details,
      };

      const data: any = await LoansAPI.create(payload);

      if (!data.status) {
        throw new Error(data.message || "Gagal menyimpan");
      }

      await Alert.success("Pinjaman berhasil dibuat");
      router.push("/admin/loan");
    } catch (err: any) {
      await Alert.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingCard />;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Tambah Pinjaman</h1>
          <p className="text-indigo-100 text-sm">
            Tambahkan data pinjaman buku
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid md:grid-cols-3 gap-5">
              <select
                required
                value={form.user_id}
                onChange={(e) =>
                  setForm({ ...form, user_id: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border text-sm"
              >
                <option value="">Pilih User</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                required
                value={form.loan_date}
                onChange={(e) =>
                  setForm({ ...form, loan_date: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border text-sm"
              />

              <input
                type="date"
                required
                value={form.due_date}
                onChange={(e) =>
                  setForm({ ...form, due_date: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border text-sm"
              />
            </div>

            <div className="space-y-4">
              <h2 className="font-semibold text-slate-700 border-b pb-2">
                Daftar Buku
              </h2>

              {details.map((d, i) => (
                <div key={i} className="grid md:grid-cols-4 gap-4">

                  <select
                    required
                    value={d.book_id}
                    onChange={(e) =>
                      handleBookChange(i, e.target.value)
                    }
                    className="w-full px-4 py-2.5 rounded-lg border text-sm"
                  >
                    <option value="">Pilih Buku</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>

                  <input
                    value={d.rack_code}
                    readOnly
                    className="w-full px-4 py-2.5 rounded-lg border text-sm bg-gray-100"
                  />

                  <input
                    type="number"
                    min="1"
                    value={d.qty}
                    onChange={(e) =>
                      handleQtyChange(i, Number(e.target.value))
                    }
                    className="w-full px-4 py-2.5 rounded-lg border text-sm"
                  />

                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    className="bg-red-500 text-white rounded-lg"
                  >
                    Hapus
                  </button>

                </div>
              ))}

              <button
                type="button"
                onClick={addRow}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl"
              >
                Tambah Buku
              </button>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full border py-3 rounded-xl"
              >
                Batal
              </button>

              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl"
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