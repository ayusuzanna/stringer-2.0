import React from 'react';
import { X, BookOpen, Car, Receipt, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { NSTPBrandLogo } from './NSTPLogo';

interface RateGuideModalProps {
  onClose: () => void;
}

export const RateGuideModal: React.FC<RateGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-center justify-center">
      <div className="bg-white rounded-[8px] max-w-2xl w-full p-6 shadow-2xl border border-slate-300 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 pb-3 border-b border-slate-200">
          <NSTPBrandLogo size="md" />
          <div className="border-l border-slate-200 pl-3">
            <h2 className="text-sm font-extrabold text-[#0B2545]">
              Panduan & Garis Panduan Tuntutan Stringer (Kadar RM0.35/KM)
            </h2>
            <p className="text-[11px] text-slate-500">
              Pekeliling Kewangan Kumpulan Media Prima Berhad (MPB Bil 02/2024)
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* Section 1 */}
          <div className="bg-[#EFF4FF] border border-[#CBD5E1] p-3 rounded-[4px]">
            <div className="flex items-center gap-2 font-bold text-[#0B2545] text-xs mb-1">
              <Car className="w-4 h-4 text-[#0B2545]" />
              <span>1. Kadar Elaun Perbatuan Jalan Raya (Mileage)</span>
            </div>
            <p className="text-[11.5px] text-slate-700">
              Semua wartawan sambilan (stringer) berdaftar dengan The New Straits Times Press (Malaysia) Berhad yang menggunakan kenderaan persendirian bagi tugasan editorial liputan berita layak menuntut pada kadar tetap:
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-xl font-black text-[#0B2545] font-['Inter',sans-serif]">
                RM 0.35 / Kilometer
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                (Pengiraan automatik berdasarkan titik tolak dan destinasi bertugas)
              </span>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Receipt className="w-4 h-4 text-slate-600" />
              <span>2. Syarat Tuntutan Tol & Tempat Letak Kereta (Parkir)</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11.5px] text-slate-600">
              <li>
                <strong>Tol Lebuhraya:</strong> Hanya perbelanjaan tol yang berpadanan dengan laluan tugasan rasmi sahaja boleh dituntut. Wajib memuat naik penyata Touch 'n Go (eWallet/e-statement) atau resit PLUS/LDP/MEX/DUKE.
              </li>
              <li>
                <strong>Tempat Letak Kereta (Parkir):</strong> Resit bertarikh sama dengan hari tugasan. Parkir kompleks mahkamah, bangunan parlimen, pusat konvensyen, atau pihak berkuasa tempatan (PBT) boleh dituntut sepenuhnya.
              </li>
              <li>
                <strong>Pengimbas Resit AI (OCR):</strong> Portal dilengkapi AI untuk membaca tarikh, jumlah, dan nombor siri resit secara automatik bagi mempercepatkan audit.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Aliran Kelulusan & Pengesahan Dokumen</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10.5px]">
              <div className="p-2 border border-slate-200 rounded bg-[#F8FAFC]">
                <div className="font-bold text-[#0B2545]">1. Serahan Stringer</div>
                <div className="text-slate-500 mt-0.5">Tandatangan pad digital & perakuan integriti</div>
              </div>
              <div className="p-2 border border-slate-200 rounded bg-[#F8FAFC]">
                <div className="font-bold text-[#0B2545]">2. Semakan HOD</div>
                <div className="text-slate-500 mt-0.5">Pengesahan berita & penurunan meterai digital</div>
              </div>
              <div className="p-2 border border-slate-200 rounded bg-[#F8FAFC]">
                <div className="font-bold text-[#0B2545]">3. Semakan HR & Payroll</div>
                <div className="text-slate-500 mt-0.5">Penyelarasan baucar EFT Maybank</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#001026] hover:bg-[#0B2545] text-white text-xs font-bold px-4 py-2 rounded transition-colors"
          >
            Faham & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
