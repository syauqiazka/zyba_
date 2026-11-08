import { Shield } from "lucide-react";

export default function SidebarInfo() {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <div className="rounded-[20px] p-6 sm:p-7 border border-brown-900/10 bg-white/95 shadow-xs flex flex-col gap-4">
        <h3 className="font-display text-base font-bold text-brown-900 flex items-center gap-2">
          <Shield size={16} className="text-orange-500 shrink-0" /> Aturan Komunitas Zyba
        </h3>
        <ul className="text-xs text-brown-700 flex flex-col gap-2.5 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span> Saling menghormati dan bersikap ramah sesama anggota.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span> Dilarang membagikan konten kebencian atau diskriminasi.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 font-bold">•</span> Komunitas ini adalah tempat saling dukung, bukan pengganti diagnosa medis profesional.
          </li>
        </ul>
      </div>
    </div>
  );
}
