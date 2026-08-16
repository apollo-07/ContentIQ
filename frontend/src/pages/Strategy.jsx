import React, { useState, useEffect } from 'react';
import { getStrategy } from '../services/api';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import {
  CalendarDays,
  Clock,
  Sparkles,
  Download,
  Copy,
  Check,
  Share2,
  Video,
  Layers,
  FileText,
  Tag,
  CheckCircle2,
  Zap,
} from 'lucide-react';

export function Strategy() {
  const [strategy, setStrategy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchStrategy = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStrategy();
      setStrategy(data.strategy || []);
    } catch (err) {
      console.error('Failed to load strategy:', err);
      setError(
        err.response?.data?.detail || err.message || 'Failed to retrieve weekly strategy schedule.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategy();
  }, []);

  const handleCopySchedule = () => {
    const textSummary = strategy
      .map(
        (s) =>
          `• ${s.day} (${s.time_range} UTC): ${s.content_type} on "${s.topic}" [Score: ${s.score}]`
      )
      .join('\n');

    navigator.clipboard.writeText(`ContentIQ Recommended 7-Day Strategy:\n\n${textSummary}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(strategy, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'contentiq_weekly_strategy.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'Reel':
      case 'Video (Long)':
        return Video;
      case 'Carousel':
        return Layers;
      default:
        return FileText;
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Building optimal 7-day algorithmic publishing strategy..." />;
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorState
          title="Could not load weekly strategy"
          message={error}
          onRetry={fetchStrategy}
        />
      </div>
    );
  }

  if (!strategy || strategy.length === 0) {
    return (
      <EmptyState
        title="No strategy generated"
        description="Connect your social dataset or train the model to synthesize a weekly strategy plan."
        actionLabel="Refresh Strategy"
        onAction={fetchStrategy}
      />
    );
  }

  const averageScore = Math.round(
    strategy.reduce((acc, curr) => acc + (curr.score || 0), 0) / strategy.length
  );

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neo-mint/20 border-2 border-neo-mint text-neo-mint text-xs font-black uppercase tracking-wider mb-2">
            <CalendarDays className="w-3.5 h-3.5" />
            7-Day Master Plan
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Weekly Content Strategy
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Algorithmic 7-day publishing cadence balanced for maximum weekly reach and minimum burnout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySchedule}
            icon={copied ? Check : Copy}
          >
            {copied ? 'Copied Schedule' : 'Copy Text'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleExportJSON}
            icon={Download}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Overview Stat Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="neo-box rounded-2xl p-5 bg-slate-900 border-2 border-slate-700 shadow-neo">
          <span className="text-xs font-black text-slate-400 uppercase font-mono">Weekly Strategy Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-3xl font-display font-black text-neo-yellow">{averageScore}</h3>
            <span className="text-xs font-mono text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] font-bold text-neo-mint mt-1">Optimal cadence efficiency</p>
        </div>

        <div className="neo-box rounded-2xl p-5 bg-slate-900 border-2 border-slate-700 shadow-neo">
          <span className="text-xs font-black text-slate-400 uppercase font-mono">Weekly Publishing Volume</span>
          <h3 className="text-3xl font-display font-black text-white mt-1">{strategy.length} Posts</h3>
          <p className="text-[11px] font-bold text-neo-indigo mt-1">1 high-intent post per day</p>
        </div>

        <div className="neo-box rounded-2xl p-5 bg-slate-900 border-2 border-slate-700 shadow-neo">
          <span className="text-xs font-black text-slate-400 uppercase font-mono">Peak Focus Day</span>
          <h3 className="text-3xl font-display font-black text-neo-pink mt-1">Saturday</h3>
          <p className="text-[11px] font-bold text-neo-blue mt-1">Score 93 (Reel + Behind Scenes)</p>
        </div>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-black text-white tracking-tight flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-neo-mint" />
            7-Day Strategy Schedule
          </h3>
          <span className="text-xs text-slate-400 font-mono">Monday through Sunday sequence</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {strategy.map((item, index) => {
            const Icon = getFormatIcon(item.content_type);
            const isHighest = item.score >= 90;

            return (
              <Card
                key={item.day || index}
                hoverable
                className={`flex flex-col justify-between relative ${
                  isHighest
                    ? 'border-2 border-neo-yellow shadow-neo bg-slate-900'
                    : 'border-2 border-slate-800'
                }`}
              >
                <div>
                  {/* Top Day Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="sticker" colorIndex={index} size="xs">
                        0{index + 1}
                      </Badge>
                      <span className="text-sm font-display font-black text-white">{item.day}</span>
                    </div>
                    <span
                      className={`text-xs font-mono font-black px-2 py-0.5 rounded-lg border-2 shadow-neo-sm ${
                        item.score >= 85
                          ? 'bg-emerald-400 text-slate-950 border-slate-950'
                          : item.score >= 70
                          ? 'bg-neo-yellow text-slate-950 border-slate-950'
                          : 'bg-neo-pink text-slate-950 border-slate-950'
                      }`}
                    >
                      {item.score}
                    </span>
                  </div>

                  {/* Format & Topic */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-neo-indigo shadow-neo-sm">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-white">{item.content_type}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-300">
                      <Tag className="w-3.5 h-3.5 text-neo-pink flex-shrink-0" />
                      <span className="font-bold text-neo-yellow">{item.topic}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Time Range */}
                <div className="mt-5 pt-3 border-t-2 border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neo-mint" />
                    {item.time_range} UTC
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">SLOT 0{index + 1}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

