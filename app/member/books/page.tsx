"use client";

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000/api/books";

type Book = {
  id: number;
  title: string;
  author?: string;
  stock: number;
  cover?: string;
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded mt-4" />
      </div>
    </div>
  );
}

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
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBooks(data.data ?? []);
    } catch (error) {
      console.error("Error fetch books");
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
      <div className="bg-gradient-to-r from-green-700 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold">Library Books</h1>
        <p className="opacity-90 mt-1">Browse and borrow available books</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
        <FiSearch className="text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full outline-none text-sm"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : currentBooks.length > 0
          ? currentBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow hover:shadow-xl transition duration-300 overflow-hidden flex flex-col group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      book.cover
                        ? `http://127.0.0.1:8000/storage/${book.cover}`
                        : "/no-image.png"
                    }
                    alt={book.title}
                    className="h-56 w-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/no-image.png")
                    }
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {book.title}
                  </h3>

                  <p className="text-gray-500 text-sm mb-1">
                    {book.author || "Unknown Author"}
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    Stock:{" "}
                    <span
                      className={`font-semibold ${
                        book.stock === 0
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {book.stock}
                    </span>
                  </p>

                  <Link href={`/member/books/${book.id}`}>
                    <button className="mt-auto w-full py-2 rounded-lg font-semibold transition bg-green-600 text-white hover:bg-green-700 active:scale-95">
                      Detail Buku
                    </button>
                  </Link>
                </div>
              </div>
            ))
          : (
            <div className="col-span-3 text-center text-gray-500 py-10">
              Buku tidak ditemukan 😢
            </div>
          )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4 flex-wrap">
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
      )}
    </div>
  );
}