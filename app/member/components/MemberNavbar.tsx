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

  const profileRef = useRef<any>(null);

  const isLoggedIn = true;

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Kamu akan keluar dari sesi member ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout!",
      cancelButtonText: "Batal",
      background: "#1e293b",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        Swal.fire({
          title: "Logged Out!",
          text: "Berhasil keluar.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          background: "#1e293b",
          color: "#fff",
        });
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    });
  };

  const menus = [
    { name: "Dashboard", path: "/member" },
    { name: "Books", path: "/member/books" },
    { name: "History", path: "/member/history" },
    { name: "Panduan", path: "/member/panduan" },
    { name: "Bantuan", path: "/member/bantuan" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

          <h1 className="text-lg md:text-xl font-semibold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
            Perpustakaan
          </h1>

          <nav className="hidden md:flex items-center gap-8 font-medium">
            {menus.map((menu) => (
              <Link
                key={menu.path}
                href={menu.path}
                className={`relative ${
                  pathname === menu.path
                    ? "text-green-700"
                    : "text-gray-600 hover:text-green-600"
                }`}
              >
                {menu.name}

                {pathname === menu.path && (
                  <span className="absolute -bottom-2 left-0 w-full h-[3px] bg-green-600 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 relative" ref={profileRef}>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-white flex items-center justify-center"
                >
                  <FiUser size={18} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-14 w-52 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden animate-fadeIn">

                    <button
                      onClick={() => {
                        setProfileModalOpen(true);
                        setProfileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm w-full text-left"
                    >
                      <FiUser size={16} /> Profile
                    </button>

                    <Link href="/member/panduan" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm">
                      <FiBookOpen size={16} /> Panduan
                    </Link>

                    <Link href="/member/bantuan" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm">
                      <FiHelpCircle size={16} /> Bantuan
                    </Link>

                    <div className="border-t"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm w-full text-left text-red-600"
                    >
                      <FiLogOut size={16} /> Logout
                    </button>

                  </div>
                )}
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            menuOpen ? "max-h-[400px] py-5" : "max-h-0"
          } bg-white border-t px-6`}
        >
          {menus.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 ${
                pathname === menu.path
                  ? "text-green-700"
                  : "text-gray-600"
              }`}
            >
              {menu.name}
            </Link>
          ))}

          <div className="border-t mt-4 pt-4 space-y-2">
            <button
              onClick={() => {
                setProfileModalOpen(true);
                setMenuOpen(false);
              }}
              className="block w-full text-left text-gray-700"
            >
              Profile
            </button>

            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 text-red-600 mt-2"
            >
              <FiLogOut /> Logout
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