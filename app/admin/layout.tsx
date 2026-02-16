import NavbarAdmin from "./components/NavbarAdmin";
import FooterAdmin from "./components/FooterAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <NavbarAdmin />

      {/* CONTENT */}
      <div className="md:ml-64 flex flex-col min-h-screen">

        <main className="flex-1 p-10 sm:p-6 md:p-8 lg:p-10">
          {children}
        </main>

        <FooterAdmin />

      </div>
    </div>
  );
}
