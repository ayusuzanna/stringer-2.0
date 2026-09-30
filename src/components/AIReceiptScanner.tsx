import React, { useState, useRef } from 'react';
import { Sparkles, UploadCloud, CheckCircle2, Lock, ArrowRight, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { RECEIPT_PRESETS } from '../data/mockData';
import { ReceiptScanResult } from '../types';

interface AIReceiptScannerProps {
  onApplyReceipt: (receipt: ReceiptScanResult) => void;
}

export const AIReceiptScanner: React.FC<AIReceiptScannerProps> = ({ onApplyReceipt }) => {
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptScanResult>(RECEIPT_PRESETS[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectPreset = (preset: ReceiptScanResult) => {
    setIsScanning(true);
    setTimeout(() => {
      setCurrentReceipt(preset);
      setIsScanning(false);
    }, 450);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    // Simulate OCR scanning
    setTimeout(() => {
      const fileNameLower = file.name.toLowerCase();
      const isParking = fileNameLower.includes('park') || fileNameLower.includes('tiket');
      
      const newExtracted: ReceiptScanResult = {
        merchant: isParking ? 'Parkir Awam Putrajaya Presint 1' : 'Plaza Tol Batu Tiga (PLUS Highway)',
        date: '24 Mac 2025',
        time: '09:20:14 MYT',
        serialNo: `OCR-${Math.floor(100000 + Math.random() * 900000)}`,
        amount: isParking ? 8.00 : 5.60,
        confidence: 99.2,
        type: isParking ? 'parking' : 'toll',
        imageUrl: URL.createObjectURL(file),
      };

      setCurrentReceipt(newExtracted);
      setIsScanning(false);
    }, 700);
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.05)] h-full flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
              F03
            </span>
            <div>
              <h3 className="text-xs font-bold text-[#0B2545] leading-tight">
                Pengimbas Resit AI (OCR)
              </h3>
              <p className="text-[11px] text-slate-500">
                Muat naik penyata Touch 'n Go & Tiket Parkir
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
            <Sparkles className="w-3 h-3 text-sky-600 animate-pulse" />
            <span>AI Aktif</span>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const file = e.dataTransfer.files[0];
              setIsScanning(true);
              setTimeout(() => {
                setCurrentReceipt({
                  merchant: 'Touch \'n Go eWallet Plaza Tol Petaling Jaya',
                  date: '24 Mac 2025',
                  time: '11:14:02 MYT',
                  serialNo: `TNG-20250324-${Math.floor(10000 + Math.random() * 90000)}`,
                  amount: 6.20,
                  confidence: 99.4,
                  type: 'toll',
                  imageUrl: URL.createObjectURL(file),
                });
                setIsScanning(false);
              }, 600);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-[6px] p-3 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-sky-500 bg-sky-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-[#F8FAFC]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center py-1">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mb-1.5 shadow-2xs">
              <UploadCloud className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Klik untuk muat naik atau seret fail resit
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Sokongan format PNG, JPG, PDF (Maks. 10MB)
            </p>
          </div>
        </div>

        {/* Sample Receipt Quick Selectors */}
        <div className="mt-2.5">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Pilihan Contoh Pantas:</span>
            <span className="text-slate-400">Sentuh untuk imbas</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {RECEIPT_PRESETS.slice(0, 4).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-left text-[11px] p-1.5 rounded-[4px] border transition-all truncate flex items-center gap-1.5 ${
                  currentReceipt.serialNo === preset.serialNo
                    ? 'border-sky-500 bg-sky-50/60 font-semibold text-[#0B2545]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${preset.type === 'toll' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                <span className="truncate">{preset.merchant}</span>
              </button>
            ))}
          </div>
        </div>

        {/* OCR Result Card */}
        <div className="mt-3 bg-[#F8FAFC] border border-slate-200 rounded-[6px] p-2.5 relative overflow-hidden">
          {isScanning && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center z-10">
              <Loader2 className="w-5 h-5 text-sky-600 animate-spin mb-1" />
              <span className="text-[11px] font-bold text-slate-700">Mengekstrak Teks & Nombor Siri...</span>
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold tracking-tight text-slate-600 uppercase">
              Hasil Pengekstrakan Resit Terkini
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
              Keyakinan {currentReceipt.confidence}%
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-[11px]">Pembekal / Merchant:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[170px]">
                {currentReceipt.merchant}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-[11px]">Tarikh & Masa:</span>
              <span className="font-medium text-slate-800 text-[11px]">
                {currentReceipt.date}, {currentReceipt.time}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span className="text-[11px]">Nombor Siri Transaksi:</span>
              <span className="font-mono text-[11px] text-slate-800">
                {currentReceipt.serialNo}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-200">
              <span className="text-xs font-bold text-[#0B2545]">Amaun Dikesan:</span>
              <span className="text-sm font-extrabold text-[#0B2545] font-['Inter',sans-serif] tracking-tight">
                RM {currentReceipt.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Resit disulitkan secara digital</span>
        </div>

        <button
          type="button"
          onClick={() => onApplyReceipt(currentReceipt)}
          className="inline-flex items-center gap-1 bg-[#001026] hover:bg-[#0B2545] text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-[4px] transition-colors shadow-xs"
        >
          <span>Padankan dengan Log</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
