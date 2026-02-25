"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/api/loans";
const API_USERS = "http://127.0.0.1:8000/api/users";
const API_BOOKS = "http://127.0.0.1:8000/api/books";

type Detail = {
  book_id: string;
  rack_code: string;
  qty: number;
};

export default function CreateLoanPage() {
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
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
      const res = await fetch(API_USERS);
      const data = await res.json();
      setUsers(data.data || []);
    } catch (err) {
      console.error("Gagal ambil users", err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch(API_BOOKS);
      const data = await res.json();
      setBooks(data.data || []);
    } catch (err) {
      console.error("Gagal ambil books", err);
    }
  };

  // 🔥 FIX PALING PENTING ADA DI SINI
  const handleBookChange = (index: number, bookId: string) => {
    const selectedBook = books.find(
      (b) => String(b.id) === String(bookId)
    );

    setDetails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        book_id: bookId,
        rack_code: selectedBook?.rack_code ?? "",
      };
      return updated;
    });
  };

  const handleQtyChange = (index: number, value: number) => {
    setDetails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        qty: value > 0 ? value : 1,
      };
      return updated;
    });
  };

  const addRow = () =>
    setDetails([...details, { book_id: "", rack_code: "", qty: 1 }]);

  const removeRow = (index: number) =>
    setDetails(details.filter((_, i) => i !== index));

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // 🔥 Validasi tambahan
    if (!form.user_id || !form.loan_date || !form.due_date) {
      alert("Lengkapi data utama");
      return;
    }

    if (details.some((d) => !d.book_id)) {
      alert("Pilih semua buku terlebih dahulu");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, details }),
      });

      if (!res.ok) throw new Error();

      alert("Pinjaman berhasil!");
      router.push("/admin/loan");
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  };

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