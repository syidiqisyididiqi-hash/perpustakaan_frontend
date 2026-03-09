"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [showConfirm,setShowConfirm] = useState(false);

  const router = useRouter();

  const handleRegister = (e:React.FormEvent) =>{
    e.preventDefault();

    if(password.length < 6){
      alert("Password minimal 6 karakter");
      return;
    }

    if(password !== confirmPassword){
      alert("Password tidak sama");
      return;
    }

    console.log({name,email,password});

    alert("Register berhasil (simulasi)");
    router.push('/auth/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm border">

        <div className="text-center mb-6">

          <h1 className="text-2xl font-semibold text-gray-800">
            Register
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Buat akun baru
          </p>

        </div>

        <form onSubmit={handleRegister} className="space-y-4">

          <div>

            <label className="text-sm text-gray-600">
              Nama
            </label>

            <div className="relative mt-1">

              <User size={18} className="absolute left-3 top-3 text-gray-400"/>

              <input
                type="text"
                placeholder="Nama lengkap"
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
              />

            </div>

          </div>

          <div>

            <label className="text-sm text-gray-600">
              Email
            </label>

            <div className="relative mt-1">

              <Mail size={18} className="absolute left-3 top-3 text-gray-400"/>

              <input
                type="email"
                placeholder="email@example.com"
                className="w-full pl-10 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />

            </div>

          </div>

          <div>

            <label className="text-sm text-gray-600">
              Password
            </label>

            <div className="relative mt-1">

              <Lock size={18} className="absolute left-3 top-3 text-gray-400"/>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

            </div>

          </div>

          <div>

            <label className="text-sm text-gray-600">
              Confirm Password
            </label>

            <div className="relative mt-1">

              <Lock size={18} className="absolute left-3 top-3 text-gray-400"/>

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="********"
                className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={()=>setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>

            </div>

          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            Register
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-5">

          Sudah punya akun?

          <Link
            href="/login"
            className="text-blue-600 ml-1 font-medium"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}