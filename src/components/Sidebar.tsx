import React from 'react';
import {
  LayoutGrid,
  FileCheck2,
  FileText,
  BarChart3,
  BookOpen,
  Settings,
  Send,
  Building2,
  ShieldCheck,
  Bookmark,
} from 'lucide-react';
import { NSTPBrandLogo } from './NSTPLogo';

export type ActiveTab = 'stringer' | 'hod' | 'hr' | 'analytics';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingHODCount: number;
  pendingHRCount: number;
  onOpenRateGuide: () => void;
  onOpenSettings: () => void;
  onSubmitMonthlyClaim?: () => void;
  onOpenLinks?: () => void;
  linksCount?: number;
  currentBiro?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  pendingHODCount,
  pendingHRCount,
  onOpenRateGuide,
  onOpenSettings,
  onSubmitMonthlyClaim,
  onOpenLinks,
  linksCount = 6,
  currentBiro = 'Biro Putrajaya & Parlimen',
}) => {
  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col shrink-0 min-h-[calc(100vh-53px)] select-none">
      {/* Top Biro Header */}
      <div className="p-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Biro Bertugas
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Building2 className="w-4 h-4 text-[#0B2545] shrink-0" />
          <div>
            <h3 className="text-xs font-bold text-[#0B2545] leading-tight">
              {currentBiro}
            </h3>
            <p className="text-[10px] text-slate-500 leading-tight">
              Modul Kewangan & Pentadbiran
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="p-2 space-y-1 flex-1">
        <button
          onClick={() => onTabChange('stringer')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] text-xs font-semibold transition-all ${
            activeTab === 'stringer'
              ? 'bg-[#E5EEFF] text-[#001026] shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <LayoutGrid className="w-4 h-4 text-slate-600" />
            <span className="text-left">Papan Pemuka & Tuntutan Bulanan</span>
          </div>
        </button>

        <button
          onClick={() => onTabChange('hod')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] text-xs font-semibold transition-all ${
            activeTab === 'hod'
              ? 'bg-[#E5EEFF] text-[#001026] shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileText className="w-4 h-4 text-slate-600" />
            <span className="text-left">Semakan & Kelulusan HOD</span>
          </div>
          {pendingHODCount > 0 && (
            <span className="bg-[#FEF3C7] text-[#B45309] font-bold text-[11px] px-1.5 py-0.2 rounded border border-[#FCD34D]">
              {pendingHODCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('hr')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] text-xs font-semibold transition-all ${
            activeTab === 'hr'
              ? 'bg-[#E5EEFF] text-[#001026] shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-4 h-4 text-slate-600" />
            <span className="text-left">Pengesahan & Cetakan HR</span>
          </div>
          {pendingHRCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#C1121F]" />
          )}
        </button>

        <button
          onClick={() => onTabChange('analytics')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[4px] text-xs font-semibold transition-all ${
            activeTab === 'analytics'
              ? 'bg-[#E5EEFF] text-[#001026] shadow-xs'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-4 h-4 text-slate-600" />
            <span className="text-left">Analitik & Laporan Pengurusan</span>
          </div>
        </button>

        {/* Quick action button for submitting monthly claim */}
        {activeTab === 'stringer' && onSubmitMonthlyClaim && (
          <div className="pt-3 px-1">
            <button
              onClick={onSubmitMonthlyClaim}
              className="w-full flex items-center justify-center gap-2 bg-[#001026] hover:bg-[#0B2545] text-white py-2 px-3 rounded-[4px] text-xs font-semibold transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Hantar Tuntutan Bulanan</span>
            </button>
          </div>
        )}
      </div>

      {/* Audit Compliance Info Box */}
      <div className="p-3 m-3 bg-[#F8FAFC] border border-slate-200/80 rounded-[4px] text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Pematuhan Audit</span>
        </div>
        <p className="text-slate-500 leading-relaxed text-[10.5px]">
          Semua tuntutan perbatuan diselaraskan dengan jadual rasmi NSTP Media Prima.
        </p>
      </div>

      {/* Footer Utility links */}
      <div className="p-3 border-t border-[#E2E8F0] space-y-1.5 text-xs text-slate-600">
        <a
          href="https://stringer.ai.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#EFF4FF] hover:bg-blue-100 border border-blue-200 rounded-[4px] transition-colors text-left font-bold text-[#0B2545]"
          title="Buka Pautan Rasmi Portal: https://stringer.ai.studio"
        >
          <span className="text-[11px] font-mono">🌐 stringer.ai.studio</span>
          <span className="text-[9.5px] bg-[#001026] text-white px-1.5 py-0.2 rounded uppercase">
            Buka
          </span>
        </a>

        {onOpenLinks && (
          <button
            onClick={onOpenLinks}
            className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-slate-50 rounded-[4px] transition-colors text-left font-medium text-[#0B2545]"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
              <span>Pautan & Rujukan Rasmi</span>
            </div>
            <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
              {linksCount}
            </span>
          </button>
        )}

        <button
          onClick={onOpenRateGuide}
          className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-[4px] transition-colors text-left font-medium"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>Panduan Kadar RM0.35/KM</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-[4px] transition-colors text-left font-medium"
        >
          <Settings className="w-3.5 h-3.5 text-slate-500" />
          <span>Tetapan Akaun</span>
        </button>

        <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[10px] text-slate-400">
          <div className="font-semibold text-slate-500">BH-Claim v5.0 Core Engine</div>
          <div>Berita Harian • NSTP Digital Finance</div>
        </div>

        <div className="pt-2">
          <NSTPBrandLogo size="md" />
        </div>
      </div>
    </aside>
  );
};
