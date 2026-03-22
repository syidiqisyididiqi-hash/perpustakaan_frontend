"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiFilter, FiBookOpen } from "react-icons/fi";
import Link from "next/link";

const API_URL = "http://127.0.0.1:8000/api/books";

type Book = {
  id: number;
  title: string;
  author?: string;
  stock: number;
  cover?: string;
  category?: string | { name: string };
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
        <div className="h-8 bg-slate-200 rounded-lg mt-4" />
      </div>
    </div>
  );
}

export default function MemberBooksPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ["Semua", "Teknologi", "Sains", "Fiksi", "Bisnis", "Sejarah"];

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
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

  const filtered = books.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
                          (b.author?.toLowerCase().includes(search.toLowerCase()));
    
    const categoryName = typeof b.category === "string" ? b.category : b.category?.name;
    const matchesCategory = selectedCategory === "Semua" || categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const perPage = 8;
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const currentBooks = filtered.slice(start, start + perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold mb-2">
            <FiBookOpen />
            <span>Koleksi Terupdate</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Katalog Buku</h1>
          <p className="text-slate-500 font-medium">Temukan dan pinjam buku favoritmu hari ini.</p>
        </div>

        <div className="relative w-full md:w-96 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Cari judul, penulis..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 pr-4 border-r border-slate-200 mr-2 shrink-0">
          <FiFilter className="text-slate-400" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</span>
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col group overflow-hidden"
            >
              <div className="relative aspect-[3/4.2] overflow-hidden bg-slate-50">
                <img
                  src={book.cover ? `http://127.0.0.1:8000/storage/${book.cover}` : "/no-image.png"}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => ((e.target as HTMLImageElement).src = "/no-image.png")}
                />
                
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-sm flex items-center gap-2 ${
                    book.stock === 0 
                    ? "bg-red-50/80 border-red-100 text-red-600" 
                    : "bg-white/80 border-white/50 text-slate-700"
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${book.stock === 0 ? "bg-red-500" : "bg-green-500"}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{book.stock} Stok</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="mb-2">
                   <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                    {typeof book.category === "string" ? book.category : book.category?.name || "General"}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors mb-1">
                  {book.title}
                </h3>
                <p className="text-xs text-slate-400 font-medium italic mb-4">
                  by {book.author || "Unknown Author"}
                </p>

                <Link href={`/member/books/${book.id}`} className="mt-auto">
                  <button
                    disabled={book.stock === 0}
                    className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      book.stock === 0
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-900 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-100 active:scale-95"
                    }`}
                  >
                    {book.stock === 0 ? "Stok Habis" : "Detail Buku"}
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-4">
              <FiSearch className="text-slate-300 text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Tidak ada buku</h3>
            <p className="text-slate-500 text-sm">Coba kata kunci lain atau pilih kategori berbeda.</p>
          </div>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-10">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
          >
            <FiChevronLeft className="text-lg" />
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-11 h-11 rounded-xl text-xs font-black transition-all ${
                  page === i + 1
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-indigo-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="p-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
          >
            <FiChevronRight className="text-lg" />
          </button>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}