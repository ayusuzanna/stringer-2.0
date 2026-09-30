import React, { useState } from 'react';
import { X, Settings, User, CreditCard, Shield, Save } from 'lucide-react';
import { NSTPBrandLogo } from './NSTPLogo';

interface AccountSettingsModalProps {
  onClose: () => void;
  onShowSuccessToast: (msg: string) => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  onClose,
  onShowSuccessToast,
}) => {
  const [name, setName] = useState('Ahmad Faiz bin Razali');
  const [nric, setNric] = useState('890412-10-5541');
  const [phone, setPhone] = useState('+60 12-384 9912');
  const [email, setEmail] = useState('ahmad.faiz@mediaprima.com.my');
  const [bankAccount, setBankAccount] = useState('Maybank 5122-8901-4412');
  const [vehicleNo, setVehicleNo] = useState('VBN 4821');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onShowSuccessToast('Tetapan profil dan akaun EFT berjaya dikemaskini.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-center justify-center">
      <div className="bg-white rounded-[8px] max-w-lg w-full p-6 shadow-2xl border border-slate-300 relative">
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
              Tetapan Akaun & Profil Wartawan Sambilan
            </h2>
            <p className="text-[11px] text-slate-500">
              Pendaftaran maklumat peribadi dan butiran pembayaran EFT Berita Harian
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nama Penuh
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                No. Kad Pengenalan
              </label>
              <input
                type="text"
                value={nric}
                onChange={(e) => setNric(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Nombor Telefon
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Emel Rasmi
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Akaun Bank EFT (Payroll)
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white font-mono text-slate-900"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                No. Pendaftaran Kenderaan
              </label>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-[4px] bg-white font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[4px] text-[11px] text-emerald-800 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Akaun disahkan untuk pembayaran terus Maybank Corporate Payroll Media Prima Berhad.
            </span>
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
              className="inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white px-4 py-1.5 rounded text-xs font-bold transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Tetapan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
