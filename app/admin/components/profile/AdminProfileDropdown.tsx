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

export default function AdminProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
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
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(API_PROFILE, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      const profile = data.data ?? data;

      setUser(profile);

      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || ""
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      Swal.fire("Error", "Gagal memuat profil", "error");
    }
  };

  const updateProfile = async () => {
    // Validasi form
    if (!form.name.trim()) {
      Swal.fire("Peringatan", "Nama tidak boleh kosong", "warning");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "Token tidak ditemukan", "error");
        return;
      }

      const res = await fetch(API_PROFILE, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok && data.status) {
        Swal.fire("Berhasil", "Profile berhasil diperbarui", "success");
        setEditMode(false);
        await fetchProfile();
      } else {
        Swal.fire("Error", data.message || "Gagal mengupdate profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire("Error", "Terjadi kesalahan saat mengupdate profile", "error");
    } finally {
      setLoading(false);
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">

          <div className="bg-slate-900 text-white rounded-2xl w-full max-w-2xl my-auto p-8 shadow-2xl border border-slate-700 relative">

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl transition"
              disabled={loading}
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
                    <h2 className="text-2xl font-bold text-white">
                      {user.name}
                    </h2>

                    <p className="text-slate-400 text-sm mt-1">
                      {user.email}
                    </p>
                  </>
                ) : (
                  <>
                    <label className="text-xs text-slate-400 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="bg-slate-800 px-4 py-2 rounded-lg w-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      placeholder="Masukkan nama lengkap"
                      disabled={loading}
                    />
                  </>
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

              <div className="bg-slate-800 p-4 rounded-xl col-span-2 md:col-span-1">
                <label className="flex items-center gap-3 mb-2">
                  <HiPhone className="text-indigo-400" />
                  <p className="text-slate-400 text-xs">Phone</p>
                </label>

                {editMode ? (
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="bg-slate-700 px-3 py-2 rounded-lg w-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="Nomor telepon"
                    disabled={loading}
                  />
                ) : (
                  <p className="font-medium text-slate-200">{user.phone || "-"}</p>
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

            <div className="bg-slate-800 p-4 rounded-xl mt-5">
              <label className="flex items-start gap-3 mb-2">
                <HiLocationMarker className="text-indigo-400 mt-1" />
                <p className="text-slate-400 text-xs">Alamat</p>
              </label>

              {editMode ? (
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  rows={3}
                  className="bg-slate-700 px-3 py-2 rounded-lg w-full text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                  placeholder="Masukkan alamat lengkap"
                  disabled={loading}
                />
              ) : (
                <p className="font-medium text-slate-200">{user.address || "-"}</p>
              )}

            </div>
            <div className="flex gap-3 mt-8">

              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center justify-center gap-2 flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl transition font-medium h-12"
                >
                  <HiPencil size={18} />
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={updateProfile}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-700/50 disabled:cursor-not-allowed py-3 rounded-xl transition font-medium flex items-center justify-center gap-2 h-12 min-w-0"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin flex-shrink-0">⏳</span>
                      <span className="truncate">Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan</span>
                  )}
                </button>
              )}

              <button
                onClick={() => {
                  if (editMode && !loading) {
                    Swal.fire({
                      title: "Batalkan perubahan?",
                      text: "Perubahan yang Anda buat akan hilang",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Ya, batalkan",
                      cancelButtonText: "Lanjutkan edit",
                      background: "#1e293b",
                      color: "#fff",
                    }).then((result) => {
                      if (result.isConfirmed) {
                        setEditMode(false);
                        fetchProfile();
                      }
                    });
                  } else {
                    onClose();
                  }
                }}
                disabled={loading}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:cursor-not-allowed py-3 rounded-xl transition font-medium h-12"
              >
                {editMode ? "Batal" : "Tutup"}
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}