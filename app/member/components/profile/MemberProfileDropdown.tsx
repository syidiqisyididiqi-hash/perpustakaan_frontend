"use client";

import { useEffect, useState } from "react";
import {
  HiUser,
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiPencil,
  HiIdentification,
  HiShieldCheck
} from "react-icons/hi";
import Swal from "sweetalert2";

const API_PROFILE = "http://127.0.0.1:8000/api/profile";

export default function MemberProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {

  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {

    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(API_PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await res.json();
    const profile = data.data ?? data;

    setUser(profile);

    setForm({
      name: profile.name || "",
      phone: profile.phone || "",
      address: profile.address || ""
    });
  };

  const updateProfile = async () => {

    const token = localStorage.getItem("token");

    const res = await fetch(API_PROFILE, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (data.status) {

      Swal.fire("Berhasil", "Profile berhasil diperbarui", "success");

      setEditMode(false);

      fetchProfile();
    }
  };

  if (!user) return null;

  const avatar = user.name?.charAt(0).toUpperCase();

  const roleColor =
    user.role === "admin"
      ? "bg-purple-500/20 text-purple-400"
      : "bg-blue-500/20 text-blue-400";

  const statusColor =
    user.status === "active"
      ? "bg-green-500/20 text-green-400"
      : "bg-red-500/20 text-red-400";

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-slate-900 text-white rounded-2xl w-[620px] p-8 shadow-2xl border border-slate-700">

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition"
            >
              ✕
            </button>

            <div className="flex items-center gap-6 mb-8">

              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-4xl font-bold">
                {avatar}
              </div>

              <div className="flex-1">

                {!editMode ? (
                  <>
                    <h2 className="text-2xl font-bold">
                      {user.name}
                    </h2>

                    <p className="text-slate-400 text-sm">
                      {user.email}
                    </p>
                  </>
                ) : (
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="bg-slate-800 px-4 py-2 rounded-lg w-full"
                  />
                )}

                <div className="flex gap-2 mt-2">

                  <span className={`px-3 py-1 text-xs rounded-full ${roleColor}`}>
                    {user.role}
                  </span>

                  <span className={`px-3 py-1 text-xs rounded-full ${statusColor}`}>
                    {user.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>

                </div>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-5 text-sm">

              <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-3">
                <HiIdentification className="text-indigo-400" />
                <div>
                  <p className="text-slate-400 text-xs">Member Number</p>
                  <p className="font-medium">{user.member_number || "-"}</p>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-3">
                <HiMail className="text-indigo-400" />
                <div>
                  <p className="text-slate-400 text-xs">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-3">
                <HiPhone className="text-indigo-400" />

                {editMode ? (
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="bg-slate-700 px-3 py-2 rounded-lg w-full"
                  />
                ) : (
                  <div>
                    <p className="text-slate-400 text-xs">Phone</p>
                    <p className="font-medium">{user.phone || "-"}</p>
                  </div>
                )}

              </div>

              <div className="bg-slate-800 p-4 rounded-xl flex items-center gap-3">
                <HiShieldCheck className="text-indigo-400" />
                <div>
                  <p className="text-slate-400 text-xs">Role</p>
                  <p className="font-medium">{user.role}</p>
                </div>
              </div>

            </div>

            <div className="bg-slate-800 p-4 rounded-xl flex items-start gap-3 mt-5">

              <HiLocationMarker className="text-indigo-400 mt-1" />

              {editMode ? (
                <input
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="bg-slate-700 px-3 py-2 rounded-lg w-full"
                />
              ) : (
                <div>
                  <p className="text-slate-400 text-xs">Address</p>
                  <p className="font-medium">{user.address || "-"}</p>
                </div>
              )}

            </div>
            <div className="flex gap-3 mt-8">

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl transition"
                >
                  <HiPencil />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={updateProfile}
                  className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl transition"
                >
                  Simpan
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  setEditMode(false);
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl transition"
              >
                Kembali
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}