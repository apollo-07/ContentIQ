import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Retro Window Dialog */}
      <div
        className={`relative w-full ${maxWidth} bg-[#151D2C] rounded-2xl z-10 border-[2.5px] border-black shadow-neo-xl overflow-hidden transform transition-all`}
        role="dialog"
        aria-modal="true"
      >
        {/* Retro Window Header */}
        <div className="bg-[#1E293B] border-b-[2.5px] border-black px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-[#FFD12E] border border-black inline-flex items-center justify-center text-[9px] font-black text-black select-none">
              -
            </span>
            <span className="w-3.5 h-3.5 rounded bg-[#2DD4BF] border border-black inline-flex items-center justify-center text-[8px] font-black text-black select-none">
              □
            </span>
            <span
              onClick={onClose}
              className="w-3.5 h-3.5 rounded bg-[#FF6B97] border border-black inline-flex items-center justify-center text-[9px] font-black text-white cursor-pointer select-none"
            >
              ✕
            </span>
            <h3 className="text-sm font-bold text-white font-mono ml-2">
              {title || 'Modal Window'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {subtitle && <p className="text-xs text-slate-400 mb-4 font-medium">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
