"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  HiMenu,
  HiX,
  HiHome,
  HiUsers,
  HiBookOpen,
  HiCollection,
  HiCurrencyDollar,
  HiClipboardList,
  HiLogout,
} from "react-icons/hi";
import AdminProfileDropdown from "./profile/AdminProfileDropdown";

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: "Dashboard", href: "/admin", icon: HiHome },
    { name: "Users", href: "/admin/user", icon: HiUsers },
    { name: "Category", href: "/admin/category", icon: HiCollection },
    { name: "Book", href: "/admin/book", icon: HiBookOpen },
    { name: "Loan", href: "/admin/loan", icon: HiClipboardList },
    { name: "Fine", href: "/admin/fine", icon: HiCurrencyDollar },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Kamu akan keluar dari sesi admin ini!",
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

  const SidebarContent = ({ onClick }: { onClick?: () => void }) => (
    <div className="flex flex-col h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-sm text-slate-400 mt-1">Management Perpustakaan</p>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active = pathname === menu.href;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              onClick={onClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
              ${
                active
                  ? "bg-slate-700 text-white shadow-lg shadow-black/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              {menu.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 mb-4 px-2">
        <AdminProfileDropdown />
      </div>

      <button
        onClick={() => {
          if (onClick) onClick();
          handleLogout();
        }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
      >
        <HiLogout size={20} />
        Logout
      </button>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 px-4 flex items-center justify-between bg-slate-900 text-white shadow-lg border-b border-slate-800">
        <h1 className="font-bold text-lg">Admin Panel</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg"
        >
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-slate-900 text-slate-200 shadow-2xl transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarContent onClick={() => setIsOpen(false)} />
        </aside>
      </div>

      <aside className="hidden md:flex md:w-64 bg-slate-900 text-slate-200 shadow-xl fixed inset-y-0 left-0 z-30 border-r border-slate-800">
        <SidebarContent />
      </aside>
    </>
  );
}