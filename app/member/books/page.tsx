"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { LoadingCard } from "@/app/admin/components/LoadingCard";

const API_URL = "http://127.0.0.1:8000/api/books";

type Book = {
  id: number;
  title: string;
  author?: string;
  stock: number;
  cover?: string;
};

export default function MemberBooksPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {

      const token = localStorage.getItem("token");

      const res = await fetch(API_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setBooks(data.data ?? []);

    } catch (error) {
      console.error("Gagal mengambil data buku");
    } finally {
      setLoading(false);
    }
  };

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const perPage = 6;
  const totalPages = Math.ceil(filtered.length / perPage);

  const start = (page - 1) * perPage;
  const currentBooks = filtered.slice(start, start + perPage);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Library Books</h1>
        <p className="opacity-90 mt-1">
          Browse and borrow available books
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl shadow flex items-center gap-3">
        <FiSearch className="text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full outline-none"
        />
      </div>

      {loading ? (
        <LoadingCard />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {currentBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={
                  book.cover
                    ? `http://127.0.0.1:8000/storage/${book.cover}`
                    : "/no-image.png"
                }
                alt={book.title}
                className="h-56 w-full object-cover"
              />

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-lg">
                  {book.title}
                </h3>

                <p className="text-gray-500 text-sm mb-2">
                  {book.author}
                </p>

                <p className="text-sm text-gray-600 mb-4">
                  Stock:{" "}
                  <span className="font-semibold">
                    {book.stock}
                  </span>
                </p>

                <Link href={`/member/books/${book.id}`}>
                  <button className="mt-auto w-full py-2 rounded-lg font-semibold transition bg-green-600 text-white hover:bg-green-700">
                    Detail Buku
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-2 pt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded ${
              page === i + 1
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}