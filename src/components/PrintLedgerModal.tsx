import React from 'react';
import { ClaimSubmission } from '../types';
import { Printer, X, Download, FileSpreadsheet } from 'lucide-react';
import { NSTPBrandLogo } from './NSTPLogo';

interface PrintLedgerModalProps {
  onClose: () => void;
}

export const PrintLedgerModal: React.FC<PrintLedgerModalProps> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const ledgerRows = [
    {
      no: 1,
      dateReceived: '14/03/2025',
      stringerNo: 'STR-BH-2024-048',
      name: 'Ahmad Faiz bin Razali',
      nric: '890412-10-5541',
      biro: 'Putrajaya & Parlimen',
      month: 'Mac 2025',
      km: 1560,
      mileageRm: 546.00,
      tollParkingRm: 182.50,
      totalRm: 728.50,
      bankAccount: 'MBB 5122-8901-4412',
      remarks: 'Disahkan HOD Pn. Zaiton Ishak',
    },
    {
      no: 2,
      dateReceived: '15/03/2025',
      stringerNo: 'STR-BH-2024-071',
      name: 'Nurul Hanis binti Mohd Nor',
      nric: '930805-14-6122',
      biro: 'Putrajaya & Parlimen',
      month: 'Mac 2025',
      km: 1920,
      mileageRm: 672.00,
      tollParkingRm: 245.00,
      totalRm: 917.00,
      bankAccount: 'CIMB 8009-4412-9011',
      remarks: 'Disahkan HOD Pn. Zaiton Ishak',
    },
    {
      no: 3,
      dateReceived: '16/03/2025',
      stringerNo: 'STR-BH-2023-019',
      name: 'Muhammad Syafiq bin Kamaruddin',
      nric: '910219-08-5431',
      biro: 'Putrajaya / Mahkamah',
      month: 'Mac 2025',
      km: 800,
      mileageRm: 280.00,
      tollParkingRm: 850.90,
      totalRm: 1130.90,
      bankAccount: 'MBB 5141-2290-7711',
      remarks: 'Tugasan Mahkamah Profil Tinggi',
    },
    {
      no: 4,
      dateReceived: '18/03/2025',
      stringerNo: 'STR-PUTRA-088',
      name: 'Ahmad Ridzuan bin Halim',
      nric: '880112-10-6101',
      biro: 'Putrajaya & Parlimen',
      month: 'Mac 2025',
      km: 2410,
      mileageRm: 843.50,
      tollParkingRm: 142.00,
      totalRm: 985.50,
      bankAccount: 'MBB 1642-8901-3321',
      remarks: 'Liputan Sidang Parlimen',
    },
    {
      no: 5,
      dateReceived: '19/03/2025',
      stringerNo: 'STR-SGR-019',
      name: 'Kamarul Bahrin bin Othman',
      nric: '870321-10-5981',
      biro: 'Shah Alam & Klang',
      month: 'Mac 2025',
      km: 3120,
      mileageRm: 1092.00,
      tollParkingRm: 210.50,
      totalRm: 1302.50,
      bankAccount: 'MBB 1622-4412-9911',
      remarks: 'Isu Banjir Selangor',
    },
  ];

  const totalKm = ledgerRows.reduce((a, b) => a + b.km, 0);
  const totalMileage = ledgerRows.reduce((a, b) => a + b.mileageRm, 0);
  const totalToll = ledgerRows.reduce((a, b) => a + b.tollParkingRm, 0);
  const grandTotal = ledgerRows.reduce((a, b) => a + b.totalRm, 0);

  const handleExportCSV = () => {
    const headers = [
      'No',
      'Date Received',
      'Stringer Number',
      'Name',
      'NRIC',
      'Biro',
      'Month',
      'KM',
      'Mileage (RM)',
      'Toll/Parking (RM)',
      'Total (RM)',
      'Maybank Account',
      'Remarks',
    ];
    const rows = ledgerRows.map((r) => [
      r.no,
      r.dateReceived,
      r.stringerNo,
      `"${r.name}"`,
      r.nric,
      `"${r.biro}"`,
      r.month,
      r.km,
      r.mileageRm.toFixed(2),
      r.tollParkingRm.toFixed(2),
      r.totalRm.toFixed(2),
      r.bankAccount,
      `"${r.remarks}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'STRINGER_PRACTICAL_TRAINEE_CLAIMS_MAC_2025.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4 flex items-center justify-center print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-[8px] shadow-2xl max-w-6xl w-full my-8 overflow-hidden border border-slate-300 print:border-none print:shadow-none print:m-0 print:max-w-none">
        {/* Top Control Bar */}
        <div className="bg-[#001026] text-white p-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-400 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
              FORMAT F07
            </span>
            <span className="font-bold text-xs">
              Jadual Ringkasan Kewangan Berkelompok (Consolidated Finance Ledger - Format Landskap)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Eksport CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-white text-[#001026] hover:bg-slate-100 text-xs font-bold px-3 py-1.5 rounded transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Jadual Landskap</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Landscape Sheet */}
        <div className="p-8 print:p-4 bg-white text-[#0B1C30] font-['Plus_Jakarta_Sans',sans-serif] space-y-4">
          {/* Header - Only NSTP a media prima company logo */}
          <div className="border-b-2 border-[#0B2545] pb-4 flex items-center justify-between">
            <div className="flex items-center">
              <NSTPBrandLogo size="lg" />
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-[#0B2545]">Cost Center: 4120 (Editorial NSTP)</div>
              <div className="text-[10px] text-slate-500 font-mono">
                Batch No: BATCH-2025-03-STR • Tarikh Cetak: {new Date().toLocaleDateString('ms-MY')}
              </div>
            </div>
          </div>

          {/* Official Document Banner */}
          <div className="text-center py-2 bg-[#0B2545] text-white rounded-[2px]">
            <h2 className="text-xs sm:text-sm font-black tracking-wider uppercase">
              STRINGER / PRACTICAL TRAINEE CLAIMS PROCESS IN THE MONTH OF : MAC 2025
            </h2>
            <p className="text-[10px] text-slate-300 mt-0.5">
              Kadar Perbatuan Jalan Raya: RM0.35/KM (Pekeliling Kewangan MPB Bil 02/2024)
            </p>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs border border-slate-300">
              <thead>
                <tr className="bg-[#E5EEFF] border-b border-slate-300 text-[10px] uppercase font-extrabold text-[#0B2545]">
                  <th className="p-2 border-r border-slate-300 text-center w-8">No.</th>
                  <th className="p-2 border-r border-slate-300 whitespace-nowrap">Date Received</th>
                  <th className="p-2 border-r border-slate-300 whitespace-nowrap">Stringer Number</th>
                  <th className="p-2 border-r border-slate-300">Full Name</th>
                  <th className="p-2 border-r border-slate-300">Biro</th>
                  <th className="p-2 border-r border-slate-300 text-center">Month</th>
                  <th className="p-2 border-r border-slate-300 text-right">KM</th>
                  <th className="p-2 border-r border-slate-300 text-right">Mileage (RM)</th>
                  <th className="p-2 border-r border-slate-300 text-right">Toll/Parking (RM)</th>
                  <th className="p-2 border-r border-slate-300 text-right font-black">Total (RM)</th>
                  <th className="p-2 border-r border-slate-300">EFT Bank Account</th>
                  <th className="p-2">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-['Inter',sans-serif] text-[11px]">
                {ledgerRows.map((r) => (
                  <tr key={r.no} className="hover:bg-slate-50">
                    <td className="p-1.5 border-r border-slate-200 text-center text-slate-500 font-mono">
                      {r.no}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 font-mono text-[10px]">
                      {r.dateReceived}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 font-mono font-bold text-[#0B2545]">
                      {r.stringerNo}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 font-semibold text-slate-900">
                      {r.name}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 text-slate-700">
                      {r.biro}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 text-center text-slate-600">
                      {r.month}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 text-right font-bold">
                      {r.km.toLocaleString()}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 text-right">
                      {r.mileageRm.toFixed(2)}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 text-right">
                      {r.tollParkingRm.toFixed(2)}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 text-right font-extrabold text-[#0B2545]">
                      {r.totalRm.toFixed(2)}
                    </td>
                    <td className="p-1.5 border-r border-slate-200 font-mono text-[10px]">
                      {r.bankAccount}
                    </td>
                    <td className="p-1.5 text-slate-600 text-[10px]">
                      {r.remarks}
                    </td>
                  </tr>
                ))}

                {/* Subtotal Row */}
                <tr className="bg-[#F8FAFC] font-black border-t-2 border-slate-400 text-xs">
                  <td colSpan={6} className="p-2 text-right uppercase text-[#0B2545]">
                    Grand Total (Kelompok Selesai Semakan):
                  </td>
                  <td className="p-2 text-right border-r border-slate-300">
                    {totalKm.toLocaleString()} KM
                  </td>
                  <td className="p-2 text-right border-r border-slate-300">
                    RM {totalMileage.toFixed(2)}
                  </td>
                  <td className="p-2 text-right border-r border-slate-300">
                    RM {totalToll.toFixed(2)}
                  </td>
                  <td className="p-2 text-right font-black text-sm text-[#0B2545] border-r border-slate-300">
                    RM {grandTotal.toFixed(2)}
                  </td>
                  <td colSpan={2} className="p-2 text-[10px] text-emerald-700 font-bold">
                    ✓ Disemak 100% Pematuhan Audit
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Triple Authorization Signatures */}
          <div className="grid grid-cols-3 gap-6 pt-4 border-t-2 border-slate-300 text-xs">
            <div className="border border-slate-300 rounded p-3 bg-white">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Disediakan Oleh (HR Editorial):
              </span>
              <div className="h-12 border-b border-dashed border-slate-200 flex items-center justify-center font-serif italic text-slate-700">
                Zulkifli Hassan
              </div>
              <div className="mt-2">
                <div className="font-bold text-slate-900">Zulkifli Hassan</div>
                <div className="text-[10px] text-slate-500">Eksekutif Kanan Pentadbiran HR</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Tarikh: 25 Mac 2025</div>
              </div>
            </div>

            <div className="border border-slate-300 rounded p-3 bg-white">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Disahkan Oleh (Ketua Jabatan / HOD):
              </span>
              <div className="h-12 border-b border-dashed border-slate-200 flex items-center justify-center font-serif italic text-slate-700">
                Puan Zaiton Ishak
              </div>
              <div className="mt-2">
                <div className="font-bold text-slate-900">Puan Zaiton Ishak</div>
                <div className="text-[10px] text-slate-500">Pengarang Berita Kanan / Ketua Biro</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Tarikh: 25 Mac 2025</div>
              </div>
            </div>

            <div className="border border-slate-300 rounded p-3 bg-white">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Diluluskan Bayaran (Kewangan MPB):
              </span>
              <div className="h-12 border-b border-dashed border-slate-200 flex items-center justify-center font-serif italic text-slate-700">
                Puan Maznah binti Ariffin
              </div>
              <div className="mt-2">
                <div className="font-bold text-slate-900">Puan Maznah binti Ariffin</div>
                <div className="text-[10px] text-slate-500">Pengurus Kanan Akaun & Kewangan NSTP</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Tarikh: 28 Mac 2025</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
