"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState({
    name: "Dummy User",
    email: "dummy@mail.com",
    role: "member",
    status: "active",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert(`User ID ${params.id} berhasil diupdate`);
    router.push("/admin/users");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow">
      <h1 className="text-3xl font-bold mb-6">Edit User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} className="input" />
        <input name="email" value={form.email} onChange={handleChange} className="input" />

        <select name="role" value={form.role} onChange={handleChange} className="input">
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="member">Member</option>
        </select>

        <select name="status" value={form.status} onChange={handleChange} className="input">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="w-full bg-slate-900 text-white py-3 rounded-xl">
          Update User
        </button>
      </form>
    </div>
  );
}
