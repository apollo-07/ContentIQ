import React from 'react';
import { Button } from './Button';
import { Inbox } from 'lucide-react';

export function EmptyState({
  title = 'No data available',
  description = 'There is currently no information to display for this view.',
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={`rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center border-[2.5px] border-dashed border-slate-700 bg-[#151D2C]/80 shadow-neo-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#FFD12E] border-2 border-black flex items-center justify-center text-slate-950 mb-4 shadow-neo-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-lg font-extrabold text-white tracking-tight font-display">{title}</h4>
      <p className="text-xs sm:text-sm text-slate-400 max-w-md mt-1.5 mb-6 font-medium">{description}</p>
      {actionLabel && onAction && (
        <Button variant="yellow" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
