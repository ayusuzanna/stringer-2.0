import React, { useState } from 'react';
import {
  FileCheck2,
  Printer,
  Table,
  CheckCircle,
  FileSpreadsheet,
  Building,
  Calendar,
  Send,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { ClaimSubmission } from '../types';

interface HRVerificationViewProps {
  claims: ClaimSubmission[];
  onOpenPrintMemo: (claim: ClaimSubmission) => void;
  onOpenPrintLedger: () => void;
  onApproveBatchHR: () => void;
  onShowSuccessToast: (msg: string) => void;
}

export const HRVerificationView: React.FC<HRVerificationViewProps> = ({
  claims,
  onOpenPrintMemo,
  onOpenPrintLedger,
  onApproveBatchHR,
  onShowSuccessToast,
}) => {
  const [activeTab, setActiveTab] = useState<'ready' | 'verified' | 'submitted'>('ready');
  const [selectedBiro, setSelectedBiro] = useState('Semua Biro');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>([
    'STR-BH-2024-048',
    'STR-BH-2024-071',
    'STR-BH-2023-019',
  ]);
  const [currentSelectedForMemo, setCurrentSelectedForMemo] = useState<string>('STR-BH-2024-048');

  // Specific HR batch figures matching screenshot
  const hrBatchItems = [
    {
      id: 'STR-BH-2024-048',
      date: '14 Mac 2025',
      name: 'Ahmad Faiz bin Razali',
      nric: '890412-10-5541',
      biro: 'Biro Putrajaya',
      assignmentSummary: 'Liputan Sidang Parlimen, Mahkamah Putrajaya...',
      km: 1560,
      mileageRm: 546.00,
      tollParkingRm: 182.50,
      totalRm: 728.50,
    },
    {
      id: 'STR-BH-2024-071',
      date: '15 Mac 2025',
      name: 'Nurul Hanis binti Mohd Nor',
      nric: '930805-14-6122',
      biro: 'Biro Putrajaya',
      assignmentSummary: 'Liputan Pelancaran Dasar AI Nasional & Sida...',
      km: 1920,
      mileageRm: 672.00,
      tollParkingRm: 245.00,
      totalRm: 917.00,
    },
    {
      id: 'STR-BH-2023-019',
      date: '16 Mac 2025',
      name: 'Muhammad Syafiq bin Kamaruddin',
      nric: '910219-08-5431',
      biro: 'Biro Putrajaya',
      assignmentSummary: 'Tugasan Siasatan Khas & Liputan Pasukan R...',
      km: 800,
      mileageRm: 280.00,
      tollParkingRm: 850.90,
      totalRm: 1130.90,
    },
  ];

  const toggleSelectAll = () => {
    if (selectedClaimIds.length === hrBatchItems.length) {
      setSelectedClaimIds([]);
    } else {
      setSelectedClaimIds(hrBatchItems.map((i) => i.id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedClaimIds.includes(id)) {
      setSelectedClaimIds(selectedClaimIds.filter((item) => item !== id));
    } else {
      setSelectedClaimIds([...selectedClaimIds, id]);
    }
  };

  const filteredItems = hrBatchItems.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalMileage = hrBatchItems.reduce((acc, i) => acc + i.mileageRm, 0);
  const totalTollParking = hrBatchItems.reduce((acc, i) => acc + i.tollParkingRm, 0);
  const grandBatchTotal = hrBatchItems.reduce((acc, i) => acc + i.totalRm, 0);
  const totalKm = hrBatchItems.reduce((acc, i) => acc + i.km, 0);

  const selectedClaimObject = claims.find((c) => c.id === currentSelectedForMemo) || claims[0];

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">
          <span>Sistem Operasi Stringer</span>
          <span>&gt;</span>
          <span className="text-[#0B2545]">Bahagian Sumber Manusia (HR) NSTP</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-extrabold text-[#0B2545] tracking-tight">
              Pengesahan & Cetakan Tuntutan Editorial (Bahagian Sumber Manusia / HR NSTP)
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Semakan berpusat bagi kelompok tuntutan yang telah mendapat perakuan Ketua Jabatan (HOD) sebelum cetakan baucar rasmi dan penghantaran ke Akaun Belanja.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenPrintLedger}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors"
            >
              <Table className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak Jadual Landskap Kewangan</span>
            </button>
            <button
              onClick={() => {
                onApproveBatchHR();
                onShowSuccessToast('Kelompok tuntutan telah disahkan dan dihantar ke Bahagian Akaun & Kewangan.');
              }}
              className="inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white px-3.5 py-1.5 rounded-[4px] text-xs font-bold shadow-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sahkan dan Hantar Kelompok</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Tuntutan Lengkap HOD
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              3 fail
            </span>
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            100% Tandatangan Sah
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Jumlah Nilai Diluluskan
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">RM</span>
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              {grandBatchTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kitaran: Mac 2025 (Peringkat 1)
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Perbatuan Diperakui
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              {totalKm.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-500">KM</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kadar Standard: RM0.35/KM
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Status Pemprosesan HR
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-sm font-extrabold text-amber-800">
              Sedia Untuk Pengesahan
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tarikh Akhir Memo: 28 Mac 2025
          </p>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ready'
                ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
            <span>Sedia untuk Semakan HR</span>
            <span className="bg-[#B45309] text-white px-1.5 py-0.2 rounded-full text-[10px]">
              3
            </span>
          </button>

          <button
            onClick={() => setActiveTab('verified')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'verified'
                ? 'bg-[#E0F2FE] text-[#0369A1] border border-[#7DD3FC]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1]" />
            <span>Disahkan & Sedia Dicetak</span>
            <span className="bg-[#0369A1] text-white px-1.5 py-0.2 rounded-full text-[10px]">
              8
            </span>
          </button>

          <button
            onClick={() => setActiveTab('submitted')}
            className={`px-3 py-1.5 rounded-[4px] text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'submitted'
                ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>Dihantar ke Bahagian Kewangan</span>
            <span className="bg-[#15803D] text-white px-1.5 py-0.2 rounded-full text-[10px]">
              24
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama stringer atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs pl-7 pr-2.5 py-1.5 border border-slate-300 rounded-[4px] focus:ring-1 focus:ring-[#001026] w-52 bg-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>
          <select
            value={selectedBiro}
            onChange={(e) => setSelectedBiro(e.target.value)}
            className="text-xs border border-slate-300 rounded-[4px] px-2.5 py-1.5 bg-white text-slate-700"
          >
            <option>Biro Putrajaya & Selangor</option>
            <option>Semua Biro</option>
            <option>Biro Putrajaya</option>
            <option>Shah Alam & Klang</option>
          </select>
        </div>
      </div>

      {/* Main Table: Senarai Tuntutan Diluluskan HOD */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] shadow-[0_1px_2px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#0B2545]">
            Senarai Tuntutan Diluluskan HOD (Menunggu Perakuan HR)
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">Kitaran: Mac 2025</span>
            <span>Memaparkan 3 daripada 3 fail stringer yang sedia dicetak</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-y border-slate-200 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedClaimIds.length === hrBatchItems.length}
                    onChange={toggleSelectAll}
                    className="rounded-[3px] border-slate-300 text-[#001026] focus:ring-[#001026]"
                  />
                </th>
                <th className="py-2.5 px-3">Rujukan & Tarikh</th>
                <th className="py-2.5 px-3">Maklumat Stringer</th>
                <th className="py-2.5 px-3">Biro Editorial</th>
                <th className="py-2.5 px-3">Ringkasan Tugasan</th>
                <th className="py-2.5 px-3 text-right">Perbatuan (RM)</th>
                <th className="py-2.5 px-3 text-right">Tol/Parkir (RM)</th>
                <th className="py-2.5 px-3 text-right">Jumlah Bersih (RM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-['Inter',sans-serif]">
              {filteredItems.map((item) => {
                const isChecked = selectedClaimIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isChecked ? 'bg-[#EFF4FF]/50' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectItem(item.id)}
                        className="rounded-[3px] border-slate-300 text-[#001026] focus:ring-[#001026]"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#0B2545] font-mono text-[11px]">{item.id}</div>
                      <div className="text-[11px] text-slate-500">{item.date}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-500">No. K/P: {item.nric}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {item.biro}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-[240px] truncate text-[11px]">
                      {item.assignmentSummary}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-bold text-slate-900">RM {item.mileageRm.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400">({item.km.toLocaleString()} KM)</div>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-800">
                      RM {item.tollParkingRm.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-[#0B2545] text-sm">
                      RM {item.totalRm.toFixed(2)}
                    </td>
                  </tr>
                );
              })}

              {/* Subtotal Row */}
              <tr className="bg-[#EFF4FF] font-bold text-slate-900 border-t-2 border-[#CBD5E1]">
                <td colSpan={5} className="py-3 px-3 text-right uppercase text-[11px] tracking-wider text-[#0B2545]">
                  Jumlah Keseluruhan Kelompok Semasa:
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                  RM {totalMileage.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                  RM {totalTollParking.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right font-black text-sm text-[#0B2545]">
                  RM {grandBatchTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Dual Print Format Cards (Modul Dwi-Format Cetakan Rasmi NSTP Media Prima) */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-xs font-bold text-[#0B2545]">
              Modul Dwi-Format Cetakan Rasmi NSTP Media Prima
            </h3>
            <p className="text-[11px] text-slate-500">
              Pilih mod cetakan standard audit perakaunan Berita Harian sebelum penyelarasan baucar EFT.
            </p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Pematuhan Piawaian ISO 9001:2015 Kewangan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Format Potret A4 (F06) */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-[6px] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                  FORMAT F06
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Format Potret A4
                </span>
              </div>

              <h4 className="text-xs font-bold text-[#0B2545] leading-snug">
                Cetak Lampiran Terperinci Memo Kewangan (Itemized Claim Memo Attachment)
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Dokumen rasmi individu mengandungi butiran penuh log perjalanan mengikut hari, resit imbasan rasmi tol dan tempat letak kereta, pautan tugasan berita disiarkan, serta cop masa pengesahan digital Ketua Jabatan (Pn. Zaiton Ishak).
              </p>

              <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Format piawai A4 Editorial NSTP berserta teraan keselamatan</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Tandatangan Digital Stringer & Tandatangan Rasmi HOD Lengkap</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Lampiran resit optikal (OCR) telah disemak</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500">
                <span>Pilihan fail semasa: </span>
                <select
                  value={currentSelectedForMemo}
                  onChange={(e) => setCurrentSelectedForMemo(e.target.value)}
                  className="font-mono font-bold text-[#0B2545] bg-white border border-slate-300 rounded px-1.5 py-0.5"
                >
                  {claims.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.stringerName.split(' ')[0]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => onOpenPrintMemo(selectedClaimObject)}
                className="inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white px-3 py-1.5 rounded-[4px] text-xs font-bold transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Semak PDF & Borang Rasmi</span>
              </button>
            </div>
          </div>

          {/* Card 2: Format Landskap Rasmi (F07) */}
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-[6px] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                  FORMAT F07
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  Format Landskap Rasmi
                </span>
              </div>

              <h4 className="text-xs font-bold text-[#0B2545] leading-snug">
                Cetak Ringkasan Kewangan Berkelompok (Consolidated Finance Ledger)
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                Borang jadual matriks landskap rasmi: "STRINGER / PRACTICAL TRAINEE CLAIMS PROCESS IN THE MONTH OF : MAC 2025". Menyenaraikan semua no stringer, biro, jumlah dituntut, dan ruang tanda tangan pengesahan Eksekutif HR serta Pengurus Kewangan Kumpulan.
              </p>

              <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Landskap berskala penuh untuk edaran Mesyuarat Perakaunan</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Ringkasan sub-total per biro dan kod akaun kos (Cost Center 4120)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Disahkan oleh Eksekutif Pentadbiran Editorial NSTP</span>
                </li>
              </ul>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-[11px] text-slate-500">
                <span>Kelompok: <strong>Mac 2025 (3 Stringer)</strong></span>
              </div>

              <button
                type="button"
                onClick={onOpenPrintLedger}
                className="inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white px-3 py-1.5 rounded-[4px] text-xs font-bold transition-colors shadow-xs"
              >
                <Table className="w-3.5 h-3.5" />
                <span>Cetak Jadual Landskap Kewangan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: HR Compliance Statement */}
      <div className="bg-[#F8FAFC] border border-slate-200 rounded-[6px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#0B2545]">
              Pemeriksaan Pematuhan Sumber Manusia Berita Harian
            </h4>
            <p className="text-[11.5px] text-slate-600 mt-0.5 leading-relaxed max-w-2xl">
              Fail tuntutan telah disahkan selaras dengan Pekeliling Kewangan NSTP/BH Bil. 4/2023. Semua resit tol lebuh raya (Touch 'n Go) dan baucar bahan api telah dipadankan dengan log GPS portal stringer.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
              <span>Pegawai Pemeriksa: <strong>Zulkifli Hassan (Eksekutif Kanan HR Editorial)</strong></span>
              <span>•</span>
              <span>ID Pengguna: <strong className="font-mono">HR-NSTP-8821</strong></span>
              <span>•</span>
              <span>Status: <strong className="text-emerald-700">Sedia untuk Penyerahan Kelompok</strong></span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            onApproveBatchHR();
            onShowSuccessToast('Borang kelompok berjaya dimajukan ke Jabatan Akaun (Payroll NSTP).');
          }}
          className="inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white text-xs font-bold px-4 py-2.5 rounded-[4px] shadow-xs transition-colors shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Sahkan dan Hantar Kelompok ke Bahagian Akaun & Kewangan</span>
        </button>
      </div>
    </div>
  );
};
