import { 
  Instagram, 
  Facebook, 
  Mail, 
  Phone, 
  MapPin, 
  Play 
} from "lucide-react";

export default function MemberFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 border-t pt-12 pb-6 text-slate-600">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Library<span className="text-blue-600">System</span>
            </h2>
            <p className="text-sm leading-relaxed">
              Solusi manajemen perpustakaan modern untuk akses literasi yang lebih mudah dan cepat.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
              <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:text-pink-600 transition-all border border-slate-100 hover:shadow-md">
                <Instagram size={18} />
              </a>
              <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:text-blue-600 transition-all border border-slate-100 hover:shadow-md">
                <Facebook size={18} />
              </a>
              <a href="#" className="p-2 bg-white rounded-full shadow-sm hover:text-black transition-all border border-slate-100 hover:shadow-md">
                <Play size={18} fill="currentColor" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Mail size={16} />
                </div>
                <span>admin@library-system.my.id</span>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <Phone size={16} />
                </div>
                <span>+62 812 3456 7890</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 text-center md:text-left">Lokasi</h3>
            <div className="flex gap-3 justify-center md:justify-start leading-relaxed text-sm text-center md:text-left">
              <MapPin size={20} className="text-red-500 shrink-0 hidden md:block" />
              <p>
                Gedung Perpustakaan Digital, <br />
                Jl. Asia Afrika, Bandung, <br />
                Jawa Barat 40111
              </p>
            </div>
          </div>

          <div className="h-40 w-full rounded-2xl overflow-hidden border-4 border-white shadow-lg ring-1 ring-slate-200">
            <iframe
              title="Maps Bandung"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.064233767664!2d107.6044719!3d-6.9184494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e630733d3127%3A0x7d9f7830f30c9d74!2sAlun-Alun%20Bandung!5e0!3m2!1sid!2sid!4v1711234567890!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

        </div>
        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-center text-sm text-slate-500 font-medium tracking-wide">
              © {currentYear} Library Management System. All Rights Reserved.
            </p>
            <div className="w-12 h-1 bg-blue-500 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}