"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingCard } from "@/app/admin/components/LoadingCard";

const API_URL = "http://127.0.0.1:8000/api/books";
const LOAN_API = "http://127.0.0.1:8000/api/loans";

type Book = {
  id: number;
  title: string;
  author?: string;
  isbn?: string;
  publisher?: string;
  published_year?: number;
  rack_code?: string;
  description?: string;
  stock: number;
  cover?: string;
};

export default function BookDetailPage() {

  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBorrow, setShowBorrow] = useState(false);

  const [form, setForm] = useState({
    borrow_date: "",
    return_date: "",
  });

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    fetchBook(token);

  }, []);

  const fetchBook = async (token: string) => {

    try {

      const res = await fetch(`${API_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setBook(data.data ?? data);

    } catch {
      console.error("Gagal mengambil detail buku");
    } finally {
      setLoading(false);
    }

  };

  const handleBorrow = async (e: any) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(LOAN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          book_id: book?.id,
          borrow_date: form.borrow_date,
          return_date: form.return_date,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Gagal meminjam buku");
        return;
      }

      alert("Buku berhasil dipinjam!");

      setShowBorrow(false);

      fetchBook(token || "");

    } catch {

      alert("Terjadi kesalahan server");

    }

  };

  if (loading) {
    return <LoadingCard />;
  }

  if (!book) {
    return (
      <div className="text-center py-20 text-red-400">
        Buku tidak ditemukan
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      <button
        onClick={() => router.push("/member/books")}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
      >
        ← Kembali
      </button>

      <div className="bg-white rounded-xl shadow p-8 grid md:grid-cols-2 gap-8">

        <img
          src={
            book.cover
              ? `http://127.0.0.1:8000/storage/${book.cover}`
              : "/no-image.png"
          }
          alt={book.title}
          className="w-full h-[420px] object-cover rounded-lg"
        />

        <div className="flex flex-col">

          <h1 className="text-3xl font-bold mb-3">
            {book.title}
          </h1>

          <p className="text-gray-500 mb-4">
            {book.author}
          </p>

          <div className="space-y-2 text-sm text-gray-700">

            <p><b>ISBN:</b> {book.isbn || "-"}</p>
            <p><b>Publisher:</b> {book.publisher || "-"}</p>
            <p><b>Year:</b> {book.published_year || "-"}</p>
            <p><b>Rack:</b> {book.rack_code || "-"}</p>
            <p><b>Stock:</b> {book.stock}</p>

          </div>

          <button
            onClick={() => setShowBorrow(true)}
            disabled={book.stock === 0}
            className={`mt-6 py-3 rounded-lg font-semibold ${
              book.stock > 0
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500"
            }`}
          >
            Pinjam Buku
          </button>

          {showBorrow && (

            <form
              onSubmit={handleBorrow}
              className="mt-6 space-y-4 border-t pt-6"
            >

              <h2 className="font-semibold text-lg">
                Form Peminjaman Buku
              </h2>

              <div>

                <label className="text-sm">
                  Tanggal Pinjam
                </label>

                <input
                  type="date"
                  required
                  className="w-full border rounded-lg p-2"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      borrow_date: e.target.value,
                    })
                  }
                />

              </div>

              <div>

                <label className="text-sm">
                  Tanggal Kembali
                </label>

                <input
                  type="date"
                  required
                  className="w-full border rounded-lg p-2"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      return_date: e.target.value,
                    })
                  }
                />

              </div>

              <div className="flex gap-3">

                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  Konfirmasi Pinjam
                </button>

                <button
                  type="button"
                  onClick={() => setShowBorrow(false)}
                  className="bg-gray-300 px-6 py-2 rounded-lg"
                >
                  Batal
                </button>

              </div>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}