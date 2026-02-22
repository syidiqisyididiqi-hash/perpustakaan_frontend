"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { FiTag, FiEdit } from "react-icons/fi";

const API_URL = "http://127.0.0.1:8000/api/categories";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const category = data?.data ?? data;

      setForm({
        name: category?.name ?? "",
        description: category?.description ?? "",
      });
    } catch {
      alert("Gagal mengambil data kategori");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      router.push("/admin/category");
    } catch {
      alert("Terjadi kesalahan saat update kategori");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading)
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit Kategori</h1>
          <p className="text-indigo-100 text-sm mt-1">Perbarui data kategori sistem</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Section title="Informasi Kategori">
              <div className="space-y-4">
                <Input
                  icon={<FiTag />}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama Kategori"
                />
                <InputArea
                  icon={<FiEdit />}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Deskripsi Kategori"
                />
              </div>
            </Section>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-slate-300 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition flex justify-center items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Menyimpan..." : "Update Kategori"}
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
        required
        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

function InputArea({ icon, name, value, onChange, placeholder }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}