import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'yellow', // 'yellow' | 'pink' | 'mint' | 'indigo' | 'cream' | 'outline' | 'danger' | 'ghost'
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-tight rounded-xl border-2 border-black transition-all select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed neo-interactive-press';

  const sizeStyles = {
    xs: 'text-xs px-2.5 py-1 gap-1.5 shadow-neo-sm',
    sm: 'text-xs px-3.5 py-1.5 gap-2 shadow-neo-sm',
    md: 'text-sm px-4 py-2.5 gap-2 shadow-neo',
    lg: 'text-base px-6 py-3 gap-2.5 shadow-neo-lg',
  };

  const variantStyles = {
    yellow: 'bg-[#FFD12E] hover:bg-[#FACC15] text-slate-950',
    pink: 'bg-[#FF6B97] hover:bg-[#F43F5E] text-white',
    mint: 'bg-[#2DD4BF] hover:bg-[#14B8A6] text-slate-950',
    indigo: 'bg-[#6366F1] hover:bg-[#4F46E5] text-white',
    cream: 'bg-[#FFFDF5] hover:bg-[#FEF9C3] text-slate-950',
    secondary: 'bg-[#1E293B] hover:bg-[#334155] text-white',
    outline: 'bg-transparent hover:bg-slate-800/80 text-white',
    ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 border-transparent shadow-none hover:shadow-neo-sm hover:border-black',
    danger: 'bg-[#EF4444] hover:bg-[#DC2626] text-white',
    glow: 'bg-[#FFD12E] hover:bg-[#FACC15] text-slate-950',
    primary: 'bg-[#6366F1] hover:bg-[#4F46E5] text-white',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.yellow
      } ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {!isLoading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 text-current" />}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 text-current" />}
    </button>
  );
}
