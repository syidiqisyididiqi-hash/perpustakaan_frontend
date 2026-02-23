"use client";

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { CategoriesAPI } from "@/app/lib/api/category";
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

export default function CreateBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [previewCover, setPreviewCover] = useState<string>("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await CategoriesAPI.getAll();
        setCategories(data.data || []);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "cover" && files) {
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

      fd.append("category_id", String(Number(form.category_id)));
      fd.append("isbn", form.isbn);
      fd.append("title", form.title);
      fd.append("author", form.author);
      fd.append("publisher", form.publisher);
      fd.append("published_year", String(Number(form.published_year)));
      fd.append("stock", String(Number(form.stock)));
      fd.append("rack_code", form.rack_code);

      if (form.cover) fd.append("cover", form.cover);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const headers: any = { Accept: "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(API_URL, {
        method: "POST",
        body: fd,
        headers,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Buku berhasil ditambahkan");
      router.push("/admin/book");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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
              <Input icon={<FiCalendar />} name="published_year" placeholder="Tahun Terbit" onChange={handleChange} />
              <Input icon={<FiMapPin />} name="rack_code" placeholder="Kode Rak" onChange={handleChange} />
              <Input icon={<FiPackage />} name="stock" type="number" placeholder="Stock" onChange={handleChange} />
            </div>

            {previewCover && (
              <img src={previewCover} className="w-40 rounded-lg border mb-3" />
            )}

            <div className="relative">
              <div className="absolute left-3 top-3 text-slate-400">
                <FiImage />
              </div>
              <input
                type="file"
                name="cover"
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/book")}
                className="w-full border py-3 rounded-xl"
              >
                Batal
              </button>

              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl"
              >
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
        className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm"
      />
    </div>
  );
}