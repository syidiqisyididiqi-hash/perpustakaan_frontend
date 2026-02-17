"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`User ID ${params.id} berhasil diupdate`);
    router.push("/admin/user");
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">
            Edit User
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Perbarui data user
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Nama Lengkap
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Member Number
              </label>
              <input
                name="member_number"
                value={form.member_number}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak diubah"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="member">Member</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-slate-300 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-slate-50 transition"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-700 shadow-sm transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
