import React, { useState } from 'react';
import { ClaimSubmission } from '../types';
import { Printer, X, FileText, CheckCircle2, ChevronRight, Eye } from 'lucide-react';

interface PrintMemoModalProps {
  claim: ClaimSubmission;
  onClose: () => void;
}

// Convert amount in RM to Malay words
function numberToMalayWords(amount: number): string {
  const units = ['', 'SATU', 'DUA', 'TIGA', 'EMPAT', 'LIMA', 'ENAM', 'TUJUH', 'LAPAN', 'SEMBILAN'];
  const teens = [
    'SEPULUH',
    'SEBELAS',
    'DUA BELAS',
    'TIGA BELAS',
    'EMPAT BELAS',
    'LIMA BELAS',
    'ENAM BELAS',
    'TUJUH BELAS',
    'LAPAN BELAS',
    'SEMBILAN BELAS',
  ];
  const tens = [
    '',
    'SEPULUH',
    'DUA PULUH',
    'TIGA PULUH',
    'EMPAT PULUH',
    'LIMA PULUH',
    'ENAM PULUH',
    'TUJUH PULUH',
    'LAPAN PULUH',
    'SEMBILAN PULUH',
  ];

  function convertHundreds(n: number): string {
    let str = '';
    if (n >= 100) {
      if (Math.floor(n / 100) === 1) {
        str += 'SERATUS ';
      } else {
        str += units[Math.floor(n / 100)] + ' RATUS ';
      }
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    } else if (n >= 10) {
      str += teens[n - 10] + ' ';
      n = 0;
    }
    if (n > 0) {
      str += units[n] + ' ';
    }
    return str.trim();
  }

  const ringgit = Math.floor(amount);
  const sen = Math.round((amount - ringgit) * 100);

  let result = '';
  if (ringgit === 0) {
    result = 'KOSONG';
  } else {
    const thousands = Math.floor(ringgit / 1000);
    const remainder = ringgit % 1000;
    if (thousands > 0) {
      if (thousands === 1) {
        result += 'SERIBU ';
      } else {
        result += convertHundreds(thousands) + ' RIBU ';
      }
    }
    if (remainder > 0) {
      result += convertHundreds(remainder);
    }
  }

  result = 'RINGGIT MALAYSIA ' + result.trim();
  if (sen > 0) {
    result += ' DAN ' + convertHundreds(sen) + ' SEN';
  }
  result += ' SAHAJA';
  return result.replace(/\s+/g, ' ');
}

// Official Media Prima Logo
const MediaPrimaLogo: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => (
  <div className="inline-flex items-center gap-1.5 select-none">
    <div
      className={`bg-[#ED1C24] text-white font-extrabold tracking-tighter leading-none flex items-center justify-center ${
        size === 'md' ? 'px-2 py-1 text-sm' : 'px-1.5 py-0.5 text-xs'
      }`}
    >
      media
    </div>
    <span
      className={`font-black text-black tracking-tighter leading-none ${
        size === 'md' ? 'text-sm' : 'text-xs'
      }`}
    >
      prima
    </span>
  </div>
);

export const PrintMemoModal: React.FC<PrintMemoModalProps> = ({ claim, onClose }) => {
  // 'both' = prints both forms (2 pages), 'form1' = landscape details, 'form2' = portrait hr benefits
  const [activeTab, setActiveTab] = useState<'both' | 'form1' | 'form2'>('both');

  const handlePrint = () => {
    window.print();
  };

  // Pad trips to at least 10 rows like the paper form
  const paddedTrips = [...claim.trips];
  while (paddedTrips.length < 10) {
    paddedTrips.push({
      id: `empty-${paddedTrips.length}`,
      no: paddedTrips.length + 1,
      date: '',
      editorialAssignment: '',
      route: '',
      distanceKm: 0,
      mileageAllowance: 0,
      tollRm: 0,
      parkingRm: 0,
      totalRm: 0,
      receiptStatus: 'Tiada Resit',
    });
  }

  // Segmented voucher reference boxes for Form 2
  const voucherCode = (claim.voucherNo || `CLM-${claim.id.slice(-4)}`).replace(/[^a-zA-Z0-9]/g, '');
  const voucherBoxes = (voucherCode.padEnd(8, ' ')).slice(0, 8).split('');

  return (
    <div className="fixed inset-0 z-50 bg-black/75 overflow-y-auto p-2 sm:p-4 flex items-center justify-center print:p-0 print:bg-white print:static print:overflow-visible">
      {/* Print Styles Injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-area, #printable-area * {
                visibility: visible;
              }
              #printable-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white !important;
                color: black !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              .no-print {
                display: none !important;
              }
              .page-break-after {
                page-break-after: always !important;
                break-after: page !important;
              }
            }
          `,
        }}
      />

      {/* Outer Container */}
      <div className="bg-white rounded-[6px] shadow-2xl max-w-6xl w-full my-6 overflow-hidden border border-slate-300 print:border-none print:shadow-none print:m-0 print:max-w-none">
        {/* Top Control Bar (Hidden in Print) */}
        <div className="bg-[#001026] text-white p-3.5 flex flex-wrap items-center justify-between gap-3 no-print border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-600 rounded text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs tracking-wide">
                  Semak PDF & Borang Rasmi Media Prima
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-400/30">
                  Format 2 Halaman Rasmi
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Pilih format cetakan atau cetak kedua-dua borang (Borang 1 & Borang 2)
              </p>
            </div>
          </div>

          {/* Form Switcher Tabs */}
          <div className="flex items-center bg-slate-900/80 p-0.5 rounded-[4px] border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3 py-1 font-bold rounded transition-colors ${
                activeTab === 'both'
                  ? 'bg-amber-400 text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Cetak Lengkap (2 Halaman)
            </button>
            <button
              onClick={() => setActiveTab('form1')}
              className={`px-3 py-1 font-bold rounded transition-colors ${
                activeTab === 'form1'
                  ? 'bg-amber-400 text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Borang 1: Perbatuan (Landscape)
            </button>
            <button
              onClick={() => setActiveTab('form2')}
              className={`px-3 py-1 font-bold rounded transition-colors ${
                activeTab === 'form2'
                  ? 'bg-amber-400 text-slate-900 shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Borang 2: Faedah HR (Portrait)
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#ED1C24] hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Dokumen Rasmi</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Viewer Area */}
        <div id="printable-area" className="p-4 sm:p-8 bg-[#525659] print:bg-white print:p-0 space-y-6">
          {/* ========================================================================= */}
          {/* FORM 1: MILEAGE, SUBSISTENCE, TOLL, PARKING & TAXI CLAIM FORM (Landscape) */}
          {/* ========================================================================= */}
          {(activeTab === 'both' || activeTab === 'form1') && (
            <div className={`bg-white text-black p-6 sm:p-8 shadow-md border border-slate-300 mx-auto max-w-[1080px] font-sans ${activeTab === 'both' ? 'page-break-after mb-8' : ''}`}>
              {/* Header: Logo and Title */}
              <div className="flex items-start justify-between">
                <MediaPrimaLogo size="md" />
                <div className="text-right">
                  <h1 className="font-black text-sm sm:text-base italic uppercase tracking-tight font-sans text-black">
                    MILEAGE, SUBSISTENCE, TOLL, PARKING & TAXI CLAIM FORM
                  </h1>
                </div>
              </div>

              {/* Rates Box */}
              <div className="border border-black p-1 text-[11px] leading-tight my-2">
                <div className="font-bold underline mb-0.5">RATES</div>
                <div className="flex items-center gap-8 pl-4">
                  <div>
                    Car : RM <span className="font-bold border-b border-black px-2">0.35</span> per km
                  </div>
                  <div>
                    Motorcycle : RM <span className="font-bold border-b border-black px-2">0.25</span> per km
                  </div>
                </div>
              </div>

              {/* Section A. PERSONAL PARTICULARS */}
              <div className="mt-2">
                <div className="bg-[#FFFF00] border-t border-x border-black px-2 py-0.5 font-bold text-xs">
                  A. PERSONAL PARTICULARS
                </div>
                <table className="w-full border-collapse border border-black text-[11px]">
                  <tbody>
                    <tr>
                      <td className="border border-black p-1 font-bold w-[14%] bg-white">NAME</td>
                      <td className="border border-black p-1 uppercase font-semibold w-[36%]">
                        {claim.stringerName}
                      </td>
                      <td className="border border-black p-1 font-bold w-[18%] bg-white">DEPARTMENT</td>
                      <td className="border border-black p-1 w-[32%]">{claim.biro}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 font-bold bg-white">STAFF NO.</td>
                      <td className="border border-black p-1 font-mono font-medium">
                        {claim.nric || 'STR-BH-048'}
                      </td>
                      <td className="border border-black p-1 font-bold bg-white">TYPE OF VEHICLE</td>
                      <td className="border border-black p-1">Kereta (Car)</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 font-bold bg-white">DESIGNATION</td>
                      <td className="border border-black p-1">Wartawan Sambilan (Stringer)</td>
                      <td className="border border-black p-1 font-bold bg-white">REGISTRATION NO.</td>
                      <td className="border border-black p-1 font-mono font-bold">VBN 4821</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section B. DETAILS OF CLAIM (MILEAGE) */}
              <div className="mt-2">
                <table className="w-full border-collapse border border-black text-[10px]">
                  <thead>
                    {/* Top yellow category row */}
                    <tr className="bg-[#FFFF00]">
                      <th
                        colSpan={8}
                        className="border border-black p-1 text-left font-bold text-xs"
                      >
                        B. DETAILS OF CLAIM (MILEAGE)
                      </th>
                      <th
                        colSpan={3}
                        className="border border-black p-1 text-center font-bold italic text-[11px]"
                      >
                        Details of Parking / Toll / Subsistence
                      </th>
                    </tr>
                    {/* Column Headers */}
                    <tr className="bg-white text-center font-bold">
                      <th className="border border-black p-1 w-[8%]">DATE</th>
                      <th className="border border-black p-1 w-[26%] text-left pl-1.5">PURPOSE</th>
                      <th className="border border-black p-1 w-[15%] text-left pl-1.5">FROM</th>
                      <th className="border border-black p-1 w-[6%]">TIME OF LEAVING</th>
                      <th className="border border-black p-1 w-[15%] text-left pl-1.5">TO</th>
                      <th className="border border-black p-1 w-[6%]">TIME OF ARRIVAL (Ofc)</th>
                      <th className="border border-black p-1 w-[5%]">DIST. (KM)</th>
                      <th className="border border-black p-1 w-[6%]">AMOUNT (RM)</th>
                      <th className="border border-black p-1 w-[5%]">PARKING (RM)</th>
                      <th className="border border-black p-1 w-[5%]">TOLL (RM)</th>
                      <th className="border border-black p-1 w-[5%]">SUBSISTENCE (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paddedTrips.map((t, idx) => {
                      const fromLoc = t.route ? (t.route.split('↔')[0] || t.route.split('<->')[0] || t.route).trim() : '';
                      const toLoc = t.route && t.route.includes('↔') ? t.route.split('↔')[1].trim() : (t.route.includes('<->') ? t.route.split('<->')[1].trim() : '');

                      return (
                        <tr key={t.id || idx} className="h-5">
                          <td className="border border-black px-1 text-center whitespace-nowrap">
                            {t.date}
                          </td>
                          <td className="border border-black px-1.5 truncate max-w-[200px]">
                            {t.editorialAssignment}
                          </td>
                          <td className="border border-black px-1.5 truncate max-w-[120px]">
                            {fromLoc}
                          </td>
                          <td className="border border-black px-1 text-center">
                            {t.date ? '09:00 AM' : ''}
                          </td>
                          <td className="border border-black px-1.5 truncate max-w-[120px]">
                            {toLoc || fromLoc}
                          </td>
                          <td className="border border-black px-1 text-center">
                            {t.date ? '01:30 PM' : ''}
                          </td>
                          <td className="border border-black px-1 text-center font-semibold">
                            {t.distanceKm > 0 ? t.distanceKm : ''}
                          </td>
                          <td className="border border-black px-1 text-right font-medium">
                            {t.mileageAllowance > 0 ? t.mileageAllowance.toFixed(2) : ''}
                          </td>
                          <td className="border border-black px-1 text-right">
                            {t.parkingRm > 0 ? t.parkingRm.toFixed(2) : ''}
                          </td>
                          <td className="border border-black px-1 text-right">
                            {t.tollRm > 0 ? t.tollRm.toFixed(2) : ''}
                          </td>
                          <td className="border border-black px-1 text-right">
                            {t.date ? '-' : ''}
                          </td>
                        </tr>
                      );
                    })}

                    {/* TOTAL Row */}
                    <tr className="font-bold bg-white h-6">
                      <td colSpan={6} className="border border-black px-2 text-center text-xs">
                        TOTAL
                      </td>
                      <td className="border border-black px-1 text-center text-xs">
                        {claim.totalKm}
                      </td>
                      <td className="border border-black px-1 text-right text-xs">
                        {claim.totalMileageRm.toFixed(2)}
                      </td>
                      <td className="border border-black px-1 text-right text-xs">
                        {claim.totalParkingRm.toFixed(2)}
                      </td>
                      <td className="border border-black px-1 text-right text-xs">
                        {claim.totalTollRm.toFixed(2)}
                      </td>
                      <td className="border border-black px-1 text-right text-xs">0.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Signatures Box */}
              <div className="mt-2 grid grid-cols-3 border border-black text-[11px]">
                {/* Requested By */}
                <div className="border-r border-black flex flex-col justify-between">
                  <div className="bg-[#FFFF00] border-b border-black text-center font-bold py-0.5">
                    REQUESTED BY
                  </div>
                  <div className="h-16 flex items-center justify-center p-1">
                    {claim.stringerSignature ? (
                      <img
                        src={claim.stringerSignature}
                        alt="Tandatangan Stringer"
                        className="max-h-14 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        [Ditandatangani secara digital]
                      </span>
                    )}
                  </div>
                  <div className="border-t border-black p-1 space-y-0.5">
                    <div>
                      NAME : <span className="font-bold">{claim.stringerName}</span>
                    </div>
                    <div>
                      DATE :{' '}
                      <span className="font-mono">
                        {claim.stringerSignedAt?.split('T')[0] || claim.submissionDate || '31/03/2025'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Approved By */}
                <div className="border-r border-black flex flex-col justify-between">
                  <div className="bg-[#FFFF00] border-b border-black text-center font-bold py-0.5">
                    APPROVED BY
                  </div>
                  <div className="h-16 flex flex-col items-center justify-center p-1 text-center">
                    <div className="text-[9px] font-bold text-sky-900 bg-sky-50 px-2 py-0.5 border border-sky-300 rounded font-mono">
                      ••• {claim.hodSeal || 'ZAITON_ISHAK_EDITORIAL_SEAL_VERIFIED'} •••
                    </div>
                    <div className="text-[8.5px] text-emerald-700 font-bold mt-0.5">
                      ✓ Diluluskan Ketua Jabatan (HOD)
                    </div>
                  </div>
                  <div className="border-t border-black p-1 space-y-0.5">
                    <div>
                      NAME :{' '}
                      <span className="font-bold">
                        {claim.hodApproverName || 'Puan Zaiton Ishak'}
                      </span>
                    </div>
                    <div>
                      DATE :{' '}
                      <span className="font-mono">
                        {claim.hodSignedAt?.split('T')[0] || '31/03/2025'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verified By (GHR Use) */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="text-center italic font-bold text-[10px] bg-white border-b border-black">
                      (For GHR Use)
                    </div>
                    <div className="bg-[#FFFF00] border-b border-black text-center font-bold py-0.5">
                      VERIFIED BY
                    </div>
                  </div>
                  <div className="h-14 flex flex-col items-center justify-center p-1 text-center">
                    <div className="text-[9px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 border border-slate-300 rounded">
                      HR-VERIFIED-VOUCHER
                    </div>
                    <div className="text-[8px] text-slate-500 mt-0.5">
                      Voucher: {claim.voucherNo || 'VCHR-2025-0391'}
                    </div>
                  </div>
                  <div className="border-t border-black p-1 space-y-0.5">
                    <div>
                      NAME :{' '}
                      <span className="font-bold">
                        {claim.hrReviewerName || 'Encik Zulkifli Hassan'}
                      </span>
                    </div>
                    <div>
                      DATE :{' '}
                      <span className="font-mono">
                        {claim.hrReviewedAt?.split('T')[0] || '31/03/2025'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Document Code */}
              <div className="mt-2 text-[9px] leading-tight">
                <div className="flex items-start gap-1">
                  <span className="font-bold">NOTES :</span>
                  <span>
                    1. ALL MILEAGE CLAIMS SHOULD BE SUBMITTED TO IMMEDIATE SUPERIORS BY 1
                    <sup>ST</sup> WEEK OF THE FOLLOWING MONTH. THE APPROVED FORMS SHOULD REACH
                    FINANCE DEPARTMENT BY 10<sup>TH</sup> OF THE FOLLOWING MONTH.
                  </span>
                </div>
                <div className="mt-1 font-mono text-[8.5px] text-slate-700">
                  OPERATIONS & METHODS/MTCF.DOC/1-96
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* FORM 2: FINANCE DEPARTMENT CLAIM FORM - HR BENEFIT (Portrait)             */}
          {/* ========================================================================= */}
          {(activeTab === 'both' || activeTab === 'form2') && (
            <div className="bg-white text-black p-6 sm:p-8 shadow-md border border-slate-300 mx-auto max-w-[840px] font-sans">
              {/* Header: Logo and Title */}
              <div className="flex items-start justify-between">
                <MediaPrimaLogo size="md" />

                <div className="text-right">
                  <div className="font-black text-sm uppercase tracking-wider text-black">
                    FINANCE DEPARTMENT
                  </div>
                  <div className="font-black text-sm italic tracking-tight text-black">
                    CLAIM FORM - HR BENEFIT
                  </div>

                  {/* Segmented Reference Box */}
                  <div className="flex items-center justify-end gap-1 mt-1.5">
                    <span className="text-xs font-bold mr-1">No.</span>
                    <div className="flex border border-black divide-x divide-black bg-white">
                      {voucherBoxes.map((char, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 flex items-center justify-center font-mono font-bold text-xs"
                        >
                          {char.trim()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consent to personal data processing */}
              <div className="text-[9px] leading-tight text-black italic mt-3 mb-1.5">
                <span className="font-bold underline not-italic">
                  Consent to personal data processing:
                </span>{' '}
                By providing your personal data and/or signing this form, you hereby confirm that
                you have read our Personal Data Protection Notice which can be viewed at{' '}
                <span className="underline">www.mediaprima.com.my</span> (“Notice”) and you consent
                to the processing of any personal data provided to the company in accordance with
                the terms contained in the said Notice.
              </div>

              {/* Section A. PERSONAL PARTICULARS */}
              <div className="mt-1">
                <div className="bg-[#FFFF00] border-t border-x border-black px-2 py-0.5 font-bold text-xs">
                  A. PERSONAL PARTICULARS
                </div>
                <table className="w-full border-collapse border border-black text-[11px]">
                  <tbody>
                    <tr>
                      <td className="border border-black p-1 font-bold w-[16%]">NAME</td>
                      <td className="border border-black p-1 font-bold uppercase w-[38%]">
                        {claim.stringerName}
                      </td>
                      <td className="border border-black p-1 font-bold w-[18%]">STAFF NO</td>
                      <td className="border border-black p-1 font-mono w-[28%]">
                        {claim.nric || 'STR-BH-048'}
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 font-bold">DESIGNATION</td>
                      <td className="border border-black p-1">Wartawan Sambilan (Stringer)</td>
                      <td className="border border-black p-1 font-bold">DATE</td>
                      <td className="border border-black p-1 font-medium">{claim.month}</td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 font-bold">DEPARTMENT</td>
                      <td className="border border-black p-1">{claim.biro}</td>
                      <td className="border border-black p-1 font-bold">COMPANY</td>
                      <td className="border border-black p-1 font-medium">
                        The New Straits Times Press (M) Berhad
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1 font-bold">CONTACT NO</td>
                      <td className="border border-black p-1">
                        DL/EXT: <span className="font-mono">-</span>
                      </td>
                      <td className="border border-black p-1 font-bold">MOBILE NO</td>
                      <td className="border border-black p-1 font-mono">+60 12-384 9912</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section B1. TYPE OF CLAIMS (GST)* */}
              <div className="mt-2">
                <div className="bg-[#FFFF00] border-t border-x border-black px-2 py-0.5 font-bold text-xs">
                  B1. TYPE OF CLAIMS (GST)*
                </div>
                <table className="w-full border-collapse border border-black text-[11px]">
                  <thead>
                    <tr className="bg-white text-left font-bold text-[10px]">
                      <th className="border border-black p-1 w-[55%]">
                        ALLOWANCE (Please select from the drop-down list)
                      </th>
                      <th className="border border-black p-1 w-[15%] text-right pr-2">
                        AMOUNT (RM)
                      </th>
                      <th className="border border-black p-1 w-[15%] text-right pr-2">GST (RM)</th>
                      <th className="border border-black p-1 w-[15%] text-right pr-2">TOTAL (RM)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-5">
                      <td className="border border-black px-1.5 text-slate-400 italic text-[10px]">
                        - Tiada Tuntutan Berkadar GST -
                      </td>
                      <td className="border border-black px-1.5 text-right font-mono">0.00</td>
                      <td className="border border-black px-1.5 text-right font-mono">0.00</td>
                      <td className="border border-black px-1.5 text-right font-mono">0.00</td>
                    </tr>
                    <tr className="h-5">
                      <td className="border border-black px-1.5"></td>
                      <td className="border border-black px-1.5"></td>
                      <td className="border border-black px-1.5"></td>
                      <td className="border border-black px-1.5"></td>
                    </tr>
                    {/* SUB-TOTAL */}
                    <tr className="font-bold bg-white">
                      <td colSpan={3} className="border border-black p-1 text-right text-xs">
                        SUB-TOTAL
                      </td>
                      <td className="border border-black p-1 text-right text-xs font-mono pr-2">
                        0.00
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section B2. TYPE OF CLAIMS (NON-GST)* */}
              <div className="mt-2">
                <div className="bg-[#FFFF00] border-t border-x border-black px-2 py-0.5 font-bold text-xs">
                  B2. TYPE OF CLAIMS (NON-GST)*
                </div>
                <table className="w-full border-collapse border border-black text-[11px]">
                  <thead>
                    <tr className="bg-white text-left font-bold text-[10px]">
                      <th className="border border-black p-1 w-[75%]">
                        ALLOWANCE (Please select from the drop-down list)
                      </th>
                      <th className="border border-black p-1 w-[25%] text-right pr-2">
                        TOTAL (RM)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="h-5">
                      <td className="border border-black px-1.5 font-medium">
                        Mileage Claim (Jumlah Jarak: {claim.totalKm} KM @ RM0.35 / KM)
                      </td>
                      <td className="border border-black px-1.5 text-right font-mono font-bold pr-2">
                        {claim.totalMileageRm.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="h-5">
                      <td className="border border-black px-1.5 font-medium">
                        Toll Charges (Touch n Go e-Penyata / Transaksi RFID)
                      </td>
                      <td className="border border-black px-1.5 text-right font-mono font-bold pr-2">
                        {claim.totalTollRm.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="h-5">
                      <td className="border border-black px-1.5 font-medium">
                        Parking Charges (Tiket Rasmi / Touch n Go Parkir)
                      </td>
                      <td className="border border-black px-1.5 text-right font-mono font-bold pr-2">
                        {claim.totalParkingRm.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="h-5">
                      <td className="border border-black px-1.5 text-slate-400 italic text-[10px]">
                        - Ruang Tambahan / Tiada Tuntutan Lain -
                      </td>
                      <td className="border border-black px-1.5 text-right font-mono pr-2">-</td>
                    </tr>
                    {/* SUB-TOTAL */}
                    <tr className="font-bold bg-white">
                      <td className="border border-black p-1 text-right text-xs">
                        SUB-TOTAL
                      </td>
                      <td className="border border-black p-1 text-right text-xs font-mono font-black pr-2">
                        {claim.grandTotalRm.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Section C. TOTAL AMOUNT IN WORDS (RM) */}
              <div className="mt-2 border border-black bg-[#FFFF00] flex">
                <div className="w-[75%] p-1.5 border-r border-black">
                  <div className="font-bold text-[10.5px]">C. TOTAL AMOUNT IN WORDS (RM)</div>
                  <div className="font-extrabold text-[10px] uppercase italic text-black mt-0.5">
                    {numberToMalayWords(claim.grandTotalRm)}
                  </div>
                </div>
                <div className="w-[25%] p-1.5 flex flex-col justify-between text-right">
                  <div className="font-bold text-[10.5px]">TOTAL (RM)</div>
                  <div className="font-black text-sm font-mono pr-1 text-black">
                    RM {claim.grandTotalRm.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Section D. PROGRAMME/ACCOUNT TO BE CHARGED (Where applicable) */}
              <div className="mt-2">
                <table className="w-full border-collapse border border-black text-[11px]">
                  <thead>
                    <tr className="bg-[#FFFF00]">
                      <th className="border border-black p-0.5 text-left font-bold text-xs w-[65%] pl-2">
                        D. PROGRAMME/ACCOUNT TO BE CHARGED (Where applicable)
                      </th>
                      <th className="border border-black p-0.5 text-left font-bold text-xs w-[35%] pl-2">
                        VERIFIED BY
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black p-1">
                        TITLE :{' '}
                        <span className="font-semibold">
                          Liputan Berita & Editorial Stringer ({claim.month})
                        </span>
                      </td>
                      <td className="border border-black p-1">
                        NAME :{' '}
                        <span className="font-semibold">
                          {claim.hodApproverName || 'Puan Zaiton Ishak'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-black p-1">
                        LOCATION : <span className="font-semibold">{claim.biro}</span>
                      </td>
                      <td className="border border-black p-1">
                        DATE :{' '}
                        <span className="font-mono">
                          {claim.hodSignedAt?.split('T')[0] || '31/03/2025'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="border border-black p-1">
                        DATE OF ASSIGNMENT &nbsp;&nbsp;&nbsp;&nbsp; FROM :{' '}
                        <span className="font-mono font-medium underline px-2">01/03/2025</span>{' '}
                        &nbsp;&nbsp; TO :{' '}
                        <span className="font-mono font-medium underline px-2">31/03/2025</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Signatures: REQUESTED BY vs APPROVED / REJECTED BY */}
              <div className="mt-2 border border-black grid grid-cols-2 text-[11px]">
                {/* Column 1: REQUESTED BY */}
                <div className="border-r border-black flex flex-col justify-between">
                  <div className="bg-[#FFFF00] border-b border-black text-center font-bold py-0.5">
                    REQUESTED BY
                  </div>
                  <div className="h-16 flex items-center justify-center p-1">
                    {claim.stringerSignature ? (
                      <img
                        src={claim.stringerSignature}
                        alt="Tandatangan Pemohon"
                        className="max-h-14 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">
                        [Tandatangan Digital Stringer]
                      </span>
                    )}
                  </div>
                  <div className="border-t border-black p-1 space-y-0.5">
                    <div>
                      NAME : <span className="font-bold">{claim.stringerName}</span>
                    </div>
                    <div>
                      DATE :{' '}
                      <span className="font-mono">
                        {claim.stringerSignedAt?.split('T')[0] || claim.submissionDate || '31/03/2025'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 2: APPROVED / REJECTED BY */}
                <div className="flex flex-col justify-between">
                  <div className="bg-[#FFFF00] border-b border-black text-center font-bold py-0.5 leading-tight">
                    <div>APPROVED / REJECTED BY</div>
                    <div className="text-[9px] font-normal">HOD / COO / CEO / GCFO / GMD</div>
                  </div>
                  <div className="h-16 flex flex-col items-center justify-center p-1 text-center">
                    <div className="text-[9px] font-bold text-sky-900 bg-sky-50 px-2 py-0.5 border border-sky-300 rounded font-mono">
                      ••• {claim.hodSeal || 'ZAITON_ISHAK_EDITORIAL_SEAL_VERIFIED'} •••
                    </div>
                    <div className="text-[8px] text-emerald-700 font-bold mt-0.5">
                      ✓ PERAKUAN SAH HOD
                    </div>
                  </div>
                  <div className="border-t border-black p-1 space-y-0.5">
                    <div>
                      NAME :{' '}
                      <span className="font-bold">
                        {claim.hodApproverName || 'Puan Zaiton Ishak'}
                      </span>
                    </div>
                    <div>
                      DATE :{' '}
                      <span className="font-mono">
                        {claim.hodSignedAt?.split('T')[0] || '31/03/2025'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section FOR HUMAN RESOURCES DEPARTMENT USE ONLY */}
              <div className="mt-2 border border-black text-[11px]">
                <div className="bg-[#ED1C24] text-white font-black text-center text-xs py-0.5 tracking-wide">
                  FOR HUMAN RESOURCES DEPARTMENT USE ONLY
                </div>
                <div className="grid grid-cols-3 divide-x divide-black">
                  {/* Verified by */}
                  <div className="flex flex-col justify-between">
                    <div className="text-center font-bold border-b border-black py-0.5 text-[10px] bg-slate-50">
                      VERIFIED BY
                    </div>
                    <div className="h-14 flex items-center justify-center text-[10px] text-slate-500 italic p-1">
                      [Pengesahan HR]
                    </div>
                    <div className="border-t border-black p-1 text-[10px]">
                      <div>
                        NAME :{' '}
                        <span className="font-semibold">
                          {claim.hrReviewerName || 'Encik Zulkifli Hassan'}
                        </span>
                      </div>
                      <div>
                        DATE :{' '}
                        <span className="font-mono">
                          {claim.hrReviewedAt?.split('T')[0] || '31/03/2025'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="flex flex-col justify-between">
                    <div className="text-center font-bold border-b border-black py-0.5 text-[10px] bg-slate-50">
                      REMARKS
                    </div>
                    <div className="p-1.5 text-[9.5px] leading-tight text-slate-800">
                      Tuntutan elaun perbatuan (RM0.35/km), tol dan parkir disemak serta diluluskan
                      untuk baucar pembayaran EFT.
                    </div>
                    <div className="border-t border-black p-1 text-[9px] text-slate-400">
                      Voucher: {claim.voucherNo || 'VCHR-2025-03912'}
                    </div>
                  </div>

                  {/* Approved by */}
                  <div className="flex flex-col justify-between">
                    <div className="text-center font-bold border-b border-black py-0.5 text-[10px] bg-slate-50">
                      APPROVED BY
                    </div>
                    <div className="h-14 flex items-center justify-center text-[10px] text-slate-500 italic p-1">
                      [Kelulusan HR]
                    </div>
                    <div className="border-t border-black p-1 text-[10px]">
                      <div>NAME : <span className="font-semibold">Ketua Sumber Manusia</span></div>
                      <div>DATE : <span className="font-mono">31/03/2025</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-2 flex items-center justify-between text-[9px] text-black">
                <div className="font-bold">*NOTE: ALL RELEVANT DOCUMENTS MUST BE ATTACHED TOGETHER</div>
                <div className="font-mono">Document Control: v1 (7-Oct-2014)</div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-3 bg-slate-100 border-t border-slate-300 flex items-center justify-between no-print text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Format borang rasmi syarikat Media Prima Berhad bersedia untuk cetakan atau simpanan PDF.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#ED1C24] hover:bg-red-700 text-white font-bold px-4 py-2 rounded text-xs transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang (Ctrl + P)</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
