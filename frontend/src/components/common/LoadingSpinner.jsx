import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({
  size = 'md',
  message = 'Loading data...',
  fullPage = false,
  className = '',
}) {
  const sizeStyles = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 p-8 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-md bg-indigo-500/30 animate-pulse" />
        <Loader2 className={`${sizeStyles[size] || sizeStyles.md} animate-spin text-indigo-400 relative z-10`} />
      </div>
      {message && <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
}

export function SkeletonCard({ height = 'h-32', className = '' }) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 animate-pulse ${height} ${className} flex flex-col justify-between`}
    >
      <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
      <div className="h-8 bg-slate-800 rounded w-2/3 mb-2" />
      <div className="h-3 bg-slate-800 rounded w-1/2" />
    </div>
  );
}
