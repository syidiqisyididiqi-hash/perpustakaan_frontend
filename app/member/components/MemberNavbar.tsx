"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiUser, FiLogOut, FiHelpCircle, FiBookOpen } from "react-icons/fi";

export default function MemberNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isLoggedIn = true;

  const menus = [
    { name: "Dashboard", path: "/member" },
    { name: "Books", path: "/member/books" },
    { name: "History", path: "/member/history" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <h1 className="text-xl font-semibold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
          Perpustakaan
        </h1>

        <nav className="hidden md:flex items-center gap-10 font-medium">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              className={`relative transition-all duration-300 ${
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

        <div className="hidden md:flex items-center gap-4 relative">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-green-600 font-medium transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-medium transition shadow-sm"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-11 h-11 rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition"
              >
                <FiUser size={18} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

                  <Link
                    href="/member/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition"
                  >
                    <FiUser size={16} /> Profile
                  </Link>

                  <Link
                    href="/member/guide"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition"
                  >
                    <FiBookOpen size={16} /> Panduan
                  </Link>

                  <Link
                    href="/member/help"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-sm text-gray-700 transition"
                  >
                    <FiHelpCircle size={16} /> Bantuan
                  </Link>

                  <div className="border-t"></div>

                  <button className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm w-full text-left text-red-600 transition">
                    <FiLogOut size={16} /> Logout
                  </button>

                </div>
              )}
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-700"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-5 space-y-5">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              onClick={() => setMenuOpen(false)}
              className={`block text-lg font-medium transition ${
                pathname === menu.path
                  ? "text-green-700"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              {menu.name}
            </Link>
          ))}

          <div className="border-t pt-5 space-y-3">
            <Link href="/member/guide" className="block text-gray-600">
              Panduan
            </Link>

            <Link href="/member/help" className="block text-gray-600">
              Bantuan
            </Link>

            <button className="flex items-center gap-2 text-red-600">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}