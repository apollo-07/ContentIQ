import React, { useState, useEffect } from 'react';
import { getInsights } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import {
  Lightbulb,
  Sparkles,
  CheckCircle,
  Video,
  Clock,
  Tag,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterImpact, setFilterImpact] = useState('ALL');

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInsights();
      setInsights(data.insights || []);
    } catch (err) {
      console.error('Failed to load insights:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to retrieve insights.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const filteredInsights = insights.filter((item) => {
    if (filterImpact === 'ALL') return true;
    return item.impact?.toLowerCase() === filterImpact.toLowerCase();
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'content':
      case 'format':
        return Video;
      case 'timing':
      case 'frequency':
        return Clock;
      case 'topic':
        return Tag;
      default:
        return Lightbulb;
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Synthesizing behavioural audience insights..." />;
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorState
          title="Could not load insights"
          message={error}
          onRetry={fetchInsights}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#151D2C] border-[2.5px] border-black shadow-neo">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            AI Content Insights & Signals
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
            Automated intelligence mined from historical reach, comment depth, and velocity curves.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0F172A] border-2 border-black shadow-neo-sm self-start sm:self-auto">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterImpact(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-black font-mono transition-all border ${
                filterImpact === lvl
                  ? 'bg-[#FFD12E] text-slate-950 border-black shadow-neo-sm'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              {lvl === 'ALL' ? 'ALL' : `${lvl} IMPACT`}
            </button>
          ))}
        </div>
      </div>

      {filteredInsights.length === 0 ? (
        <EmptyState
          title="No insights match your filter"
          description="Try selecting a different impact level to see other discovered patterns."
          actionLabel="Show All Insights"
          onAction={() => setFilterImpact('ALL')}
        />
      ) : (
        /* Infographic Card Grid (Inspired by Inspo Image 2 & 3) */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredInsights.map((item, idx) => {
            const Icon = getTypeIcon(item.type);
            const impactLower = item.impact?.toLowerCase() || 'medium';

            const impactBadgeColor =
              impactLower === 'high'
                ? 'mint'
                : impactLower === 'medium'
                ? 'yellow'
                : 'pink';

            return (
              <div
                key={item.id}
                className="rounded-3xl border-[2.5px] border-black bg-[#FFFDF5] text-slate-950 p-6 shadow-neo-lg flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-xl transition-all"
              >
                <div>
                  {/* Top Header Row with Numbered Sticker Circle and Impact Pill */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#FFD12E] border-2 border-black flex items-center justify-center font-black font-mono text-base text-slate-950 shadow-neo-sm">
                        {String(item.id || idx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <span className="text-[10px] font-black font-mono uppercase tracking-wider text-slate-600 block">
                          CATEGORY: {item.type || 'CONTENT'}
                        </span>
                        <h3 className="text-base sm:text-lg font-black tracking-tight font-display text-slate-950">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <Badge variant={impactBadgeColor} size="sm">
                      {item.impact ? item.impact.toUpperCase() : 'NORMAL'}
                    </Badge>
                  </div>

                  {/* Description Box */}
                  <div className="p-4 rounded-2xl bg-[#F4EFE6] border-2 border-black/80 shadow-neo-sm mt-3">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Footer Verification */}
                <div className="mt-5 pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-bold flex items-center gap-1.5 font-mono text-[11px]">
                    <CheckCircle className="w-3.5 h-3.5 text-black" />
                    Verified by Dataset Signal
                  </span>
                  <span className="font-black text-black hover:underline cursor-pointer flex items-center gap-1 font-mono text-[11px]">
                    APPLY TO DRAFT →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
