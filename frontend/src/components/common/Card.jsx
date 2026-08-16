import React from 'react';

export function Card({
  children,
  className = '',
  hover = false,
  hoverable = false,
  glow = false,
  windowControls = false,
  windowTitle,
  padding = 'normal',
  title,
  subtitle,
  action,
  icon: Icon,
  variant = 'dark', // 'dark' | 'cream' | 'white' | 'yellow' | 'pink' | 'mint'
  ...props
}) {
  const isHover = hover || hoverable;
  const paddingStyles = {
    none: 'p-0',
    compact: 'p-4',
    normal: 'p-5 sm:p-6',
    spacious: 'p-6 sm:p-8',
  };

  const bgStyles = {
    dark: 'bg-[#151D2C] text-slate-100',
    cream: 'bg-[#FFFDF5] text-slate-950',
    white: 'bg-[#FFFFFF] text-slate-950',
    yellow: 'bg-[#FFD12E] text-slate-950',
    pink: 'bg-[#FF6B97] text-white',
    mint: 'bg-[#2DD4BF] text-slate-950',
  };

  return (
    <div
      className={`rounded-2xl border-[2.5px] border-black shadow-neo overflow-hidden relative ${
        bgStyles[variant] || bgStyles.dark
      } ${isHover ? 'neo-box-hover cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {/* Retro Window Titlebar (Inspired by Inspo Image 1) */}
      {windowControls && (
        <div className="bg-[#1E293B] text-slate-200 border-b-[2.5px] border-black px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono tracking-tight">
              {windowTitle || title || 'Window'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-md bg-[#FFD12E] border border-black inline-flex items-center justify-center text-[9px] font-black text-black select-none">
              -
            </span>
            <span className="w-3.5 h-3.5 rounded-md bg-[#2DD4BF] border border-black inline-flex items-center justify-center text-[8px] font-black text-black select-none">
              □
            </span>
            <span className="w-3.5 h-3.5 rounded-md bg-[#FF6B97] border border-black inline-flex items-center justify-center text-[9px] font-black text-white select-none">
              ✕
            </span>
          </div>
        </div>
      )}

      {/* Standard Card Header */}
      {!windowControls && (title || subtitle || action || Icon) && (
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-xl bg-[#FFD12E] border-2 border-black text-slate-950 shadow-neo-sm">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-extrabold tracking-tight">{title}</h3>
              )}
              {subtitle && <p className="text-xs opacity-75 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div className={paddingStyles[padding] || paddingStyles.normal}>{children}</div>
    </div>
  );
}
