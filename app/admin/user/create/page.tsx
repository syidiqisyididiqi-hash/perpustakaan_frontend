"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateUserPage() {
  const router = useRouter();

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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("User berhasil ditambahkan (dummy)");
    router.push("/admin/users");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow">
      <h1 className="text-3xl font-bold mb-6">Tambah User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nama" onChange={handleChange} className="input" />
        <input name="email" placeholder="Email" onChange={handleChange} className="input" />
        <input name="member_number" placeholder="Member Number" onChange={handleChange} className="input" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
        <input name="address" placeholder="Address" onChange={handleChange} className="input" />

        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input" />

        <select name="role" onChange={handleChange} className="input">
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="member">Member</option>
        </select>

        <select name="status" onChange={handleChange} className="input">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button className="w-full bg-slate-900 text-white py-3 rounded-xl">
          Simpan User
        </button>
      </form>
    </div>
  );
}
