"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { LoansAPI } from "@/app/lib/api/loans";
import { Alert } from "@/app/lib/alert";

type Loan = {
  id: number;
  user: string;
  loanDate: string;
  dueDate: string;
  status: string;
  books: string;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return dateString.split("T")[0];
};

export default function LoanPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

 const fetchLoans = async () => {
  setLoading(true);
  try {
    const response: any = await LoansAPI.getAll();

    const rawData = Array.isArray(response)
      ? response
      : response?.data ?? [];

    const mapped = rawData.map((l: any) => {
      const details = l?.loan_details ?? [];

      const allReturned =
        details.length > 0 &&
        details.every((d: any) => d?.returned_at !== null);

      return {
        id: l?.id,
        user: l?.user?.name ?? "-",
        loanDate: formatDate(l?.loan_date),
        dueDate: formatDate(l?.due_date),
        status: allReturned ? "returned" : "borrowed",
        books:
          details.length > 0
            ? details
                .map((d: any) => {
                  const returned = d?.returned_at ? "✔" : "❌";
                  return `${d?.book?.title ?? "-"} (Qty: ${d?.qty ?? 0}) ${returned}`;
                })
                .join("\n")
            : "-",
      };
    });

    setLoans(mapped);
  } catch (error) {
    console.error(error);
    setLoans([]); 
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    router.refresh();
    fetchLoans();
  }, []);

  const filtered = loans.filter((l) =>
    l.user.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    const confirm = await Alert.confirmDelete();
    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const data: any = await LoansAPI.delete(id);

      if (!data.status) {
        return Alert.error(data.message);
      }

      await Alert.success("Pinjaman berhasil dihapus");
      fetchLoans();
    } catch {
      Alert.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (loanId: number, currentStatus: string) => {
    const isReturned = currentStatus === "returned";
    const newStatus = isReturned ? "borrowed" : "returned";
    
    setUpdatingId(loanId);
    
    try {
      const payload = {
        return_date: newStatus === "returned" ? new Date().toISOString().split("T")[0] : undefined,
      };

      const data: any = await LoansAPI.update(loanId, payload);
      
      if (!data.status) {
        Alert.error(data.message || "Gagal mengubah status");
        return;
      }

      Alert.success(`Status berubah menjadi ${newStatus === "returned" ? "Sudah Dikembalikan" : "Dipinjam"}`);
      fetchLoans();
    } catch (err: any) {
      Alert.error(err.message || "Gagal mengubah status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Loans</h1>
            <p className="text-indigo-100 text-sm">
              Kelola pinjaman buku
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex bg-white rounded-xl overflow-hidden shadow w-full sm:w-72">
              <input
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari user..."
                className="flex-1 px-4 py-2.5 text-sm outline-none text-slate-800"
              />
              <button
                onClick={() => setSearch(query)}
                className="px-4 bg-indigo-600 text-white"
              >
                <FiSearch size={16} />
              </button>
            </div>

            <Link href="/admin/loan/create">
              <button className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl text-sm font-semibold shadow hover:scale-105 transition">
                <FiPlus size={16} /> Tambah Pinjaman
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-700">
              <tr>
                <th className="p-4 text-center">No</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Buku</th>
                <th className="p-4 text-center">Tanggal Pinjam</th>
                <th className="p-4 text-center">Jatuh Tempo</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Memuat data...
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((l, index) => (
                  <tr key={l.id} className="border-t hover:bg-indigo-50">
                    <td className="p-4 text-center font-semibold">
                      {index + 1}
                    </td>

                    <td className="p-4 font-semibold">{l.user}</td>

                    <td className="p-4 whitespace-pre-line text-xs font-mono">
                      {l.books}
                    </td>

                    <td className="p-4 text-center">{l.loanDate}</td>

                    <td className="p-4 text-center">{l.dueDate}</td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(l.id, l.status)}
                        disabled={updatingId === l.id}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer flex items-center gap-2 justify-center min-w-[140px] ${
                          l.status === "returned"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        } ${updatingId === l.id ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {updatingId === l.id && (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        )}
                        {l.status === "returned"
                          ? "Sudah Dikembalikan"
                          : "Dipinjam"}
                      </button>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/admin/loan/${l.id}`}>
                          <button className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200">
                            <FiEye size={16} />
                          </button>
                        </Link>

                        <Link href={`/admin/loan/${l.id}/edit`}>
                          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                            <FiEdit size={16} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(l.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}