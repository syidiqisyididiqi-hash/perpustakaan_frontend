"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiBook, FiFileText, FiUser } from "react-icons/fi";

export default function MemberSidebar() {
  const pathname = usePathname();

  const menus = [
    { name: "Dashboard", icon: <FiHome />, path: "/member" },
    { name: "Books", icon: <FiBook />, path: "/member/books" },
    { name: "My Loans", icon: <FiFileText />, path: "/member/loans" },
    { name: "Profile", icon: <FiUser />, path: "/member/profile" },
  ];

  return (
    <div className="w-64 bg-green-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-10">Member Panel</h2>

      <div className="flex flex-col gap-2">
        {menus.map((menu, i) => (
          <Link
            key={i}
            href={menu.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === menu.path
                ? "bg-green-600"
                : "hover:bg-green-800"
            }`}
          >
            {menu.icon}
            {menu.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
