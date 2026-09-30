import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  signerName: string;
  initialSignature?: string;
  readOnly?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  signerName,
  initialSignature,
  readOnly = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!initialSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set display vs canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = '#0B2545';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasSignature(true);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing || readOnly) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL());
  };

  const clearCanvas = () => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSave('');
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <PenTool className="w-3.5 h-3.5 text-slate-600" />
          <span>Pad Tandatangan Digital</span>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={clearCanvas}
            className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-red-600 transition-colors font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Padam Semula</span>
          </button>
        )}
      </div>

      <div className="relative my-2 flex-1 min-h-[110px] bg-[#FAFBFD] border border-dashed border-slate-300 rounded-[4px] overflow-hidden flex items-center justify-center">
        {!hasSignature && !readOnly && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400 text-xs text-center px-4">
            <svg
              className="w-7 h-7 text-slate-300 mb-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Sila tandatangan di sini menggunakan tetikus atau skrin sentuh</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`w-full h-full touch-none ${
            readOnly ? 'cursor-default' : 'cursor-crosshair'
          }`}
        />
      </div>

      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Tandatangan Sah: <strong className="text-slate-700">{signerName}</strong></span>
        {hasSignature && (
          <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-[10px]">
            <Check className="w-3 h-3" /> Rekod Disimpan
          </span>
        )}
      </div>
    </div>
  );
};
