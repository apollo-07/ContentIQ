import React from 'react';

export function Badge({
  children,
  variant = 'yellow', // 'yellow' | 'pink' | 'mint' | 'blue' | 'purple' | 'cream' | 'dark' | 'emerald' | 'amber' | 'rose' | 'slate' | 'brand' | 'sticker'
  size = 'md',
  dot = false,
  number, // e.g. "01", "02"
  colorIndex = 0,
  className = '',
  ...props
}) {
  const stickerPalettes = [
    'bg-[#FFD12E] text-slate-950',
    'bg-[#FF6B97] text-white',
    'bg-[#2DD4BF] text-slate-950',
    'bg-[#6366F1] text-white',
    'bg-[#38BDF8] text-slate-950',
    'bg-[#C084FC] text-slate-950',
  ];

  const variantStyles = {
    yellow: 'bg-[#FFD12E] text-slate-950',
    pink: 'bg-[#FF6B97] text-white',
    mint: 'bg-[#2DD4BF] text-slate-950',
    blue: 'bg-[#38BDF8] text-slate-950',
    purple: 'bg-[#C084FC] text-slate-950',
    cream: 'bg-[#FFFDF5] text-slate-950',
    dark: 'bg-[#1E293B] text-white',
    emerald: 'bg-[#2DD4BF] text-slate-950',
    amber: 'bg-[#FFD12E] text-slate-950',
    rose: 'bg-[#FF6B97] text-white',
    slate: 'bg-slate-700 text-slate-200',
    brand: 'bg-[#6366F1] text-white',
    sticker: stickerPalettes[colorIndex % stickerPalettes.length],
  };

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 shadow-[1.5px_1.5px_0px_#000]',
    sm: 'text-xs px-2.5 py-0.5 shadow-neo-sm',
    md: 'text-xs px-3 py-1 shadow-neo-sm',
    lg: 'text-sm px-3.5 py-1.5 shadow-neo',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border-2 border-black font-extrabold tracking-tight select-none ${
        variantStyles[variant] || variantStyles.yellow
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
      {...props}
    >
      {number && (
        <span className="w-4 h-4 rounded bg-black text-white text-[10px] flex items-center justify-center font-mono">
          {number}
        </span>
      )}
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
      )}
      {children}
    </span>
  );
}
