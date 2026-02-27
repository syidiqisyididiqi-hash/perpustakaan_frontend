import Swal from "sweetalert2";

export const Alert = {

  success: (message: string = "Berhasil!") => {
    return Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: message,

      width: 320, 
      padding: "1.5em",

      confirmButtonText: "OK",
      buttonsStyling: false,

      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-lg font-semibold",
        htmlContainer: "text-sm text-slate-600",
        confirmButton:
          "px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700",
      },
    });
  },

  error: (message: string = "Terjadi kesalahan") => {
    return Swal.fire({
      icon: "error",
      title: "Gagal",
      text: message,

      width: 320,
      padding: "1.5em",
      buttonsStyling: false,

      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-lg font-semibold",
        htmlContainer: "text-sm text-slate-600",
        confirmButton:
          "px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600",
      },
    });
  },

  confirmDelete: () => {
    return Swal.fire({
      title: "Hapus Data?",
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",

      width: 340,
      padding: "1.5em",

      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",

      buttonsStyling: false,

      customClass: {
        popup: "rounded-xl shadow-lg",
        title: "text-lg font-semibold",
        htmlContainer: "text-sm text-slate-600",
         actions: "gap-3",

        confirmButton:
          "px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600",

        cancelButton:
          "px-4 py-2 text-sm rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300",
      },
    });
  },

};