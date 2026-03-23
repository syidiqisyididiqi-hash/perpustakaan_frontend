"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiHelpCircle,
  FiBookOpen,
} from "react-icons/fi";
import MemberProfileModal from "./profile/MemberProfileDropdown";

export default function MemberNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = true;

  const mainMenus = [
    { name: "Dashboard", path: "/member" },
    { name: "Books", path: "/member/books" },
    { name: "History", path: "/member/history" },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Kamu akan keluar dari akun ini",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Logout",
      cancelButtonText: "Batal",
      background: "#0f172a",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          title: "Berhasil logout",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
          background: "#0f172a",
          color: "#fff",
        });
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          <Link href="/member" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition">
              P
            </div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              Perpustakaan
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {mainMenus.map((menu) => {
              const active = pathname === menu.path;
              return (
                <Link
                  key={menu.path}
                  href={menu.path}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {menu.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3 relative" ref={profileRef}>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shadow-sm hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <FiUser size={18} />
                </button>
                <div
                  className={`absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-200 origin-top-right ${
                    profileOpen
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible"
                  }`}
                >
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setProfileModalOpen(true);
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 w-full rounded-xl transition"
                    >
                      <FiUser className="text-slate-400" size={16} /> Profile
                    </button>

                    <Link
                      href="/member/panduan"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 rounded-xl transition"
                    >
                      <FiBookOpen className="text-slate-400" size={16} /> Panduan
                    </Link>

                    <Link
                      href="/member/bantuan"
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 text-sm font-medium text-slate-700 rounded-xl transition"
                    >
                      <FiHelpCircle className="text-slate-400" size={16} /> Bantuan
                    </Link>

                    <div className="my-1 border-t border-slate-100"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 text-sm font-bold w-full text-red-600 rounded-xl transition"
                    >
                      <FiLogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-100"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden bg-white border-t px-4`}
        >
          <div className="py-4 space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Main Menu</p>
            {mainMenus.map((menu) => (
              <Link
                key={menu.path}
                href={menu.path}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  pathname === menu.path
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {menu.name}
              </Link>
            ))}
          </div>

          <div className="border-t pt-4 pb-6 space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account</p>
            <button
              onClick={() => {
                setProfileModalOpen(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600"
            >
              <FiUser size={18} /> Profile
            </button>
            <Link
              href="/member/panduan"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-600"
            >
              <FiBookOpen size={18} /> Panduan
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-3 text-red-600 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-bold w-full"
            >
              <FiLogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      <MemberProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
}