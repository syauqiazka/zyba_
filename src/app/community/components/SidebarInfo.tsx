import { Shield } from "lucide-react";

export default function SidebarInfo() {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <div className="glass-card rounded-3xl p-6 border border-brown-900/10 flex flex-col gap-4">
        <h3 className="font-display text-base font-bold text-brown-900">
          <Shield size={14} className="text-brown-700/60 shrink-0" /> Aturan Komunitas Zyba
        </h3>
        <ul className="text-xs text-brown-700 flex flex-col gap-2.5">
          <li className="flex items-start gap-2">
            <span>•</span> Saling menghormati dan bersikap ramah sesama anggota.
          </li>
          <li className="flex items-start gap-2">
            <span>•</span> Dilarang membagikan konten kebencian atau diskriminasi.
          </li>
          <li className="flex items-start gap-2">
            <span>•</span> Komunitas ini adalah tempat saling dukung, bukan pengganti diagnosa medis profesional.
          </li>
        </ul>
      </div>
    </div>
  );
}
