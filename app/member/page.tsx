"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Category = {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

type Book = {
  id: number;
  title: string;
  author?: string | { id: number; name: string };
  cover?: string;
  category?: string | Category;
};

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/books`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();
        setBooks(Array.isArray(data) ? data : data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Tidak dapat mengambil data buku. Pastikan backend sudah running.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const displayedBooks = books.slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      <section className="relative overflow-hidden py-20 px-6 md:px-20 flex flex-col md:flex-row items-center justify-between">
        
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30 -z-10"></div>

        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Jelajahi Dunia{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Buku Digital
            </span>
          </h1>

          <p className="mt-5 text-lg text-gray-600 leading-relaxed">
            Temukan berbagai koleksi buku terbaik untuk menambah wawasan dan pengetahuanmu.
          </p>

          <div className="mt-8 flex gap-4">
            <Link href="/member/books">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-7 py-3 rounded-xl shadow-lg hover:scale-105 transition">
                Jelajahi Buku
              </button>
            </Link>
            <Link href="/member/panduan">
              <button className="border border-gray-300 px-7 py-3 rounded-xl hover:bg-gray-100 transition">
                Pelajari Lagi
              </button>
            </Link>
          </div>
        </div>

        <div className="mt-12 md:mt-0">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
            alt="library"
            width={320}
            height={320}
            className="drop-shadow-2xl"
          />
        </div>
      </section>

      <section className="px-6 md:px-20 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Buku Terbaru
          </h2>
          <Link href="/member/books">
            <button className="text-blue-600 hover:text-blue-800 font-semibold">
              Lihat Semua →
            </button>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">⚠️ Error: {error}</p>
            <p className="text-sm mt-1">Pastikan backend Laravel running di <code className="bg-red-100 px-2 py-1 rounded">http://127.0.0.1:8000</code></p>
          </div>
        )}

        {loading ? (
          <div className="flex gap-6 overflow-x-auto pb-3 snap-x snap-mandatory">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md animate-pulse w-[220px] h-[360px] shrink-0 snap-start">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tidak ada buku tersedia saat ini</p>
            <p className="text-gray-400 text-sm mt-2">Coba lagi nanti atau hubungi admin</p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-3 snap-x snap-mandatory">
            {displayedBooks.map((book) => (
              <Link key={book.id} href={`/member/books/${book.id}`}>
                <div className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden group w-[220px] h-[360px] shrink-0 snap-start">

                  <div className="relative w-full h-48">
                    <Image
                      src={
                        book.cover
                          ? `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/storage/${book.cover}`
                          : "/no-image.svg"
                      }
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                      unoptimized
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/no-image.svg";
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2">
                      {book.title}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {typeof book.author === "string"
                        ? book.author
                        : book.author?.name || "Unknown"}
                    </p>

                    {book.category && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded mt-2 inline-block">
                        {typeof book.category === "string"
                          ? book.category
                          : book.category?.name || "Unknown"}
                      </span>
                    )}
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}