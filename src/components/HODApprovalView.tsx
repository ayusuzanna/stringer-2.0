import React, { useState } from 'react';
import {
  FileText,
  Users,
  CheckCircle,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  Printer,
} from 'lucide-react';
import { ClaimSubmission } from '../types';

interface HODApprovalViewProps {
  claims: ClaimSubmission[];
  onApproveClaim: (claimId: string, remarks?: string) => void;
  onRejectClaim: (claimId: string, reason: string) => void;
  onBatchApprove: () => void;
  onOpenPrintMemo: (claim: ClaimSubmission) => void;
  onShowSuccessToast: (msg: string) => void;
}

export const HODApprovalView: React.FC<HODApprovalViewProps> = ({
  claims,
  onApproveClaim,
  onRejectClaim,
  onBatchApprove,
  onOpenPrintMemo,
  onShowSuccessToast,
}) => {
  const [selectedClaimId, setSelectedClaimId] = useState<string>('STR-BH-2024-048');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const selectedClaim = claims.find((c) => c.id === selectedClaimId) || claims[0];

  const pendingClaims = claims.filter((c) => c.status === 'Menunggu Kelulusan HOD');
  const approvedClaims = claims.filter((c) => c.status === 'Disahkan HOD' || c.status === 'Sedia Untuk Kewangan');

  const filteredClaims = claims.filter((c) => {
    if (statusFilter === 'pending') return c.status === 'Menunggu Kelulusan HOD';
    if (statusFilter === 'approved') return c.status === 'Disahkan HOD' || c.status === 'Sedia Untuk Kewangan';
    return true;
  });

  const totalPendingValue = pendingClaims.reduce((acc, c) => acc + c.grandTotalRm, 0);
  const totalPendingKm = pendingClaims.reduce((acc, c) => acc + c.totalKm, 0);

  const handleApprove = () => {
    if (!selectedClaim) return;
    onApproveClaim(selectedClaim.id);
    onShowSuccessToast(`Tuntutan ${selectedClaim.stringerName} (${selectedClaim.id}) berjaya diluluskan dan dimajukan ke Sumber Manusia.`);
  };

  const handleConfirmReject = () => {
    if (!rejectReason) {
      alert('Sila nyatakan sebab penolakan atau nota semakan.');
      return;
    }
    if (selectedClaim) {
      onRejectClaim(selectedClaim.id, rejectReason);
      setShowRejectModal(false);
      setRejectReason('');
      onShowSuccessToast(`Tuntutan ${selectedClaim.id} dikembalikan kepada Stringer untuk pembetulan.`);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[4px] bg-[#E5EEFF] text-[#001026] flex items-center justify-center shrink-0 mt-0.5">
              <FileCheck2 className="w-5 h-5 text-[#0B2545]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider bg-[#001026] text-white px-2 py-0.5 rounded-[3px] uppercase">
                  Modul Ketua Jabatan (HOD)
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Sesi Aktif: Mac 2025
                </span>
              </div>
              <h1 className="text-base font-extrabold text-[#0B2545] tracking-tight mt-1">
                Semakan & Kelulusan Tuntutan Editorial
              </h1>
              <p className="text-xs text-slate-600">
                Sahkan jarak kilometer liputan berita dan resit perbelanjaan bertugas stringer biro sebelum dihantar ke Sumber Manusia.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              onBatchApprove();
              onShowSuccessToast('Semua tuntutan menunggu kelulusan telah disahkan secara berkelompok.');
            }}
            className="inline-flex items-center gap-2 bg-[#001026] hover:bg-[#0B2545] text-white px-3.5 py-2 rounded-[4px] text-xs font-bold transition-colors shadow-xs shrink-0 self-start md:self-auto"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kelulusan Kelompok HOD</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Tuntutan Menunggu Perakuan
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              {pendingClaims.length} Fail
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Biro Putrajaya & Shah Alam
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Jumlah Nilai Menunggu
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">RM</span>
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              {totalPendingValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {totalPendingKm.toLocaleString()} KM Perjalanan Wartawan
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Purata Masa Kelulusan HOD
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-extrabold text-[#0B2545] font-['Inter',sans-serif]">
              1.2 Hari
            </span>
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <span>↑</span> Lebih cepat 48% berbanding SOP lama
          </p>
        </div>
      </div>

      {/* HOD Queue Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-[6px] shadow-[0_1px_2px_rgba(15,23,42,0.05)] overflow-hidden">
        <div className="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-[#0B2545]">
              Senarai Menunggu Semakan Ketua Jabatan (HOD Queue)
            </h3>
            <p className="text-[11px] text-slate-500">
              Sila teliti jarak KM dan resit sebelum menurunkan cop digital perakuan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Tapis Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="text-xs bg-white border border-slate-300 rounded-[4px] px-2.5 py-1 focus:ring-1 focus:ring-[#001026] text-slate-800"
            >
              <option value="all">Semua ({claims.length})</option>
              <option value="pending">Menunggu HOD ({pendingClaims.length})</option>
              <option value="approved">Telah Disahkan ({approvedClaims.length})</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-y border-slate-200 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-2.5 px-3">No. Rujukan / Stringer</th>
                <th className="py-2.5 px-3">Biro Liputan</th>
                <th className="py-2.5 px-3">Bulan</th>
                <th className="py-2.5 px-3 text-right">Jumlah Jarak (KM)</th>
                <th className="py-2.5 px-3 text-right">Tol / Parkir</th>
                <th className="py-2.5 px-3 text-right">Jumlah Tuntutan</th>
                <th className="py-2.5 px-3 text-center">Status Aliran</th>
                <th className="py-2.5 px-3 text-center">Semakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-['Inter',sans-serif]">
              {filteredClaims.map((c) => {
                const isSelected = selectedClaim?.id === c.id;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedClaimId(c.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#EFF4FF] border-l-4 border-l-[#001026]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{c.stringerName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{c.id}</div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {c.biro}
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {c.month}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-800">
                      {c.totalKm.toLocaleString()} KM
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700">
                      RM {(c.totalTollRm + c.totalParkingRm).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-[#0B2545]">
                      RM {c.grandTotalRm.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {c.status === 'Menunggu Kelulusan HOD' ? (
                        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#B45309] bg-[#FEF3C7] border border-[#FCD34D] px-2 py-0.5 rounded-[4px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B45309]" />
                          Menunggu Kelulusan HOD
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold text-[#0369A1] bg-[#E0F2FE] border border-[#7DD3FC] px-2 py-0.5 rounded-[4px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0369A1]" />
                          Disahkan HOD
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {c.status === 'Menunggu Kelulusan HOD' ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClaimId(c.id);
                          }}
                          className="bg-[#001026] hover:bg-[#0B2545] text-white px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-colors shadow-2xs"
                        >
                          Semak & Lulus
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenPrintMemo(c);
                          }}
                          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-2.5 py-1 rounded-[4px] text-[11px] font-bold transition-colors shadow-2xs"
                        >
                          Semak PDF
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Claim Review Panel (MODUL PERAKUAN RASMI HOD - F05) */}
      {selectedClaim && (
        <div className="bg-white border-2 border-slate-300 rounded-[6px] p-4 shadow-[0_2px_4px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-200 gap-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                Modul Perakuan Rasmi HOD (F05)
              </span>
              <h3 className="text-sm font-extrabold text-[#0B2545] mt-1">
                Pemeriksaan Fail: {selectedClaim.stringerName} ({selectedClaim.id})
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-500 font-medium">
                Jumlah Keseluruhan Perakuan:
              </span>
              <div className="text-xl font-black text-[#0B2545] font-['Inter',sans-serif]">
                RM {selectedClaim.grandTotalRm.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Detailed Breakdown & Integrity Check */}
            <div className="lg:col-span-6 space-y-3">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-[4px] p-3 text-xs">
                <h4 className="font-bold text-slate-800 mb-2">
                  Ringkasan Tugasan Liputan Terperinci:
                </h4>
                <ul className="space-y-1.5 text-slate-700 text-[11.5px]">
                  {selectedClaim.trips.length > 0 ? (
                    selectedClaim.trips.slice(0, 5).map((t) => (
                      <li key={t.id} className="flex items-start justify-between gap-2 border-b border-slate-100 pb-1">
                        <span>• {t.editorialAssignment} ({t.date.split(' ')[0]}):</span>
                        <span className="font-semibold text-slate-900 shrink-0 font-mono">
                          {t.distanceKm} KM • RM {t.mileageAllowance.toFixed(2)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex justify-between">
                        <span>• Liputan Sidang Dewan Rakyat (02/03):</span>
                        <span className="font-semibold">72 KM • RM 25.20</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Sidang Media Belanjawan MOF (05/03):</span>
                        <span className="font-semibold">18 KM • RM 6.30</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Lawatan Kerja PM ke MAEPS (08/03):</span>
                        <span className="font-semibold">54 KM • RM 18.90</span>
                      </li>
                      <li className="flex justify-between">
                        <span>• Siasatan Lapangan Dengkil (13/03):</span>
                        <span className="font-semibold">112 KM • RM 39.20</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Digital Integrity Card */}
              <div className="bg-[#EFF4FF] border border-[#CBD5E1] rounded-[4px] p-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#0B2545] mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Pengesahan Integriti Digital</span>
                </div>
                <p className="text-slate-600 text-[11.5px] leading-relaxed">
                  Tandatangan Stringer sah (IP: {selectedClaim.ipAddress || '10.22.4.15'}). Semua {selectedClaim.trips.length || 6} imbasan resit Touch 'n Go & Parkir sepadan tarikh berita.
                </p>
              </div>
            </div>

            {/* Right: HOD Signature & Stamp Card */}
            <div className="lg:col-span-6 bg-[#F8FAFC] border border-slate-200 rounded-[6px] p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <FileCheck2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Kad Tandatangan & Cop Digital HOD</span>
                  </div>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded">
                    Media Prima Auth
                  </span>
                </div>

                <p className="text-xs text-slate-600 italic mb-2.5">
                  "Saya mengesahkan bahawa tugasan liputan berita di atas adalah benar dan dilaksanakan atas arahan Meja Berita."
                </p>

                <div className="bg-white border border-slate-200 rounded-[4px] p-2.5 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">
                    Puan Zaiton Ishak (ID: EMP-MP-8831)
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Pengarang Berita Kanan / Ketua Biro Putrajaya
                  </div>
                  <div className="pt-1.5 border-t border-slate-100 font-mono text-[10.5px] text-sky-800 font-bold">
                    Tandatangan Digital: ••• ZAITON_ISHAK_EDITORIAL_SEAL_VERIFIED •••
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Masa: 15 Mac 2025, 11:20 AM MYT • Sijil Sah
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 mt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(true)}
                  className="bg-white border border-[#BA081B] text-[#BA081B] hover:bg-red-50 text-xs font-bold px-3 py-2 rounded-[4px] transition-colors"
                >
                  Tolak / Minta Semakan
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  className="inline-flex items-center gap-1.5 bg-[#001026] hover:bg-[#0B2545] text-white text-xs font-bold px-4 py-2 rounded-[4px] transition-colors shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Luluskan & Hantar ke HR</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[8px] max-w-md w-full p-5 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-[#0B2545] mb-2">
              Kembalikan Tuntutan untuk Pembetulan
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Nyatakan catatan pembetulan untuk stringer (contoh: lampiran resit kabur, laluan tidak jelas).
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Sila muat naik semula resit parkir MAEPS yang bertarikh 08/03..."
              rows={3}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-[4px] focus:ring-1 focus:ring-[#001026] mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="text-xs px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="text-xs px-4 py-1.5 bg-[#BA081B] text-white font-bold rounded hover:bg-red-700"
              >
                Hantar Arahan Pembetulan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
