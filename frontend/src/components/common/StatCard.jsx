import React from 'react';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  trendDirection = 'up',
  color = 'yellow', // 'yellow' | 'pink' | 'mint' | 'blue' | 'purple' | 'cream'
  className = '',
}) {
  const iconBgStyles = {
    yellow: 'bg-[#FFD12E] text-slate-950',
    pink: 'bg-[#FF6B97] text-white',
    mint: 'bg-[#2DD4BF] text-slate-950',
    blue: 'bg-[#38BDF8] text-slate-950',
    purple: 'bg-[#C084FC] text-slate-950',
    cream: 'bg-[#FFFDF5] text-slate-950',
    brand: 'bg-[#6366F1] text-white',
    emerald: 'bg-[#2DD4BF] text-slate-950',
    amber: 'bg-[#FFD12E] text-slate-950',
    rose: 'bg-[#FF6B97] text-white',
    cyan: 'bg-[#38BDF8] text-slate-950',
  };

  return (
    <Card hover className={`relative group ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 font-mono">
            {title}
          </p>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white mt-1 font-display tracking-tight truncate">
            {value}
          </h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
        </div>
        {Icon && (
          <div
            className={`p-3 rounded-xl border-2 border-black shadow-neo-sm transition-transform duration-150 group-hover:scale-105 flex-shrink-0 ${
              iconBgStyles[color] || iconBgStyles.yellow
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(trend || trendLabel) && (
        <div className="mt-4 pt-3 border-t-2 border-black/60 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-black px-2 py-0.5 rounded-lg border border-black shadow-[1.5px_1.5px_0px_#000] ${
                trendDirection === 'up'
                  ? 'bg-[#2DD4BF] text-slate-950'
                  : trendDirection === 'down'
                  ? 'bg-[#FF6B97] text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trendDirection === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
          {trendLabel && <span className="text-slate-400 text-xs font-medium">{trendLabel}</span>}
        </div>
      )}
    </Card>
  );
}
