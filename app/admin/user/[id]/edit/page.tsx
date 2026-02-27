"use client";

import { LoadingCard } from "@/app/admin/components/LoadingCard";
import { Alert } from "@/app/lib/alert";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiMapPin,
  FiHash,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const API_URL = "http://127.0.0.1:8000/api/users";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "member",
    status: "active",
    member_number: "",
    phone: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    if (!id) return;
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      const user = data.data ?? data;

      setForm({
        name: user.name ?? "",
        email: user.email ?? "",
        role: user.role ?? "member",
        status: user.status ?? "active",
        member_number: user.member_number ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
        password: "",
      });
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: any = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === "" ? null : v])
      );

      if (!payload.password) delete payload.password;

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      await Alert.success("Data user berhasil diperbarui");

      router.push("/admin/user");
    } catch {
      Alert.error("Gagal update user");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <LoadingCard />;

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit User</h1>
          <p className="text-indigo-100 text-sm">
            Perbarui data pengguna sistem perpustakaan
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            <Section title="Informasi Dasar">
              <div className="grid md:grid-cols-2 gap-5">
                <Input icon={<FiUser />} name="name" value={form.name} onChange={handleChange} />
                <Input icon={<FiMail />} name="email" value={form.email} onChange={handleChange} />
                <Input icon={<FiHash />} name="member_number" value={form.member_number} onChange={handleChange} />
                <Input icon={<FiPhone />} name="phone" value={form.phone} onChange={handleChange} />
              </div>

              <InputArea icon={<FiMapPin />} name="address" value={form.address} onChange={handleChange} />
            </Section>

            <Section title="Akun & Akses">
              <div className="grid md:grid-cols-3 gap-5">

                <div className="relative">
                  <Input
                    icon={<FiLock />}
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-slate-400"
                  >
                    {showPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                <Select name="role" value={form.role} options={["admin", "member"]} onChange={handleChange} />
                <Select name="status" value={form.status} options={["active", "inactive"]} onChange={handleChange} />

              </div>
            </Section>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/admin/user")}
                className="w-full border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-100 transition"
              >
                Batal
              </button>

              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition flex justify-center items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Menyimpan..." : "Update User"}
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

function Input({ icon, name, value, onChange, type = "text" }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

function InputArea({ icon, name, value, onChange }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
      />
    </div>
  );
}

function Select({ name, value, options, onChange }: any) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
    >
      {options.map((o: string) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}