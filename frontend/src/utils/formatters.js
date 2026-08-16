// ContentIQ UI Formatters and Helper Utilities

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCompactNumber(num) {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(num);
}

export function formatPercent(rate, decimals = 2) {
  if (rate === null || rate === undefined) return '0.00%';
  return `${Number(rate).toFixed(decimals)}%`;
}

export function formatScore(score) {
  return Math.round(Number(score || 0));
}

export function getScoreColor(score) {
  const val = Number(score || 0);
  if (val >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (val >= 60) return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
  if (val >= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
}

export function getImpactBadgeColor(impact) {
  const imp = String(impact).toLowerCase();
  if (imp === 'high') {
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  }
  if (imp === 'medium') {
    return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  }
  return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
}

export function getPredictionBadgeColor(prediction) {
  const pred = String(prediction).toUpperCase();
  if (pred === 'HIGH') {
    return {
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-glow-emerald',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500',
      border: 'border-emerald-500/30',
      glow: 'shadow-emerald-500/20'
    };
  }
  if (pred === 'MEDIUM') {
    return {
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      text: 'text-amber-400',
      bg: 'bg-amber-500',
      border: 'border-amber-500/30',
      glow: 'shadow-amber-500/20'
    };
  }
  return {
    badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-glow-rose',
    text: 'text-rose-400',
    bg: 'bg-rose-500',
    border: 'border-rose-500/30',
    glow: 'shadow-rose-500/20'
  };
}

export function formatHour(hour) {
  const h = Number(hour);
  if (isNaN(h)) return `${hour}:00`;
  const pad = h < 10 ? `0${h}` : `${h}`;
  return `${pad}:00`;
}
