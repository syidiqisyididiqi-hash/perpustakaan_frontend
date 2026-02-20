import MemberFooter from "./components/MemberFooter";
import MemberNavbar from "./components/MemberNavbar";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MemberNavbar/>

      <main className="flex-1 p-8">{children}</main>

      <MemberFooter />
    </div>
  );
}
