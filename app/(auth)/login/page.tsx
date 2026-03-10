"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { UsersAPI } from "@/app/lib/api/users";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await UsersAPI.login(email, password);
      
      // Store token dan user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang kembali!",
        timer: 1500,
        showConfirmButton: false,
      });

      // Route berdasarkan role user
      if (response.data.user.role === "admin" || response.data.user.is_admin === 1) {
        router.push("/admin");
      } else {
        router.push("/member");
      }
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.message || "Email atau password salah",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    Swal.fire({
      icon: "info",
      title: "Fitur Segera Hadir",
      text: "Login dengan Facebook sedang dalam pengembangan",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-sm border">

        <div className="text-center mb-6">

          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome Back
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Login untuk melanjutkan ke sistem perpustakaan
          </p>

        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>

            <label className="text-sm text-gray-600">
              Email
            </label>

            <div className="relative mt-1">

              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>

              <input
                type="email"
                placeholder="email@example.com"
                className="w-full pl-9 pr-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full pl-9 pr-9 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>

        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-300"/>
          <span className="text-xs text-gray-500">atau</span>
          <div className="flex-1 h-px bg-gray-300"/>
        </div>

        <button className="w-full border py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm mb-2">

          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-4 h-4"
          />

          Login dengan Google

        </button>

        <button
          onClick={handleFacebookLogin}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition text-sm"
        >

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg"
            className="w-4 h-4"
          />

          Login dengan Facebook

        </button>

        <p className="text-center text-sm text-gray-500 mt-5">

          Belum punya akun?

          <Link
            href="/register"
            className="text-blue-600 ml-1 font-medium"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}