import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { HeaderBrand } from './NSTPLogo';
import {
  Bell,
  HelpCircle,
  Plus,
  ChevronDown,
  Check,
  ShieldCheck,
  Car,
  Bookmark,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenNewClaim: () => void;
  onOpenRateGuide: () => void;
  isFirebaseSynced?: boolean;
  currentUser?: UserProfile | null;
  onSignOut?: () => void;
  onOpenLinks?: () => void;
  linksCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenNewClaim,
  onOpenRateGuide,
  isFirebaseSynced = false,
  currentUser,
  onSignOut,
  onOpenLinks,
  linksCount = 6,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Resit Diluluskan AI',
      desc: 'Plaza Tol Batu Tiga (PLUS) RM5.60 berjaya dipadankan.',
      time: '10 minit lalu',
      unread: true,
    },
    {
      id: 2,
      title: 'Peringatan HOD',
      desc: 'Tarikh akhir penyerahan tuntutan Mac 2025: 31 Mac 2025.',
      time: '2 jam lalu',
      unread: true,
    },
    {
      id: 3,
      title: 'Pekeliling Kewangan',
      desc: 'Kadar perbatuan RM0.35/KM kekal berkuatkuasa untuk S1 2025.',
      time: '1 hari lalu',
      unread: false,
    },
  ];

  const roleProfiles = {
    stringer: {
      name: 'Ahmad Faiz bin Razali',
      title: 'Wartawan Sambilan (Stringer)',
      biro: 'Biro Putrajaya & Parlimen',
      id: 'STR-BH-2024-048',
      initials: 'AF',
    },
    hod: {
      name: 'Pn. Zaiton Ishak',
      title: 'Pengarang Berita Kanan / HOD Biro',
      biro: 'Biro Putrajaya',
      id: 'EMP-MP-8831',
      initials: 'ZI',
    },
    hr: {
      name: 'Zulkifli Hassan',
      title: 'Eksekutif Kanan HR Editorial',
      biro: 'Ibu Pejabat NSTP Bangsar',
      id: 'HR-NSTP-8821',
      initials: 'ZH',
    },
  };

  const activeProfile = roleProfiles[currentRole];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.04)] px-4 py-2.5">
      <div className="max-w-[1520px] mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Biro Indicator */}
        <div className="flex items-center gap-3.5">
          <HeaderBrand />

          <div className="hidden md:block h-6 w-px bg-slate-200" />

          {/* Biro Selection display */}
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Biro
            </span>
            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
              Putrajaya
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            </span>
          </div>

          <div className="hidden lg:block h-6 w-px bg-slate-200" />

          {/* Active Role Label */}
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Peranan:
            </span>
            <span className="text-xs font-semibold text-[#0B2545]">
              {currentRole === 'stringer'
                ? 'Wartawan Sambilan (Stringer)'
                : currentRole === 'hod'
                ? 'Ketua Jabatan (HOD)'
                : 'Pegawai HR'}
            </span>
          </div>
        </div>

        {/* Center: Official Rate Badge, Public Portal Link & Firestore Status */}
        <div className="hidden xl:flex items-center gap-2">
          <a
            href="https://stringer.ai.studio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#EFF4FF] hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-[4px] text-[11px] font-bold text-[#0B2545] transition-colors"
            title="Buka Pautan Awam Portal: https://stringer.ai.studio"
          >
            <span>🌐</span>
            <span className="font-mono">stringer.ai.studio</span>
          </a>

          <div className="flex items-center gap-2 bg-[#F1F5F9] border border-slate-200/80 px-3 py-1.5 rounded-[4px] text-xs">
            <Car className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-600 font-medium">Kadar Rasmi:</span>
            <span className="font-bold text-[#0B2545]">RM0.35 / KM</span>
            <span className="text-[10px] text-slate-400 font-medium">(Tetap)</span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[11px] font-semibold border ${
              isFirebaseSynced
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
            title={
              isFirebaseSynced
                ? 'Pangkalan data Firestore disambungkan secara langsung'
                : 'Menyambung ke Firebase Firestore...'
            }
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isFirebaseSynced ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isFirebaseSynced ? 'Firestore Aktif' : 'Menyambung'}</span>
          </div>
        </div>

        {/* Right Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Role Switcher Pills */}
          <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-[4px] border border-slate-200">
            <button
              onClick={() => onRoleChange('stringer')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-all ${
                currentRole === 'stringer'
                  ? 'bg-[#001026] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stringer
            </button>
            <button
              onClick={() => onRoleChange('hod')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-all ${
                currentRole === 'hod'
                  ? 'bg-[#001026] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HOD
            </button>
            <button
              onClick={() => onRoleChange('hr')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-[3px] transition-all ${
                currentRole === 'hr'
                  ? 'bg-[#001026] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HR
            </button>
          </div>

          {/* New Claim button */}
          <button
            onClick={onOpenNewClaim}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white text-xs font-semibold px-3 py-1.5 rounded-[4px] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tuntutan Baharu</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-[4px] relative transition-colors"
              title="Pemberitahuan"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#C1121F] rounded-full border border-white" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-[6px] shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Pemberitahuan Sistem</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-semibold">2 Baru</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Official Links Button */}
          {onOpenLinks && (
            <button
              onClick={onOpenLinks}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-[4px] text-xs font-semibold transition-colors border border-slate-200"
              title="Pautan Rasmi & Pekeliling Simpanan Firebase"
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
              <span>Pautan Rasmi</span>
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {linksCount}
              </span>
            </button>
          )}

          {/* Help Button (Rate Guide) */}
          <button
            onClick={onOpenRateGuide}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-[4px] transition-colors"
            title="Panduan Kadar & SOP Perbatuan RM0.35/KM"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-[#001026] text-white flex items-center justify-center font-bold text-xs ring-1 ring-slate-300">
              {currentUser?.displayName
                ? currentUser.displayName.slice(0, 2).toUpperCase()
                : activeProfile.initials}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.displayName || activeProfile.name}
                </span>
                {currentUser?.isSuperAdmin && (
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded">
                    Semua Role
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                {currentUser?.email || currentUser?.biro || activeProfile.title}
              </span>
            </div>

            {/* Sign Out Button */}
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="ml-1 p-1.5 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-[4px] transition-colors flex items-center gap-1 text-xs font-semibold"
                title="Log Keluar (Sign Out)"
              >
                <LogOut className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden md:inline text-[11px] text-red-600">Log Keluar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
