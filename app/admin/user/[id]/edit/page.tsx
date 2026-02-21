"use client";

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
  const id = params.id;

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
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      const user = data?.data ?? data?.user ?? data;

      setForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        role: (user?.role ?? "member").toLowerCase(),
        status: (user?.status ?? "active").toLowerCase(),
        member_number: user?.member_number ?? "",
        phone: user?.phone ?? "",
        address: user?.address ?? "",
        password: "",
      });
    } catch {
      alert("Gagal mengambil data user");
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
    try {
      setLoading(true);

      const payload: any = { ...form };
      if (!payload.password) delete payload.password;

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      router.push("/admin/user");
    } catch {
      alert("Gagal update user");
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
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Edit User</h1>
          <p className="text-indigo-100 text-sm">
            Perbarui data pengguna sistem perpustakaan
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BASIC INFO */}
            <Section title="Informasi Dasar">
              <div className="grid md:grid-cols-2 gap-5">
                <Input icon={<FiUser />} name="name" value={form.name} onChange={handleChange} placeholder="Nama Lengkap" />
                <Input icon={<FiMail />} name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                <Input icon={<FiHash />} name="member_number" value={form.member_number} onChange={handleChange} placeholder="Nomor Anggota" />
                <Input icon={<FiPhone />} name="phone" value={form.phone} onChange={handleChange} placeholder="No Telepon" />
              </div>

              <InputArea icon={<FiMapPin />} name="address" value={form.address} onChange={handleChange} placeholder="Alamat Lengkap" />
            </Section>

            {/* ACCOUNT */}
            <Section title="Akun & Akses">
              <div className="grid md:grid-cols-3 gap-5">
                <div className="relative">
                  <Input
                    icon={<FiLock />}
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    placeholder="Password Baru"
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

                <Select name="role" value={form.role} options={["admin","staff","member"]} onChange={handleChange} />
                <Select name="status" value={form.status} options={["active","inactive"]} onChange={handleChange} />
              </div>
            </Section>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-slate-300 py-3 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Batal
              </button>

              <button
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow hover:bg-indigo-700 transition flex justify-center items-center gap-2"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                {loading ? "Menyimpan..." : "Update User"}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Section({ title, children }: any) {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-slate-700 border-b pb-2">{title}</h2>
      {children}
    </div>
  );
}

function Input({ icon, name, value, onChange, type = "text", placeholder }: any) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-3 text-slate-400">{icon}</div>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-3 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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