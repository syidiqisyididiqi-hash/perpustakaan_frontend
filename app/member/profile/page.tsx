"use client";

import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import Link from "next/link";

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "08123456789",
    address: "Bandung, Indonesia",
    memberSince: "January 2024",
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <h1 className="text-3xl font-bold text-gray-800">
          My Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-gray-500">
                Member since {user.memberSince}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FiUser className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FiMail className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FiPhone className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-800">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FiMapPin className="text-green-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-800">{user.address}</p>
              </div>
            </div>

          </div>

          <div className="mt-8">
            <Link href="/member/profile/edit">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition">
                Edit Profile
            </button>
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}
