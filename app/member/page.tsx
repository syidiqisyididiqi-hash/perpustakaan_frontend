"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Sparkles, 
  BookOpen, 
  ArrowUpRight, 
  Search, 
  Library,
  ArrowRight
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Category = { id: number; name: string };
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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        
        const res = await fetch(`${API_URL}/api/books`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Gagal mengambil data");
        
        const data = await res.json();
        const finalData = Array.isArray(data) ? data : data.data || [];
        setBooks(finalData);
      } catch (error) {
        console.error("Error fetching books:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const displayedBooks = filteredBooks.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 selection:bg-indigo-100 overflow-x-hidden">
      
      <section className="relative pt-20 pb-12 px-6 md:px-20 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[5%] right-[-2%] w-[25%] h-[25%] bg-indigo-200/30 rounded-full blur-[80px]" />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white shadow-sm border border-slate-100 text-indigo-600 text-xs font-bold animate-bounce-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Perpustakaan Digital Masa Kini</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-slate-950">
              Baca Tanpa <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 text-glow">
                Batas Jarak.
              </span>
            </h1>

            <p className="text-base text-slate-500 max-w-md leading-relaxed font-medium">
              Temukan ribuan koleksi buku digital terbaik. Tingkatkan pengetahuanmu dengan akses mudah di mana saja.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/member/books" className="group px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm transition-all hover:bg-indigo-600 shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                Mulai Baca <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </Link>
              
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari judul buku..." 
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:grid grid-cols-2 gap-3 scale-90 origin-right">
            <div className="space-y-3 pt-8">
              <div className="h-48 bg-indigo-100 rounded-[2rem] relative overflow-hidden shadow-xl">
                <Image src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400" alt="Book 1" fill className="object-cover" unoptimized />
              </div>
              <div className="h-32 bg-white p-6 rounded-[2rem] shadow-lg border border-slate-50">
                <Library className="w-6 h-6 text-indigo-600 mb-1" />
                <p className="text-xl font-black italic text-slate-900">10K+</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Koleksi</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-32 bg-slate-950 rounded-[2rem] p-6 text-white flex flex-col justify-end">
                <p className="text-[10px] font-medium opacity-60">Komunitas</p>
                <p className="text-sm font-bold leading-tight">2.5k Pembaca Aktif</p>
              </div>
              <div className="h-48 bg-blue-50 rounded-[2rem] relative overflow-hidden shadow-xl">
                <Image src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=400" alt="Book 2" fill className="object-cover" unoptimized />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 md:px-20 py-16 relative">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 italic">Rekomendasi Utama</h2>
            <div className="h-1.5 w-16 bg-indigo-600 rounded-full" />
          </div>

          <Link href="/member/books" className="group flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition-all">
            Lihat Katalog
            <span className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-3 shrink-0 w-[200px]">
                <div className="aspect-[3/4.2] bg-slate-200 rounded-[2rem]" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : displayedBooks.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">Ops! Belum ada buku yang dapat ditampilkan.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-8 pt-2 px-1 scrollbar-hide snap-x snap-mandatory">
              {displayedBooks.map((book) => (
                <Link 
                  key={book.id} 
                  href={`/member/books/${book.id}`} 
                  className="group/card shrink-0 w-[200px] md:w-[220px] snap-start"
                >
                  <div className="flex flex-col h-full">
                    <div className="relative aspect-[3/4.2] rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200 transition-all duration-500 group-hover/card:-translate-y-2 group-hover/card:shadow-indigo-200/50">
                      <Image
                        src={book.cover ? `${API_URL}/storage/${book.cover}` : "/no-image.svg"}
                        alt={book.title}
                        fill
                        unoptimized
                        className="object-cover transform transition-transform duration-700 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-all" />
                      <div className="absolute bottom-4 left-4 opacity-0 group-hover/card:opacity-100 transition-all translate-y-2 group-hover/card:translate-y-0 duration-500">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest">
                          Baca <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1 px-1">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-md">
                        {typeof book.category === "string" ? book.category : book.category?.name || "General"}
                      </span>
                      <h3 className="text-base font-black text-slate-900 leading-tight line-clamp-1 group-hover/card:text-indigo-600 transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-400">
                        {typeof book.author === "string" ? book.author : book.author?.name || "Unknown Author"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="shrink-0 w-10 md:hidden" />
            </div>

            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#fafafa] to-transparent pointer-events-none hidden md:block" />
          </div>
        )}
      </section>

      <style jsx global>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .text-glow {
          text-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
        }
      `}</style>
    </div>
  );
}