"use client";

import Link from "next/link";
import { FiBookOpen, FiClock, FiUser } from "react-icons/fi";

export default function MemberHome() {
  return (
    <div className="space-y-10">
      <section className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white rounded-2xl p-10 shadow-lg">
        <h1 className="text-3xl font-bold mb-3">
          Welcome to Your Library Portal
        </h1>
        <p className="text-lg opacity-90 max-w-2xl">
          Manage your borrowing activities, explore thousands of books,
          and stay updated with your reading history all in one place.
        </p>

        <div className="flex gap-4 mt-6">
          <Link
            href="/member/books"
            className="bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:shadow-md transition"
          >
            Browse Books
          </Link>

          <Link
            href="/member/loans"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition"
          >
            View Loans
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <div className="bg-green-100 text-green-700 w-fit p-3 rounded-lg mb-4">
            <FiBookOpen size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Explore Books</h3>
          <p className="text-gray-600 text-sm">
            Discover a wide range of books across categories and start
            your reading journey today.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <div className="bg-blue-100 text-blue-700 w-fit p-3 rounded-lg mb-4">
            <FiClock size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Track Loans</h3>
          <p className="text-gray-600 text-sm">
            Monitor your borrowed books, due dates, and return status
            easily from your dashboard.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <div className="bg-purple-100 text-purple-700 w-fit p-3 rounded-lg mb-4">
            <FiUser size={24} />
          </div>
          <h3 className="font-semibold text-lg mb-2">Manage Profile</h3>
          <p className="text-gray-600 text-sm">
            Keep your personal information updated and maintain your
            membership details.
          </p>
        </div>
      </section>

      <section className="bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-3">
          About Our Library System
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Our digital library system is designed to provide a seamless
          and efficient experience for members. You can search books,
          borrow them online, track your reading history, and manage
          your account effortlessly through this platform.
        </p>
      </section>
    </div>
  );
}
