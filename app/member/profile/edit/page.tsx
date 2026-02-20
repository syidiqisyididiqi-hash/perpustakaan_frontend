"use client";

import { useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave } from "react-icons/fi";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "08123456789",
    address: "Bandung, Indonesia",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border p-8 space-y-6"
        >
          
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl font-bold">
              {form.name.charAt(0)}
            </div>

            <button
              type="button"
              className="text-sm text-green-600 font-medium hover:underline"
            >
              Change Photo
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2 mt-1">
                <FiUser className="text-gray-400" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2 mt-1">
                <FiMail className="text-gray-400" />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2 mt-1">
                <FiPhone className="text-gray-400" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Address</label>
              <div className="flex items-center gap-3 border rounded-lg px-3 py-2 mt-1">
                <FiMapPin className="text-gray-400" />
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full outline-none"
                />
              </div>
            </div>

          </div>

          <div className="pt-4 border-t flex justify-end">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition">
              <FiSave />
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
