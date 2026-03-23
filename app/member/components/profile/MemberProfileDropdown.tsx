"use client";

import { useEffect, useState } from "react";
import {
  HiPhone,
  HiLocationMarker,
  HiPencil,
  HiIdentification,
  HiX,
  HiCheck,
  HiMail,
  HiUserCircle
} from "react-icons/hi";
import Swal from "sweetalert2";

const API_PROFILE = "http://127.0.0.1:8000/api/profile";

export default function MemberProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    if (open) fetchProfile();
  }, [open]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_PROFILE, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      const data = await res.json();
      const profile = data.data ?? data;
      setUser(profile);
      setForm({ name: profile.name || "", phone: profile.phone || "", address: profile.address || "" });
    } catch (e) {
      console.error(e);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_PROFILE, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setEditMode(false);
        fetchProfile();
        Swal.fire({ title: "Updated", icon: "success", timer: 1500, showConfirmButton: false, background: "#1e293b", color: "#fff" });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] transition-all" onClick={onClose} />

      <div className="relative bg-[#0f172a] border border-slate-800 text-slate-200 rounded-2xl w-full max-w-[400px] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="px-6 pt-8 pb-6 flex flex-col items-center border-b border-slate-800/50">
          <div className="relative mb-4">
             <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-400 p-[2px] shadow-xl shadow-indigo-500/10">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-2xl font-bold text-white border border-white/5">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
             </div>
             <button 
                onClick={() => setEditMode(!editMode)}
                className="absolute bottom-0 right-0 p-1.5 bg-slate-800 border border-slate-700 rounded-full text-indigo-400 hover:text-white transition-colors shadow-lg"
              >
                {editMode ? <HiX size={14} /> : <HiPencil size={14} />}
             </button>
          </div>

          <div className="text-center space-y-1">
            {editMode ? (
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1 text-center text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-full max-w-[200px]"
                autoFocus
              />
            ) : (
              <h2 className="text-xl font-semibold text-white tracking-tight">{user.name}</h2>
            )}
            <p className="text-slate-500 text-xs font-medium">{user.email}</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
       
          <div className="flex justify-between items-center px-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Role</span>
              <span className="text-xs font-semibold text-indigo-400">Member {user.role}</span>
            </div>
            <div className="h-6 w-[1px] bg-slate-800" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Status</span>
              <span className={`text-xs font-bold ${user.status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {user.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4 group">
              <div className="p-2 rounded-lg bg-slate-800/50 text-slate-500 group-hover:text-indigo-400 transition-colors">
                <HiIdentification size={18} />
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Member Number</p>
                <p className="text-sm text-slate-300 font-medium">{user.member_number || "?"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="p-2 rounded-lg bg-slate-800/50 text-slate-500 group-hover:text-indigo-400 transition-colors">
                <HiPhone size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Phone Number</p>
                {editMode ? (
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-transparent border-b border-slate-700 w-full text-sm outline-none focus:border-indigo-500 py-0.5 text-white"
                  />
                ) : (
                  <p className="text-sm text-slate-300 font-medium">{user.phone || "-"}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-2 rounded-lg bg-slate-800/50 text-slate-500 group-hover:text-indigo-400 transition-colors">
                <HiLocationMarker size={18} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Address</p>
                {editMode ? (
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    className="bg-transparent border-b border-slate-700 w-full text-sm outline-none focus:border-indigo-500 py-0.5 resize-none text-white"
                  />
                ) : (
                  <p className="text-sm text-slate-400 leading-relaxed italic line-clamp-2">
                    {user.address || "No address provided"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900/50 flex gap-3 border-t border-slate-800">
          {editMode ? (
            <button
              onClick={updateProfile}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white h-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Saving..." : <><HiCheck size={16} /> Save Changes</>}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 h-10 rounded-lg text-xs font-bold transition-all"
            >
              Close Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}