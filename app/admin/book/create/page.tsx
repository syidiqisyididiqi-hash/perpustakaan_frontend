"use client";

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { CategoriesAPI } from "@/app/lib/api/category";
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
import { LoadingCard } from "../../components/LoadingCard";

const API_URL = "http://127.0.0.1:8000/api/books";

export default function CreateBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [previewCover, setPreviewCover] = useState<string>("");

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
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoriesAPI.getAll();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Gagal memuat kategori");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, files } = target;

    if (name === "cover" && files && files[0]) {
      setForm({ ...form, cover: files[0] });
      setPreviewCover(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("category_id", form.category_id);
      fd.append("isbn", form.isbn);
      fd.append("title", form.title);
      fd.append("author", form.author);
      fd.append("publisher", form.publisher);
      fd.append("published_year", form.published_year);
      fd.append("stock", form.stock);
      fd.append("rack_code", form.rack_code);
      if (form.cover) fd.append("cover", form.cover);

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
        headers: {
          "Accept": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Gagal menambahkan buku");
      }

      await Alert.success("Buku berhasil ditambahkan");
      router.push("/admin/book");
    } catch (err: any) {
      Alert.error(err.message || "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return <LoadingCard />;
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Tambah Buku</h1>
          <p className="text-indigo-100 text-sm">
            Tambahkan buku baru ke sistem perpustakaan
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              <Input icon={<FiBook />} name="title" placeholder="Judul Buku" onChange={handleChange} />
              <Input icon={<FiUser />} name="author" placeholder="Penulis" onChange={handleChange} />
              <Input icon={<FiHash />} name="isbn" placeholder="ISBN" onChange={handleChange} />

              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <FiLayers />
                </div>
                <select
                  name="category_id"
                  onChange={handleChange}
                  required
                  disabled={loadingCategories}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm"
                >
                  <option value="">
                    {loadingCategories ? "Memuat..." : "Pilih Kategori"}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input icon={<FiPackage />} name="publisher" placeholder="Penerbit" onChange={handleChange} />
              <Input icon={<FiCalendar />} name="published_year" placeholder="Tahun Terbit" type="number" onChange={handleChange} />
              <Input icon={<FiMapPin />} name="rack_code" placeholder="Kode Rak" onChange={handleChange} />
              <Input icon={<FiPackage />} name="stock" type="number" placeholder="Stock" onChange={handleChange} />
            </div>

            {previewCover && (
              <img src={previewCover} className="w-40 rounded-lg border mb-3" alt="Preview" />
            )}

            <div className="relative">
              <div className="absolute left-3 top-3 text-slate-400">
                <FiImage />
              </div>
              <input
                type="file"
                name="cover"
                onChange={handleChange}
                accept="image/*"
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/book")}
                className="w-full border py-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 hover:bg-indigo-700 transition-colors"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Menyimpan..." : "Simpan Buku"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ icon, name, onChange, type = "text", placeholder }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        required
        className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}