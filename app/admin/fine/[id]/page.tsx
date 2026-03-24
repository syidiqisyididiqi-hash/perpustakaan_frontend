"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingCard } from "../../components/LoadingCard";
import { Alert } from "@/app/lib/alert";

const API_URL = "http://127.0.0.1:8000/api/fines";

export default function FineDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params?.id);

  const [fine, setFine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchFine = async () => {
    try {
      if (!id) return;

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      const data = await res.json();

      if (data.status && data.data) {
        setFine(data.data);
      } else {
        setFine(null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setFine(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFine();
  }, [id]);

  if (loading) return <LoadingCard />;

  if (!fine) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Data tidak ditemukan
      </div>
    );
  }

  const userName = fine.loan_detail?.loan?.user?.name || "-";
  const bookTitle = fine.loan_detail?.book?.title || "-";
  const rackCode = fine.loan_detail?.book?.rack_code || "-";
  const overdueDays = fine.overdue_days || 0;
  const totalFine = fine.total_fine || 0;
  const status = fine.status || "unpaid";

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <div className="bg-gradient-to-r from-red-600 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
          <h1 className="text-2xl font-bold">Detail Denda</h1>
          <p className="text-red-100 text-sm">
            Informasi lengkap denda keterlambatan
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border grid md:grid-cols-2 gap-6">
          <Info label="User" value={userName} />
          <Info label="Judul Buku" value={bookTitle} />
          <Info label="Rack Code" value={rackCode} />
          <Info label="Hari Terlambat" value={`${overdueDays} Hari`} />

          <Info
            label="Total Denda"
            value={`Rp ${totalFine.toLocaleString("id-ID")}`}
          />

          <div>
            <p className="text-sm text-slate-500 mb-1">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                status === "paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {status === "paid" ? "Lunas" : "Belum Bayar"}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <div className="p-5 border-b font-semibold text-lg">
            Informasi Tambahan
          </div>

          <div className="p-6 space-y-3 text-sm">
            <p>
              Denda ini diberikan karena keterlambatan pengembalian buku selama{" "}
              <span className="font-semibold">{overdueDays} hari</span>.
            </p>

            <p>
              Total yang harus dibayarkan adalah{" "}
              <span className="font-semibold text-red-600">
                Rp {totalFine.toLocaleString("id-ID")}
              </span>.
            </p>

            <p>
              Status pembayaran saat ini:{" "}
              <span className="font-semibold">
                {status === "paid" ? "Sudah Lunas" : "Belum Dibayar"}
              </span>.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.back()}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:opacity-90"
          >
            Kembali
          </button>

          {status !== "paid" && (
            <button
              onClick={() =>
                Alert.success("Simulasi: Denda berhasil dibayar")
              }
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
            >
              Tandai Lunas
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="font-semibold">{value || "-"}</p>
    </div>
  );
}