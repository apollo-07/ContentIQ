import React from 'react';

export function ProgressBar({
  value = 0,
  max = 100,
  label,
  valueLabel,
  color = 'mint', // 'mint' | 'pink' | 'yellow' | 'blue' | 'purple' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'brand'
  size = 'md',
  showPercentage = false,
  segmented = false, // Segmented block meter inspired by Image 1 Speed/Power bars
  segmentsCount = 14,
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizeStyles = {
    sm: 'h-2.5',
    md: 'h-4',
    lg: 'h-6',
  };

  const fillColors = {
    mint: 'bg-[#2DD4BF]',
    emerald: 'bg-[#2DD4BF]',
    pink: 'bg-[#FF6B97]',
    rose: 'bg-[#FF6B97]',
    yellow: 'bg-[#FFD12E]',
    amber: 'bg-[#FFD12E]',
    blue: 'bg-[#38BDF8]',
    cyan: 'bg-[#38BDF8]',
    purple: 'bg-[#C084FC]',
    indigo: 'bg-[#6366F1]',
    brand: 'bg-[#FFD12E]',
  };

  if (segmented) {
    const filledSegments = Math.round((percentage / 100) * segmentsCount);
    return (
      <div className={`w-full ${className}`}>
        {(label || valueLabel || showPercentage) && (
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold font-mono">
            {label && <span className="text-slate-300 uppercase">{label}:</span>}
            <span className="text-white ml-auto">
              {valueLabel || (showPercentage ? `${Math.round(percentage)}%` : `${value}/${max}`)}
            </span>
          </div>
        )}
        <div className="flex items-center gap-1 p-1 bg-black rounded-xl border-2 border-black shadow-neo-sm">
          {Array.from({ length: segmentsCount }).map((_, i) => {
            const isFilled = i < filledSegments;
            return (
              <div
                key={i}
                className={`flex-1 h-4 rounded-md border border-black/80 transition-all duration-300 ${
                  isFilled
                    ? fillColors[color] || 'bg-[#2DD4BF]'
                    : 'bg-slate-800/80'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || valueLabel || showPercentage) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-bold font-mono">
          {label && <span className="text-slate-300 uppercase">{label}:</span>}
          <span className="text-white ml-auto">
            {valueLabel || (showPercentage ? `${Math.round(percentage)}%` : `${value} / ${max}`)}
          </span>
        </div>
      )}
      <div
        className={`w-full bg-[#1E293B] rounded-xl overflow-hidden p-0.5 border-2 border-black shadow-neo-sm ${
          sizeStyles[size] || sizeStyles.md
        }`}
      >
        <div
          className={`h-full rounded-lg border-r border-black transition-all duration-500 ease-out ${
            fillColors[color] || 'bg-[#FFD12E]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
