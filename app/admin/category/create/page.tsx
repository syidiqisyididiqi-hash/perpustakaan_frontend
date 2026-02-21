"use client";

import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

const API_URL = "http://127.0.0.1:8000/api/categories";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menambahkan kategori");
      }

      alert("Kategori berhasil ditambahkan!");
      router.push("/admin/category");
    } catch (error: any) {
      alert("Gagal menambahkan kategori: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-5">

        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Tambah Kategori</h1>
          <p className="text-indigo-100 text-sm">Tambahkan kategori baru ke sistem perpustakaan</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-5">
          <form onSubmit={handleSubmit} className="space-y-6">

            <Section title="Detail Kategori">
              <Input name="name" placeholder="Nama Kategori" value={form.name} onChange={handleChange} />
              <InputArea name="description" placeholder="Deskripsi Kategori" value={form.description} onChange={handleChange} />
            </Section>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl font-semibold shadow hover:bg-indigo-700 transition"
              >
                {loading ? "Menyimpan..." : "Simpan Kategori"}
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

function Input({ name, onChange, placeholder, value }: any) {
  return (
    <div>
      <input
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        required
        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

function InputArea({ name, onChange, placeholder, value }: any) {
  return (
    <div>
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}