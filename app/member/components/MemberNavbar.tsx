"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";

export default function MemberNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // simulasi login state (nanti bisa dari auth context)
  const isLoggedIn = true;

  const menus = [
    { name: "Dashboard", path: "/member" },
    { name: "Books", path: "/member/books" },
    { name: "My Loans", path: "/member/loans" },
    { name: "Profile", path: "/member/profile" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
          Library Member
        </h1>

        <nav className="hidden md:flex items-center gap-8 font-medium">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              className={`relative transition ${
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

        {/* RIGHT SIDE */}
        <div className="hidden md:flex items-center gap-4 relative">
          
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-green-600 font-medium"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:scale-105 transition"
              >
                <FiUser />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-14 w-52 bg-white rounded-xl shadow-lg border overflow-hidden">
                  <div className="px-4 py-3 border-b text-sm">
                    <p className="font-semibold">Member User</p>
                    <p className="text-gray-500 text-xs">member@mail.com</p>
                  </div>

                  <Link
                    href="/member/profile"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm"
                  >
                    <FiUser /> Profile
                  </Link>

                  <button className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-sm w-full text-left text-red-600">
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-700"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-6 py-4 space-y-4">
          {menus.map((menu) => (
            <Link
              key={menu.path}
              href={menu.path}
              onClick={() => setMenuOpen(false)}
              className={`block text-lg font-medium ${
                pathname === menu.path
                  ? "text-green-700"
                  : "text-gray-600"
              }`}
            >
              {menu.name}
            </Link>
          ))}

          <div className="border-t pt-4 space-y-3">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="block text-gray-600"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="block bg-green-600 text-white px-4 py-2 rounded-lg text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button className="flex items-center gap-2 text-red-600">
                <FiLogOut /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
