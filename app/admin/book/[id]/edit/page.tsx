"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { CategoriesAPI } from "@/app/lib/api/category";
import { LoadingCard } from "@/app/admin/components/LoadingCard";
import { Alert } from "@/app/lib/alert";
import {
  FiBook,
  FiUser,
  FiHash,
  FiLayers,
  FiPackage,
  FiMapPin,
  FiImage,
  FiCalendar,
} from "react-icons/fi";

const API_URL = "http://127.0.0.1:8000/api/books";
const STORAGE_URL = "http://127.0.0.1:8000/storage";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    category_id: "",
    isbn: "",
    title: "",
    author: "",
    publisher: "",
    published_year: "",
    stock: "",
    rack_code: "",
    cover: null as File | null,
    cover_url: "",
  });

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [bookRes, catRes] = await Promise.all([
        fetch(`${API_URL}/${id}`),
        CategoriesAPI.getAll(),
      ]);

      const bookJson = await bookRes.json();
      const book = bookJson.data ?? bookJson;

      setCategories(catRes.data || []);

      setForm({
        category_id: String(book.category_id ?? ""),
        isbn: book.isbn ?? "",
        title: book.title ?? "",
        author: book.author ?? "",
        publisher: book.publisher ?? "",
        published_year: String(book.published_year ?? ""),
        stock: String(book.stock ?? ""),
        rack_code: book.rack_code ?? "",
        cover: null,
        cover_url: book.cover ?? "",
      });
    } catch {
      Alert.error("Gagal mengambil data buku");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "cover" && files) {
      setForm({ ...form, cover: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "cover_url" && v !== null) fd.append(k, v as any);
      });
      fd.append("_method", "PUT");

      const res = await fetch(`${API_URL}/${id}`, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        await Alert.error(data.message || "Gagal update buku");
        return;
      }

      await Alert.success("Buku berhasil diupdate");
      router.push("/admin/book");
    } catch {
      Alert.error("Gagal update buku");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit Buku</h1>
          <p className="text-indigo-100 text-sm">Perbarui data buku perpustakaan</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <Section title="Informasi Buku">
              <div className="grid md:grid-cols-2 gap-5">
                <Input icon={<FiBook />} name="title" value={form.title} onChange={handleChange} placeholder="Judul Buku" />
                <Input icon={<FiUser />} name="author" value={form.author} onChange={handleChange} placeholder="Penulis" />
                <Input icon={<FiHash />} name="isbn" value={form.isbn} onChange={handleChange} placeholder="ISBN" />

                <SelectCategory
                  icon={<FiLayers />}
                  value={form.category_id}
                  options={categories}
                  onChange={handleChange}
                />

                <Input icon={<FiPackage />} name="publisher" value={form.publisher} onChange={handleChange} placeholder="Penerbit" />

                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400"><FiCalendar /></div>
                  <select
                    name="published_year"
                    value={form.published_year}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Pilih Tahun</option>
                    {Array.from({ length: new Date().getFullYear() - 1899 }, (_, i) => 1900 + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <Input icon={<FiMapPin />} name="rack_code" value={form.rack_code} onChange={handleChange} placeholder="Kode Rak" />
                <Input icon={<FiPackage />} name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" />
              </div>
            </Section>

            <Section title="Cover Buku">
              <div className="space-y-3">
                {form.cover_url && !form.cover && (
                  <img src={`${STORAGE_URL}/${form.cover_url}`} className="w-40 rounded-lg border" />
                )}

                {form.cover && (
                  <img src={URL.createObjectURL(form.cover)} className="w-40 rounded-lg border" />
                )}

                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400"><FiImage /></div>
                  <input
                    type="file"
                    name="cover"
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm"
                  />
                </div>
              </div>
            </Section>

            <div className="flex gap-3">
              <button type="button" onClick={() => router.back()} className="flex-1 border border-slate-300 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-100">
                Batal
              </button>

              <button disabled={loading} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-indigo-700">
                {loading ? "Menyimpan..." : "Update Buku"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-slate-700 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Input({ icon, name, value, onChange, placeholder }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

function SelectCategory({ icon, value, options, onChange }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <select
        name="category_id"
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      >
        <option value="">Pilih Kategori</option>
        {options.map((c: any) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
    </div>
  );
}