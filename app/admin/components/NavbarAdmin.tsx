"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  HiMenu,
  HiX,
  HiHome,
  HiUsers,
  HiBookOpen,
  HiCollection,
  HiCurrencyDollar,
  HiClipboardList,
} from "react-icons/hi";

export default function NavbarAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menus = [
    { name: "Dashboard", href: "/admin", icon: HiHome },
    { name: "Users", href: "/admin/user", icon: HiUsers },
    { name: "Category", href: "/admin/category", icon: HiCollection },
    { name: "Book", href: "/admin/book", icon: HiBookOpen },
    { name: "Loan", href: "/admin/loan", icon: HiClipboardList },
    { name: "Fine", href: "/admin/fine", icon: HiCurrencyDollar },
  ];

  const SidebarContent = ({ onClick }: { onClick?: () => void }) => (
    <div className="flex flex-col h-full overflow-y-auto p-6">
      <div className="mb-10">
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
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium
                ${
                  active
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }
              `}
            >
              <Icon size={20} />
              {menu.name}
            </Link>
          );
        })}
      </nav>

      <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 mt-6">
        <p className="font-medium text-white">Admin User</p>
        <p className="text-xs text-slate-400">Super Administrator</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 px-4 flex items-center justify-between bg-slate-900 text-white shadow">
        <h1 className="font-bold text-lg">Admin Panel</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      <div
        className={`
          fixed inset-0 z-40 md:hidden transition
          ${isOpen ? "visible" : "invisible"}
        `}
      >
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity
          ${isOpen ? "opacity-100" : "opacity-0"}`}
        />

        <aside
          className={`
            absolute left-0 top-0 h-full w-64 bg-slate-900 text-slate-200 shadow-xl
            transform transition-transform duration-300
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SidebarContent onClick={() => setIsOpen(false)} />
        </aside>
      </div>

      <aside className="hidden md:flex md:w-64 bg-slate-900 text-slate-200 shadow-lg fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
