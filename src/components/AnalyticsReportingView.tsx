import React, { useState } from 'react';
import {
  FileText,
  Download,
  Filter,
  RotateCcw,
  BarChart3,
  Users,
  CheckCircle,
  Eye,
  ShieldCheck,
  Building,
  Car,
  Lock,
  Layers,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { ClaimSubmission } from '../types';

interface AnalyticsReportingViewProps {
  claims: ClaimSubmission[];
  onOpenPrintMemo: (claim: ClaimSubmission) => void;
  onShowSuccessToast: (msg: string) => void;
}

export const AnalyticsReportingView: React.FC<AnalyticsReportingViewProps> = ({
  claims,
  onOpenPrintMemo,
  onShowSuccessToast,
}) => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedMonth, setSelectedMonth] = useState('Mac 2025');
  const [selectedBiro, setSelectedBiro] = useState('Semua Biro');
  const [selectedCategory, setSelectedCategory] = useState('Semua Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([
    'STR-PUTRA-088',
    'STR-KUL-042',
    'STR-SGR-019',
  ]);

  // Master records matching screenshot
  const masterRecords = [
    {
      id: 'STR-PUTRA-088',
      name: 'Ahmad Ridzuan bin Halim',
      tag: 'BH Digital',
      biro: 'Biro Putrajaya & Parlimen',
      duty: '18 Tugasan Liputan Sidang Dewan Rakyat',
      km: 2410,
      mileageRm: 843.50,
      tollEtcRm: 142.00,
      netRm: 985.50,
      status: 'Disahkan HOD',
    },
    {
      id: 'STR-KUL-042',
      name: 'Nurul Syafika bt Zamri',
      tag: 'Meja Mahkamah',
      biro: 'Mahkamah Kuala Lumpur & Khas',
      duty: '14 Tugasan Kes Profil Tinggi Kompleks Jalan Duta',
      km: 1850,
      mileageRm: 647.50,
      tollEtcRm: 98.00,
      netRm: 745.50,
      status: 'Disahkan HOD',
    },
    {
      id: 'STR-SGR-019',
      name: 'Kamarul Bahrin bin Othman',
      tag: 'Biro Shah Alam',
      biro: 'Shah Alam & Lembah Klang',
      duty: '22 Tugasan Liputan Isu Banjir & Kerajaan Negeri',
      km: 3120,
      mileageRm: 1092.00,
      tollEtcRm: 210.50,
      netRm: 1302.50,
      status: 'Sedia Untuk Kewangan',
    },
    {
      id: 'STR-SPT-031',
      name: 'Mohd Fairuz bin Mansor',
      tag: 'Meja Sukan',
      biro: 'Meja Sukan Media Prima',
      duty: '12 Tugasan Kejohanan Badminton Kebangsaan & Bola',
      km: 1640,
      mileageRm: 574.00,
      tollEtcRm: 75.00,
      netRm: 649.00,
      status: 'Disahkan HOD',
    },
    {
      id: 'STR-NSTP-011',
      name: 'Zainab binti Sulaiman',
      tag: 'Berita Harian Bangsar',
      biro: 'Ibu Pejabat NSTP Bangsar',
      duty: '9 Tugasan Sidang Media Korporat & Pelaburan',
      km: 980,
      mileageRm: 343.00,
      tollEtcRm: 45.00,
      netRm: 388.00,
      status: 'Disahkan HOD',
    },
  ];

  const handleExportCSV = () => {
    const headers = [
      'No Stringer',
      'Nama Penuh',
      'Biro',
      'Tugasan',
      'Jarak (KM)',
      'Elaun KM (RM)',
      'Tol & Parkir (RM)',
      'Jumlah Bersih (RM)',
      'Status',
    ];
    const rows = masterRecords.map((r) => [
      r.id,
      r.name,
      r.biro,
      `"${r.duty}"`,
      r.km,
      r.mileageRm.toFixed(2),
      r.tollEtcRm.toFixed(2),
      r.netRm.toFixed(2),
      r.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Eksekutif_Stringer_BH_${selectedMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowSuccessToast('Laporan Eksekutif CSV berjaya dimuat turun.');
  };

  const handleDownloadAuditLog = () => {
    const logData = {
      system: 'Stringer Claim Portal v5.0',
      entity: 'The New Straits Times Press (Malaysia) Berhad',
      auditTimestamp: new Date().toISOString(),
      reportPeriod: selectedMonth,
      rateFixedKm: 0.35,
      recordsAudited: 42,
      activeStringers: 42,
      totalMileageApprovedKm: 56420,
      totalNetClaimsRm: 24850.40,
      verifiedByHOD: "Dato' Ahmad Faizal bin Harun (EMP-MP-7102)",
      verifiedByFinance: 'Puan Maznah binti Ariffin',
      sha256Hash: 'SHA256-BH-HOD-8849F-2025-03',
    };
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Audit_Log_BH_Stringers_${selectedMonth.replace(' ', '_')}.json`;
    link.click();
    onShowSuccessToast('Audit Log Rasmi dimuat turun sebagai fail JSON selamat.');
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((r) => r !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const filteredRecords = masterRecords.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.biro.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">
          <span>Portal Operasi Editorial</span>
          <span>&gt;</span>
          <span>Pengurusan Kewangan Stringer</span>
          <span>&gt;</span>
          <span className="text-[#0B2545]">Pengekstrakan & Analitik Eksekutif</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-extrabold text-[#0B2545] tracking-tight">
              Analitik & Pengekstrakan Laporan Pengurusan (HR & Eksekutif)
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Pusat konsolidasi audit perbelanjaan lapangan, lejar tuntutan kilometer (RM0.35/KM), dan pengesahan bajet suku tahunan bagi pengurusan kanan Berita Harian.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadAuditLog}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Muat Turun Audit Log</span>
            </button>
            <button
              onClick={() => onShowSuccessToast('Ringkasan PDF Pengurusan sedang dijana...')}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Jana Ringkasan PDF Pengurusan</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white px-3.5 py-1.5 rounded-[4px] text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Eksport Laporan Eksekutif (CSV / Excel)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar: Penapis Laporan & Parameter Lejar Kewangan */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-600" />
            <span>Penapis Laporan & Parameter Lejar Kewangan</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Kadar Rasmi Semasa: <strong className="text-[#0B2545]">RM 0.35 / Kilometer</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 items-end">
          <div>
            <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
              Tahun Kewangan
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-[4px] px-2.5 py-1.5 bg-white text-slate-800 font-medium"
            >
              <option value="2025">2025 (Tahun Semasa)</option>
              <option value="2024">2024</option>
            </select>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
              Tempoh / Bulan
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-[4px] px-2.5 py-1.5 bg-white text-slate-800 font-medium"
            >
              <option value="Mac 2025">Mac 2025 (Pengekstrakan)</option>
              <option value="Februari 2025">Februari 2025</option>
              <option value="Januari 2025">Januari 2025</option>
            </select>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
              Cawangan / Biro Editorial
            </label>
            <select
              value={selectedBiro}
              onChange={(e) => setSelectedBiro(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-[4px] px-2.5 py-1.5 bg-white text-slate-800 font-medium"
            >
              <option value="Semua Biro">Semua Biro (8 Cawangan)</option>
              <option value="Putrajaya">Biro Putrajaya & Parlimen</option>
              <option value="Shah Alam">Shah Alam & Lembah Klang</option>
              <option value="Mahkamah">Mahkamah KL & Khas</option>
              <option value="Sukan">Meja Sukan Media Prima</option>
            </select>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-slate-600 uppercase mb-1">
              Kategori Wartawan Sambilan
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-[4px] px-2.5 py-1.5 bg-white text-slate-800 font-medium"
            >
              <option value="Semua Status">Semua Status (Aktif & Bersara)</option>
              <option value="Aktif Sahaja">Aktif Sahaja</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onShowSuccessToast('Data berjaya ditapis.')}
              className="flex-1 bg-[#001026] hover:bg-[#0B2545] text-white py-1.5 px-3 rounded-[4px] text-xs font-bold transition-colors shadow-2xs flex items-center justify-center gap-1.5"
            >
              <Filter className="w-3 h-3" />
              <span>Tapis Data</span>
            </button>
            <button
              onClick={() => {
                setSelectedYear('2025');
                setSelectedMonth('Mac 2025');
                setSelectedBiro('Semua Biro');
                setSelectedCategory('Semua Status');
                onShowSuccessToast('Penapis telah ditetapkan semula.');
              }}
              className="p-1.5 border border-slate-300 hover:bg-slate-50 rounded-[4px] text-slate-600"
              title="Set Semula"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Jumlah Tuntutan Bulanan
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">RM</span>
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              24,850.40
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>Bajet Suku Tahun: RM 85,000</span>
            <span className="font-bold text-slate-800">29.2% Terpakai</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Jumlah Jarak Perjalanan
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              56,420
            </span>
            <span className="text-xs font-bold text-slate-500">KM</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>Kadar Milage: RM0.35/KM</span>
            <span>Nilai: RM 19,747.00</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Stringer Aktif Menuntut
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              42
            </span>
            <span className="text-xs font-bold text-slate-500">Wartawan</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
            <span>Merangkumi 8 Biro Utama</span>
            <span className="font-bold text-emerald-700">100% Sah Semak</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Purata Kelulusan Penuh
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              1.8
            </span>
            <span className="text-xs font-bold text-slate-500">Hari</span>
          </div>
          <div className="flex items-center justify-between text-xs text-emerald-700 font-medium mt-1">
            <span>Penjimatan Masa Audit</span>
            <span className="font-bold">↘ -54% vs Borang Manual</span>
          </div>
        </div>
      </div>

      {/* Visual Charts: Monthly Expenditure Trend & Biro Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Trend Perbelanjaan Bulanan Stringer (S1 2025) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-[#0B2545]">
                  Trend Perbelanjaan Bulanan Stringer (S1 2025)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Perbandingan perbelanjaan Jarak Perbatuan (Mileage RM0.35/KM) berbanding Tol, Parkir & Elaun Liputan Khas
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-[11px] text-slate-600 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#0B2545]" />
                <span>Mileage (KM)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#495F82]" />
                <span>Tol & Parkir</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#B1C7F0]" />
                <span>Elaun Liputan Khas</span>
              </div>
            </div>

            {/* Stacked Bars */}
            <div className="space-y-3.5">
              {/* Jan 2025 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">Januari 2025</span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Jumlah: <strong className="text-slate-900">RM 21,340.00</strong> (Mileage: RM16,800 | Tol: RM3,440 | Lain: RM1,100)
                  </span>
                </div>
                <div className="w-full h-7 bg-slate-100 rounded-[4px] overflow-hidden flex shadow-inner">
                  <div style={{ width: '78.7%' }} className="bg-[#0B2545] flex items-center justify-center text-white text-[10px] font-bold">
                    78.7% (Mileage)
                  </div>
                  <div style={{ width: '16.1%' }} className="bg-[#495F82] flex items-center justify-center text-white text-[10px] font-bold">
                    16.1%
                  </div>
                  <div style={{ width: '5.2%' }} className="bg-[#B1C7F0] flex items-center justify-center text-[#0B2545] text-[10px] font-bold">
                    5.2%
                  </div>
                </div>
              </div>

              {/* Feb 2025 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800">
                    Februari 2025 (Pilihan Raya Kecil & Sidang Parlimen)
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Jumlah: <strong className="text-slate-900">RM 28,190.50</strong> (Mileage: RM22,400 | Tol: RM4,290 | Lain: RM1,500)
                  </span>
                </div>
                <div className="w-full h-7 bg-slate-100 rounded-[4px] overflow-hidden flex shadow-inner">
                  <div style={{ width: '79.4%' }} className="bg-[#0B2545] flex items-center justify-center text-white text-[10px] font-bold">
                    79.4% (Mileage)
                  </div>
                  <div style={{ width: '15.2%' }} className="bg-[#495F82] flex items-center justify-center text-white text-[10px] font-bold">
                    15.2%
                  </div>
                  <div style={{ width: '5.4%' }} className="bg-[#B1C7F0] flex items-center justify-center text-[#0B2545] text-[10px] font-bold">
                    5.4%
                  </div>
                </div>
              </div>

              {/* Mar 2025 */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Mac 2025 (Kitaran Semasa: Aktif)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Jumlah Semasa: <strong className="text-slate-900">RM 24,850.40</strong> (Mileage: RM19,747 | Tol: RM3,820 | Lain: RM1,283)
                  </span>
                </div>
                <div className="w-full h-7 bg-slate-100 rounded-[4px] overflow-hidden flex shadow-inner">
                  <div style={{ width: '79.5%' }} className="bg-[#0B2545] flex items-center justify-center text-white text-[10px] font-bold">
                    79.5% (RM19.7k)
                  </div>
                  <div style={{ width: '15.4%' }} className="bg-[#495F82] flex items-center justify-center text-white text-[10px] font-bold">
                    15.4%
                  </div>
                  <div style={{ width: '5.1%' }} className="bg-[#B1C7F0] flex items-center justify-center text-[#0B2545] text-[10px] font-bold">
                    5.1%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Semua resit tol lebuh raya Touch 'n Go berpadanan dengan data penugasan portal berita.</span>
            </span>
            <span className="font-bold text-slate-700">Status Lejar: Sedia Diaudit</span>
          </div>
        </div>

        {/* Right: Pecahan Tuntutan Mengikut Biro */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] flex flex-col justify-between">
          <div>
            <div className="pb-2 mb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-[#0B2545]">
                Pecahan Tuntutan Mengikut Biro
              </h3>
              <p className="text-[11px] text-slate-500">
                Pengagihan bajet tuntutan Stringer bagi bulan Mac 2025.
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Biro 1 */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    Biro Putrajaya & Parlimen
                  </span>
                  <span className="font-extrabold text-[#0B2545]">
                    RM 8,420.00 (33.9%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0B2545] h-full rounded-full" style={{ width: '33.9%' }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  14 Wartawan Sambilan • 19,200 KM Liputan Rasmi Kerajaan
                </p>
              </div>

              {/* Biro 2 */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    Shah Alam & Lembah Klang
                  </span>
                  <span className="font-extrabold text-[#0B2545]">
                    RM 6,150.20 (24.7%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#495F82] h-full rounded-full" style={{ width: '24.7%' }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  11 Wartawan Sambilan • 14,800 KM Berita Tempatan & Dun
                </p>
              </div>

              {/* Biro 3 */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    Meja Jenayah & Mahkamah KL
                  </span>
                  <span className="font-extrabold text-[#0B2545]">
                    RM 5,280.20 (21.2%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#778DB2] h-full rounded-full" style={{ width: '21.2%' }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  9 Wartawan Sambilan • 11,420 KM Tugasan Kompleks Mahkamah
                </p>
              </div>

              {/* Biro 4 */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    Meja Sukan & Lain-lain Biro
                  </span>
                  <span className="font-extrabold text-[#0B2545]">
                    RM 5,000.00 (20.2%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#B1C7F0] h-full rounded-full" style={{ width: '20.2%' }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  8 Wartawan Sambilan • 11,000 KM Liputan Liga Malaysia & Belia
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="text-emerald-700 font-bold">
              ✓ Biro Putrajaya memegang rekod pematuhan 100%.
            </span>
            <span className="font-mono text-[10px]">MYT 16:42:00</span>
          </div>
        </div>
      </div>

      {/* Master Data Ledger Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] shadow-[0_1px_2px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-[#0B2545]">
                Lejar Data Induk Pengesahan & Pengekstrakan (Mac 2025)
              </h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                42 Rekod Dimuatkan
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Klik pada baris mana-mana stringer untuk memaparkan log audit perbelanjaan penuh berserta pautan lampiran baucar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari nama stringer atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded-[4px] w-56 bg-white focus:ring-1 focus:ring-[#001026]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-y border-slate-200 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === masterRecords.length}
                    onChange={() => {
                      if (selectedRows.length === masterRecords.length) setSelectedRows([]);
                      else setSelectedRows(masterRecords.map((r) => r.id));
                    }}
                    className="rounded-[3px] border-slate-300 text-[#001026]"
                  />
                </th>
                <th className="py-2.5 px-3">Stringer / ID Wartawan</th>
                <th className="py-2.5 px-3">Biro & Liputan Berita</th>
                <th className="py-2.5 px-3 text-right">Jarak (KM)</th>
                <th className="py-2.5 px-3 text-right">Tuntutan KM</th>
                <th className="py-2.5 px-3 text-right">Tol & Lain</th>
                <th className="py-2.5 px-3 text-right">Jumlah Bersih</th>
                <th className="py-2.5 px-3 text-center">Status Kelulusan</th>
                <th className="py-2.5 px-3 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-['Inter',sans-serif]">
              {filteredRecords.map((r) => {
                const isChecked = selectedRows.includes(r.id);
                return (
                  <tr
                    key={r.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isChecked ? 'bg-[#EFF4FF]/40' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelectRow(r.id)}
                        className="rounded-[3px] border-slate-300 text-[#001026]"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{r.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <span>{r.id}</span>
                        <span>•</span>
                        <span className="text-slate-600">{r.tag}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800">{r.biro}</div>
                      <div className="text-[11px] text-slate-500 max-w-[220px] truncate">
                        {r.duty}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">
                      {r.km.toLocaleString()} KM
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-900">
                      RM {r.mileageRm.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700">
                      RM {r.tollEtcRm.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                      RM {r.netRm.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {r.status === 'Disahkan HOD' ? (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#0369A1] bg-[#E0F2FE] border border-[#7DD3FC] px-2 py-0.5 rounded-[4px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1]" />
                          Disahkan HOD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#15803D] bg-[#DCFCE7] border border-[#86EFAC] px-2 py-0.5 rounded-[4px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                          Sedia Untuk Kewangan
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            const found = claims.find((c) => c.id === r.id) || claims[0];
                            onOpenPrintMemo(found);
                          }}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                          title="Lihat Butiran Tuntutan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onShowSuccessToast(`Data baucar ${r.id} dieksport.`)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded"
                          title="Muat Turun Baucar"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Subtotal summary bar */}
              <tr className="bg-[#EFF4FF] font-bold text-slate-900 border-t-2 border-[#CBD5E1]">
                <td colSpan={3} className="py-3 px-3 uppercase text-[11px] tracking-wider text-[#0B2545]">
                  Jumlah Pilihan Ditapis (5 Baris Dipaparkan daripada 42):
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                  10,000 KM
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                  RM 3,500.00
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                  RM 570.50
                </td>
                <td className="py-3 px-3 text-right font-black text-sm text-[#0B2545]">
                  RM 4,070.50
                </td>
                <td colSpan={2} className="py-3 px-3 text-center text-xs text-emerald-800 font-bold">
                  100% Selaras Bajet F08
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Memaparkan <strong>1 hingga 5</strong> daripada <strong>42</strong> rekod penugasan stringer
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled
              className="px-2 py-1 border border-slate-200 rounded text-slate-300 cursor-not-allowed text-[11px]"
            >
              Sebelumnya
            </button>
            <button className="px-2.5 py-1 bg-[#001026] text-white rounded font-bold text-[11px]">
              1
            </button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50 text-[11px]">
              2
            </button>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50 text-[11px]">
              3
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 border border-slate-200 rounded hover:bg-slate-50 text-[11px]">
              9
            </button>
            <button className="px-2 py-1 border border-slate-200 rounded hover:bg-slate-50 text-[11px]">
              Seterusnya
            </button>
          </div>
        </div>
      </div>

      {/* Dual Official Seals & Auditing Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Meterai Pengesahan Digital Ketua Jabatan (HOD) */}
        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#0B2545]">
              Meterai Pengesahan Digital Ketua Jabatan (HOD)
            </h4>
            <span className="text-[10px] font-bold text-[#0369A1] bg-[#E0F2FE] border border-[#7DD3FC] px-2 py-0.5 rounded">
              DISAHKAN
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Pegawai Pengesah:</span>
              <strong className="text-slate-900">Dato' Ahmad Faizal bin Harun</strong>
              <div className="text-[11px] text-slate-500">Ketua Pengarang Berita Tempatan & Stringer</div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Tarikh & Masa Pengesahan:</span>
              <span className="font-medium text-slate-800">28 Mac 2025 • 15:30:14 MYT</span>
              <span className="text-slate-400 text-[10px] ml-1">(IP: 10.20.14.88 Intranet Bangsar)</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-[10.5px] text-slate-600">
                Audit Hash: SHA256-BH-HOD-8849F-2025-03
              </span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                <CheckCircle className="w-3 h-3" /> Sijil Digital Sah
              </span>
            </div>
          </div>
        </div>

        {/* Right: Pengauditan Kewangan Media Prima Bhd */}
        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <h4 className="text-xs font-bold text-[#0B2545]">
              Pengauditan Kewangan Media Prima Bhd
            </h4>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
              SEDIA DIBAYAR
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10.5px]">Akauntan Pembayar:</span>
              <strong className="text-slate-900">Puan Maznah binti Ariffin</strong>
              <div className="text-[11px] text-slate-500">Jabatan Kewangan Kumpulan (NSTP/BH)</div>
            </div>
            <div>
              <span className="text-slate-400 block text-[10.5px]">Kitaran Bayaran Stringer:</span>
              <span className="font-medium text-slate-800">Batch #04-APR-2025</span>
              <span className="text-slate-500 text-[10.5px] ml-1">(Pindahan Terus Maybank Corporate)</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="font-mono text-[10.5px] text-slate-600">
                Baucar Induk: VCHR-2025-MPB-03912
              </span>
              <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                <Lock className="w-3 h-3" /> Disulitkan untuk Payroll
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
