import React, { useState } from 'react';
import { X, FolderPlus, Calendar, Building, User } from 'lucide-react';
import { NSTPBrandLogo } from './NSTPLogo';

interface NewClaimModalProps {
  onClose: () => void;
  onCreateClaim: (month: string, biro: string) => void;
}

export const NewClaimModal: React.FC<NewClaimModalProps> = ({ onClose, onCreateClaim }) => {
  const [month, setMonth] = useState('April 2025');
  const [biro, setBiro] = useState('Biro Putrajaya & Parlimen');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateClaim(month, biro);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-center justify-center">
      <div className="bg-white rounded-[8px] max-w-md w-full p-5 shadow-2xl border border-slate-300 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 pb-3 border-b border-slate-200">
          <NSTPBrandLogo size="sm" />
          <div className="border-l border-slate-200 pl-2.5">
            <h2 className="text-sm font-extrabold text-[#0B2545]">
              Buka Folder Tuntutan Bulanan Baharu
            </h2>
            <p className="text-[11px] text-slate-500">
              Daftar sesi tuntutan bulanan bagi tugasan liputan editorial Berita Harian
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Bulan & Tahun Tuntutan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-[4px] bg-white font-medium text-slate-800 focus:ring-1 focus:ring-[#001026]"
              >
                <option value="April 2025">April 2025 (Kitaran Baharu)</option>
                <option value="Mei 2025">Mei 2025</option>
                <option value="Jun 2025">Jun 2025</option>
                <option value="Mac 2025">Mac 2025 (Kemasukan Semula)</option>
              </select>
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Biro Penugasan Liputan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={biro}
                onChange={(e) => setBiro(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-[4px] bg-white font-medium text-slate-800 focus:ring-1 focus:ring-[#001026]"
              >
                <option value="Biro Putrajaya & Parlimen">Biro Putrajaya & Parlimen</option>
                <option value="Biro Shah Alam & Klang">Biro Shah Alam & Klang</option>
                <option value="Meja Mahkamah Kuala Lumpur">Meja Mahkamah Kuala Lumpur</option>
                <option value="Meja Sukan Media Prima">Meja Sukan Media Prima</option>
                <option value="Ibu Pejabat NSTP Bangsar">Ibu Pejabat NSTP Bangsar</option>
              </select>
              <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-slate-200 rounded-[4px] text-[11px] text-slate-600">
            <span className="font-bold text-slate-800 block mb-0.5">Nota Penetapan:</span>
            Kadar perbatuan disetkan secara automatik pada <strong>RM0.35/KM</strong> selaras peraturan kewangan semasa. Resit tol Touch 'n Go dan parkir boleh dimuat naik melalui Pengimbas Resit AI.
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded text-xs font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#001026] hover:bg-[#0B2545] text-white px-4 py-1.5 rounded text-xs font-bold transition-colors shadow-2xs"
            >
              Cipta Folder Tuntutan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
