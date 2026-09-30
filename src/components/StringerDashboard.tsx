import React, { useState } from 'react';
import {
  Car,
  Calculator,
  Receipt,
  Banknote,
  Calendar,
  MapPin,
  Save,
  RotateCcw,
  Search,
  Download,
  Trash2,
  Edit2,
  FileCheck,
  Send,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { ClaimSubmission, TripLog, ReceiptScanResult } from '../types';
import { AIReceiptScanner } from './AIReceiptScanner';
import { SignaturePad } from './SignaturePad';

interface StringerDashboardProps {
  claim: ClaimSubmission;
  onUpdateClaim: (updated: ClaimSubmission) => void;
  onOpenPrintMemo: (claim: ClaimSubmission) => void;
  onShowSuccessToast: (msg: string) => void;
}

export const StringerDashboard: React.FC<StringerDashboardProps> = ({
  claim,
  onUpdateClaim,
  onOpenPrintMemo,
  onShowSuccessToast,
}) => {
  // New Trip form state
  const [date, setDate] = useState('2025-03-24');
  const [editorialAssignment, setEditorialAssignment] = useState(
    'Sidang Parlimen Dewan Rakyat - Bajet Tambahan'
  );
  const [route, setRoute] = useState(
    'Balai Berita NSTP Bangsar ↔ Bangunan Parlimen, KL'
  );
  const [distanceKm, setDistanceKm] = useState<number | ''>(48);
  const [tollRm, setTollRm] = useState<number | ''>(5.60);
  const [parkingRm, setParkingRm] = useState<number | ''>(10.00);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Signature state
  const [signatureData, setSignatureData] = useState<string>(claim.stringerSignature || '');
  const [declarationChecked, setDeclarationChecked] = useState<boolean>(
    claim.stringerDeclarationAccepted || false
  );

  const RATE_PER_KM = 0.35;
  const currentMileageAllowance =
    typeof distanceKm === 'number' && distanceKm > 0
      ? Number((distanceKm * RATE_PER_KM).toFixed(2))
      : 0;

  const handleApplyReceipt = (receipt: ReceiptScanResult) => {
    if (receipt.type === 'toll') {
      setTollRm(receipt.amount);
      if (!editorialAssignment || editorialAssignment.includes('Bajet')) {
        setRoute((prev) => (prev ? prev : 'Perjalanan Bertugas Lebuhraya'));
      }
    } else {
      setParkingRm(receipt.amount);
    }
    onShowSuccessToast(`Resit ${receipt.merchant} (RM ${receipt.amount.toFixed(2)}) berjaya dipadankan!`);
  };

  const handleResetForm = () => {
    setDate('2025-03-24');
    setEditorialAssignment('');
    setRoute('');
    setDistanceKm('');
    setTollRm('');
    setParkingRm('');
    setEditingTripId(null);
  };

  const handleSaveTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorialAssignment || !route || !distanceKm) {
      alert('Sila lengkapkan Acara Liputan, Laluan, dan Jarak (KM).');
      return;
    }

    const km = Number(distanceKm) || 0;
    const toll = Number(tollRm) || 0;
    const parking = Number(parkingRm) || 0;
    const mileage = Number((km * RATE_PER_KM).toFixed(2));
    const total = Number((mileage + toll + parking).toFixed(2));

    const formattedDate = new Date(date).toLocaleDateString('ms-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    let updatedTrips: TripLog[];

    if (editingTripId) {
      updatedTrips = claim.trips.map((t) =>
        t.id === editingTripId
          ? {
              ...t,
              date: formattedDate,
              editorialAssignment,
              route,
              distanceKm: km,
              mileageAllowance: mileage,
              tollRm: toll,
              parkingRm: parking,
              totalRm: total,
            }
          : t
      );
      onShowSuccessToast('Entri tugasan berjaya dikemaskini.');
    } else {
      const newTrip: TripLog = {
        id: `TRIP-${Date.now()}`,
        no: claim.trips.length + 1,
        date: formattedDate,
        editorialAssignment,
        route,
        distanceKm: km,
        mileageAllowance: mileage,
        tollRm: toll,
        parkingRm: parking,
        totalRm: total,
        receiptStatus: toll > 0 || parking > 0 ? 'Baru' : 'Disahkan',
      };
      updatedTrips = [...claim.trips, newTrip];
      onShowSuccessToast('Entri tugasan baharu berjaya ditambah ke senarai log.');
    }

    recalculateAndSave(updatedTrips);
    handleResetForm();
  };

  const handleDeleteTrip = (id: string) => {
    const updated = claim.trips
      .filter((t) => t.id !== id)
      .map((t, idx) => ({ ...t, no: idx + 1 }));
    recalculateAndSave(updated);
    onShowSuccessToast('Entri tugasan dipadamkan.');
  };

  const handleEditTrip = (trip: TripLog) => {
    setEditingTripId(trip.id);
    setEditorialAssignment(trip.editorialAssignment);
    setRoute(trip.route);
    setDistanceKm(trip.distanceKm);
    setTollRm(trip.tollRm);
    setParkingRm(trip.parkingRm);
  };

  const recalculateAndSave = (trips: TripLog[]) => {
    const totalKm = trips.reduce((sum, t) => sum + t.distanceKm, 0);
    const totalMileageRm = Number((totalKm * RATE_PER_KM).toFixed(2));
    const totalTollRm = Number(
      trips.reduce((sum, t) => sum + t.tollRm, 0).toFixed(2)
    );
    const totalParkingRm = Number(
      trips.reduce((sum, t) => sum + t.parkingRm, 0).toFixed(2)
    );
    const grandTotalRm = Number(
      (totalMileageRm + totalTollRm + totalParkingRm).toFixed(2)
    );

    const updatedClaim: ClaimSubmission = {
      ...claim,
      trips,
      totalKm,
      totalMileageRm,
      totalTollRm,
      totalParkingRm,
      grandTotalRm,
    };
    onUpdateClaim(updatedClaim);
  };

  const handleSubmitClaim = () => {
    if (!declarationChecked) {
      alert('Sila tandakan kotak perakuan integriti sebelum menghantar tuntutan.');
      return;
    }
    if (!signatureData) {
      alert('Sila tandatangan pada pad digital sebelum menghantar tuntutan.');
      return;
    }

    const updatedClaim: ClaimSubmission = {
      ...claim,
      status: 'Menunggu Kelulusan HOD',
      stringerSignature: signatureData,
      stringerDeclarationAccepted: true,
      stringerSignedAt: new Date().toLocaleString('ms-MY', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      auditHash: `SHA256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}e304f`,
    };

    onUpdateClaim(updatedClaim);
    onShowSuccessToast('Tuntutan bulanan berjaya diserahkan kepada Ketua Jabatan (HOD) Biro Putrajaya.');
  };

  const filteredTrips = claim.trips.filter(
    (t) =>
      t.editorialAssignment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Stringer Profile Header */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-[6px] bg-[#001026] text-white flex items-center justify-center font-bold text-lg ring-1 ring-slate-200">
              AF
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base font-extrabold text-[#0B2545] tracking-tight">
                  {claim.stringerName}
                </h1>
                <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-[4px] border border-slate-200">
                  ID: {claim.stringerId}
                </span>
                <span className="text-[11px] font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D] px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                  {claim.status === 'Menunggu Kelulusan HOD'
                    ? 'Dihantar - Menunggu Kelulusan HOD'
                    : 'Terbuka untuk Penyerahan'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {claim.biro}
                </span>
                <span>•</span>
                <span>Bulan Tuntutan: <strong className="text-slate-800">{claim.month}</strong></span>
                <span>•</span>
                <span>Tarikh Akhir Serahan: <strong className="text-[#C1121F]">{claim.deadlineDate}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Top Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintMemo(claim)}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-[4px] text-xs font-semibold shadow-2xs transition-colors"
              title="Semak PDF: Borang Rasmi Media Prima (2 Halaman)"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Semak PDF</span>
            </button>
            <button
              onClick={() => onShowSuccessToast('Draf tuntutan berjaya disimpan dalam sistem.')}
              className="inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white px-3.5 py-1.5 rounded-[4px] text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Draf</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1 */}
        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              Jumlah Jarak Liputan
            </span>
            <div className="w-7 h-7 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-700">
              <Car className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-[#0B2545] tracking-tight font-['Inter',sans-serif]">
              {claim.totalKm}
            </span>
            <span className="text-xs font-bold text-slate-500">KM</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            {claim.trips.length} Perjalanan Rasmi Dilogkan
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              Tuntutan Perbatuan
            </span>
            <div className="w-7 h-7 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-700">
              <Calculator className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">RM</span>
            <span className="text-2xl font-extrabold text-[#0B2545] tracking-tight font-['Inter',sans-serif]">
              {claim.totalMileageRm.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Kadar Piawai: <strong>RM 0.35</strong> bagi setiap KM
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              Resit Tol & Parkir
            </span>
            <div className="w-7 h-7 rounded-[4px] bg-slate-100 flex items-center justify-center text-slate-700">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">RM</span>
            <span className="text-2xl font-extrabold text-[#0B2545] tracking-tight font-['Inter',sans-serif]">
              {(claim.totalTollRm + claim.totalParkingRm).toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-600" />
            6 Resit Touch 'n Go Disahkan OCR
          </p>
        </div>

        {/* Card 4 (Highlighted Total) */}
        <div className="bg-[#001026] text-white border border-[#001026] rounded-[6px] p-3.5 shadow-[0_2px_4px_rgba(0,16,38,0.2)]">
          <div className="flex items-center justify-between text-slate-300 mb-1">
            <span className="text-[11px] font-bold tracking-wider uppercase">
              Jumlah Bersih Tuntutan
            </span>
            <div className="w-7 h-7 rounded-[4px] bg-white/10 flex items-center justify-center text-white">
              <Banknote className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-300">RM</span>
            <span className="text-2xl font-extrabold text-white tracking-tight font-['Inter',sans-serif]">
              {claim.grandTotalRm.toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Sedia untuk Pengesahan HOD
          </p>
        </div>
      </div>

      {/* Row: Add Daily Trip Form (Left) & AI Receipt Scanner (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Borang Tambah Log Tugasan Harian (F02) */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                F02
              </span>
              <div>
                <h3 className="text-xs font-bold text-[#0B2545] leading-tight">
                  Borang Tambah Log Tugasan Harian
                </h3>
                <p className="text-[11px] text-slate-500">
                  Daftar pergerakan tugasan liputan berita mengikut penetapan editorial
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-[4px] border border-slate-200">
              Piawaian Biro NSTP
            </span>
          </div>

          <form onSubmit={handleSaveTrip} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tarikh Tugasan <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#001026] bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Acara Liputan / Berita <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Cth: Sidang Parlimen Dewan Rakyat - Bajet Tambahan"
                  value={editorialAssignment}
                  onChange={(e) => setEditorialAssignment(e.target.value)}
                  required
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#001026] bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Laluan / Destinasi Perjalanan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Balai Berita NSTP Bangsar ↔ Bangunan Parlimen, KL"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  required
                  className="w-full text-xs pl-7 pr-2.5 py-1.5 border border-slate-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#001026] bg-white"
                />
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Nyatakan titik tolak dan lokasi liputan secara terperinci untuk audit kewangan.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Jarak Perjalanan (KM) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="48"
                    value={distanceKm}
                    onChange={(e) =>
                      setDistanceKm(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    required
                    className="w-full text-xs px-2.5 py-1.5 pr-8 border border-slate-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#001026] bg-white font-semibold"
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] font-bold text-slate-400">
                    KM
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Tol (RM)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.10"
                    placeholder="0.00"
                    value={tollRm}
                    onChange={(e) =>
                      setTollRm(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full text-xs px-2.5 py-1.5 pl-7 border border-slate-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#001026] bg-white font-semibold"
                  />
                  <span className="absolute left-2 top-1.5 text-[11px] font-bold text-slate-400">
                    RM
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Parkir (RM)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    placeholder="0.00"
                    value={parkingRm}
                    onChange={(e) =>
                      setParkingRm(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    className="w-full text-xs px-2.5 py-1.5 pl-7 border border-slate-300 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#001026] bg-white font-semibold"
                  />
                  <span className="absolute left-2 top-1.5 text-[11px] font-bold text-slate-400">
                    RM
                  </span>
                </div>
              </div>
            </div>

            {/* Auto Mileage calculation banner */}
            <div className="bg-[#EFF4FF] border border-[#CBDBF5] rounded-[4px] p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="font-bold text-[#0B2545] font-mono">Σ</span>
                <span className="font-semibold text-slate-800">
                  Kalkulator Automatik Elaun KM:
                </span>
                <span className="font-mono text-slate-600">
                  {typeof distanceKm === 'number' ? distanceKm : 0} KM × RM 0.35/KM
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block font-medium">
                  Kadar Dituntut
                </span>
                <span className="text-sm font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
                  RM {currentMileageAllowance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-[4px] hover:bg-slate-100 transition-colors"
              >
                Kosongkan Borang
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white text-xs font-semibold px-4 py-1.5 rounded-[4px] transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>
                  {editingTripId ? 'Kemaskini Entri Log' : 'Simpan & Tambah ke Senarai Log'}
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Pengimbas Resit AI (F03) */}
        <div className="lg:col-span-5">
          <AIReceiptScanner onApplyReceipt={handleApplyReceipt} />
        </div>
      </div>

      {/* Main Table: Senarai Log Perjalanan Liputan Berita (Bulan Mac 2025) */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] shadow-[0_1px_2px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold text-[#0B2545]">
              Senarai Log Perjalanan Liputan Berita (Bulan {claim.month})
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-[4px]">
              {claim.trips.length} Entri Aktif
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari tugasan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs pl-7 pr-2.5 py-1 border border-slate-300 rounded-[4px] focus:outline-none focus:ring-1 focus:ring-[#001026] w-48 bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1.5" />
            </div>
            <button
              onClick={() => onShowSuccessToast('Data log dimuat turun sebagai CSV.')}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-[4px] border border-slate-200 transition-colors"
              title="Eksport Log"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="px-3.5 pt-2 text-[11px] text-slate-500">
          Senarai lengkap perjalanan stringer yang telah direkodkan bagi tuntutan elaun dan pelupusan resit
        </p>

        {/* Table View */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-y border-slate-200 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-2.5 px-3 w-10 text-center">No.</th>
                <th className="py-2.5 px-3">Tarikh</th>
                <th className="py-2.5 px-3">Acara Liputan Editorial</th>
                <th className="py-2.5 px-3">Laluan / Destinasi</th>
                <th className="py-2.5 px-3 text-right">Jarak (KM)</th>
                <th className="py-2.5 px-3 text-right">Elaun KM (RM)</th>
                <th className="py-2.5 px-3 text-right">Tol (RM)</th>
                <th className="py-2.5 px-3 text-right">Parkir (RM)</th>
                <th className="py-2.5 px-3 text-center">Resit AI</th>
                <th className="py-2.5 px-3 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-['Inter',sans-serif]">
              {filteredTrips.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                    Tiada entri log perjalanan dijumpai.
                  </td>
                </tr>
              ) : (
                filteredTrips.map((trip) => (
                  <tr
                    key={trip.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-2.5 px-3 text-center text-slate-500 font-mono text-[11px]">
                      {trip.no}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">
                      {trip.date}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 max-w-[220px]">
                      {trip.editorialAssignment}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-[200px]">
                      {trip.route}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      {trip.distanceKm}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#0B2545]">
                      {trip.mileageAllowance.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {trip.tollRm > 0 ? trip.tollRm.toFixed(2) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {trip.parkingRm > 0 ? trip.parkingRm.toFixed(2) : '-'}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      {trip.receiptStatus === 'Disahkan' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          ✓ Disahkan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                          Baru
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditTrip(trip)}
                          className="p-1 text-slate-400 hover:text-sky-700 hover:bg-sky-50 rounded transition-colors"
                          title="Sunting Tugasan"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Padam Tugasan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {/* Subtotal Row */}
              <tr className="bg-[#EFF4FF] font-bold text-slate-900 border-t-2 border-[#CBD5E1]">
                <td colSpan={4} className="py-3 px-3 text-right uppercase text-[11px] tracking-wider text-[#0B2545]">
                  Jumlah Terkumpul {claim.month}:
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                  {claim.totalKm} KM
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                  RM {claim.totalMileageRm.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                  RM {claim.totalTollRm.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                  RM {claim.totalParkingRm.toFixed(2)}
                </td>
                <td colSpan={2} className="py-3 px-3 text-right font-black text-sm text-[#0B2545]">
                  RM {claim.grandTotalRm.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section: Perakuan Integriti & Pengesahan Tandatangan Digital (F04) */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-100">
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
            F04
          </span>
          <div>
            <h3 className="text-xs font-bold text-[#0B2545] leading-tight">
              Perakuan Integriti & Pengesahan Tandatangan Digital
            </h3>
            <p className="text-[11px] text-slate-500">
              Klausa pematuhan etika kewangan NSTP Media Prima Berhad
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Declaration Terms */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-3">
            <div className="bg-[#F8FAFC] border border-slate-200 rounded-[4px] p-3 text-xs leading-relaxed text-slate-700">
              <h4 className="font-bold text-[#0B2545] mb-1 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-slate-600" />
                Perisytiharan & Akuan Wartawan Sambilan (Stringer):
              </h4>
              <p className="italic text-slate-600 text-[11.5px]">
                "Saya, <strong>{claim.stringerName}</strong> (No. K/P: {claim.nric} / ID: {claim.stringerId}), dengan ini memperakui bahawa segala butiran perjalanan, jarak perbatuan (KM), serta resit perbelanjaan tol dan parkir yang dinyatakan di atas adalah benar, tepat, dan dilakukan semata-mata atas urusan tugasan liputan berita Berita Harian."
              </p>
              <p className="text-[10.5px] text-slate-500 mt-2">
                Sebarang tuntutan palsu tertakluk kepada tindakan tatatertib pemotongan elaun, penamatan serta-merta kontrak perkhidmatan Stringer, dan tindakan undang-undang di bawah Seksyen 18 Akta Suruhanjaya Pencegahan Rasuah Malaysia (SPRM) 2009.
              </p>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={declarationChecked}
                onChange={(e) => setDeclarationChecked(e.target.checked)}
                className="mt-0.5 rounded-[3px] border-slate-300 text-[#001026] focus:ring-[#001026] w-4 h-4"
              />
              <span className="font-medium leading-tight">
                Saya mengesahkan bahawa tiada sebarang unsur tuntutan bertindih dan saya bersedia menyerahkan resit fizikal asal sekiranya diminta oleh pihak Audit Dalaman Media Prima.
              </span>
            </label>

            <div className="text-[10px] text-slate-400 space-y-0.5 border-t border-slate-100 pt-2 font-mono">
              <div>Audit Hash: {claim.auditHash || 'SHA256:7b8d41e9c20a4b087f9104b9015c7e108849f2025e304f'}</div>
              <div>Cap Masa Sistem: 24 Mac 2025, 10:45:00 MYT • IP: 10.22.4.15</div>
            </div>
          </div>

          {/* Right: Signature Canvas & Submission */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-slate-200 rounded-[6px] p-3 flex flex-col justify-between">
            <SignaturePad
              signerName={claim.stringerName}
              initialSignature={signatureData}
              onSave={setSignatureData}
            />

            <div className="mt-3 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleSubmitClaim}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#001026] hover:bg-[#0B2545] text-white py-2 px-4 rounded-[4px] text-xs font-bold transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Hantar Tuntutan kepada Ketua Jabatan (HOD)</span>
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-1">
                Borang akan dikunci daripada sebarang suntingan selepas dihantar kepada HOD Biro Putrajaya.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Copyright */}
      <div className="pt-2 text-center text-[10.5px] text-slate-400">
        <p>© 2025 Sistem Pengurusan Editorial & Tuntutan Stringer. Hak Cipta Terpelihara The New Straits Times Press (Malaysia) Berhad / Media Prima.</p>
        <p>Kadar Perbatuan Berkuatkuasa: Surat Pekeliling Kewangan MPB Bil 02/2024 (RM0.35 bagi setiap kilometer jalan raya semenanjung).</p>
      </div>
    </div>
  );
};
