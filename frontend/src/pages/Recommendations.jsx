import React, { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Trophy,
  ArrowUpRight,
  Filter,
  Layers,
  Tag,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('ALL');

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendations();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
      setError(
        err.response?.data?.detail || err.message || 'Failed to retrieve recommendations.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const formats = ['ALL', ...new Set(recommendations.map((r) => r.content_type).filter(Boolean))];

  const filteredRecs = recommendations.filter((r) => {
    if (selectedFormat === 'ALL') return true;
    return r.content_type === selectedFormat;
  });

  if (loading) {
    return <LoadingSpinner fullPage message="Ranking strategic content opportunities..." />;
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorState
          title="Could not load recommendations"
          message={error}
          onRetry={fetchRecommendations}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neo-yellow/20 border-2 border-neo-yellow text-neo-yellow text-xs font-black uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Ranked Directives
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Ranked Recommendations
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data-backed formula combinations ranked by their predicted composite engagement score.
          </p>
        </div>

        {/* Filter by format */}
        {formats.length > 1 && (
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border-2 border-slate-700 self-start sm:self-auto overflow-x-auto max-w-full shadow-neo-sm">
            {formats.map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all whitespace-nowrap uppercase font-mono ${
                  selectedFormat === fmt
                    ? 'bg-neo-yellow text-slate-950 border-2 border-slate-950 shadow-neo-sm scale-105'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {fmt === 'ALL' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredRecs.length === 0 ? (
        <EmptyState
          title="No recommendations found"
          description="Try selecting a different filter or upload fresh dataset activity."
          actionLabel="Clear Filter"
          onAction={() => setSelectedFormat('ALL')}
        />
      ) : (
        <div className="space-y-6">
          {filteredRecs.map((rec, index) => {
            const isTopRank = rec.rank === 1;

            return (
              <Card
                key={rec.rank}
                hoverable
                className={`relative ${
                  isTopRank
                    ? 'border-2 border-neo-yellow shadow-neo bg-slate-900/90'
                    : 'border-2 border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left info */}
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="sticker" colorIndex={index} size="md">
                        #{rec.rank < 10 ? `0${rec.rank}` : rec.rank}
                      </Badge>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-display font-black text-white tracking-tight">
                            {rec.content_type}
                          </span>
                          <span className="text-slate-500 font-bold">•</span>
                          <span className="text-base font-bold text-neo-pink">
                            {rec.topic}
                          </span>
                        </div>
                      </div>

                      {isTopRank && (
                        <Badge variant="yellow" size="sm" dot>
                          TOP OPPORTUNITY
                        </Badge>
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border-2 border-slate-800 shadow-neo-sm font-mono">
                        <Calendar className="w-3.5 h-3.5 text-neo-indigo" />
                        <span className="text-slate-400">Day:</span>
                        <strong className="text-white">{rec.day}</strong>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border-2 border-slate-800 shadow-neo-sm font-mono">
                        <Clock className="w-3.5 h-3.5 text-neo-mint" />
                        <span className="text-slate-400">Window:</span>
                        <strong className="text-white">{rec.time_range} UTC</strong>
                      </div>
                    </div>

                    {/* Reasons list */}
                    {rec.reasons && rec.reasons.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t-2 border-slate-800">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                          WHY THIS WORKS:
                        </p>
                        <ul className="space-y-1.5">
                          {rec.reasons.map((reason, idx) => (
                            <li
                              key={idx}
                              className="text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 font-medium"
                            >
                              <CheckCircle2 className="w-4 h-4 text-neo-mint flex-shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Score & Action widget */}
                  <div className="lg:w-64 flex-shrink-0 p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 flex flex-col justify-between gap-4 shadow-neo-sm">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
                        <span className="font-bold text-slate-400 uppercase">SCORE</span>
                        <span className="font-display font-black text-xl text-neo-yellow">{rec.score} / 100</span>
                      </div>
                      <ProgressBar
                        value={rec.score}
                        max={100}
                        variant="segmented"
                        color={rec.score >= 80 ? 'emerald' : rec.score >= 60 ? 'yellow' : 'pink'}
                        size="md"
                      />
                      <p className="text-[11px] text-slate-400 mt-2 font-medium">
                        {rec.score >= 85
                          ? 'Exceptional predicted audience reach'
                          : rec.score >= 70
                          ? 'Solid predictable engagement return'
                          : 'Moderate baseline benchmark'}
                      </p>
                    </div>

                    <Link to="/predict" className="w-full">
                      <Button
                        variant={isTopRank ? 'primary' : 'outline'}
                        size="sm"
                        className="w-full"
                        icon={ArrowUpRight}
                        iconPosition="right"
                      >
                        Simulate Post
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

