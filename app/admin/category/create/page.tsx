"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingCard } from "../../components/LoadingCard";
import { Alert } from "@/app/lib/alert";
import { FiTag, FiEdit } from "react-icons/fi";

const API_URL = "http://127.0.0.1:8000/api/categories";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === "" ? null : v])
      );

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        await Alert.error(data.message || "Gagal menambahkan kategori");
        return;
      }

      await Alert.success("Kategori berhasil ditambahkan");
      router.push("/admin/category");
    } catch (error: any) {
      Alert.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingCard />;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Tambah Kategori</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Tambahkan kategori baru ke sistem perpustakaan
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <Section title="Informasi Kategori">

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

            </Section>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-slate-300 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-100"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
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
      <h2 className="font-semibold text-slate-700 border-b pb-2">
        {title}
      </h2>
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