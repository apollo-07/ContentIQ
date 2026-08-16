import React from 'react';
import { Button } from './Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorState({
  title = 'Failed to load content',
  message = 'An unexpected error occurred while fetching the requested data.',
  onRetry,
  className = '',
}) {
  return (
    <div
      className={`rounded-2xl p-6 sm:p-8 border-[2.5px] border-black bg-[#FF6B97]/15 shadow-neo flex flex-col items-center justify-center text-center ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#FF6B97] border-2 border-black flex items-center justify-center text-white mb-3 shadow-neo-sm">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-extrabold text-white tracking-tight font-display">{title}</h4>
      <p className="text-xs text-rose-200/90 max-w-md mt-1 mb-5 font-medium">{message}</p>
      {onRetry && (
        <Button
          variant="pink"
          size="sm"
          icon={RefreshCw}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
}

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
        <div className="w-10 h-10 rounded-xl bg-[#FFD12E] border-2 border-black shadow-neo-sm animate-spin flex items-center justify-center font-black text-xs text-black">
          ⚡
        </div>
      </div>
      {message && (
        <p className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono animate-pulse">
          {message}
        </p>
      )}
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
      className={`rounded-2xl border-[2.5px] border-black bg-[#151D2C] p-6 shadow-neo animate-pulse ${height} ${className} flex flex-col justify-between`}
    >
      <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
      <div className="h-8 bg-slate-800 rounded w-2/3 mb-2" />
      <div className="h-3 bg-slate-800 rounded w-1/2" />
    </div>
  );
}
