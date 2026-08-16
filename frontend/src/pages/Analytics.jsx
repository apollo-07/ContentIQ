import React, { useState, useEffect } from 'react';
import {
  getContentTypes,
  getTopics,
  getTiming,
  getTrends,
} from '../services/api';
import { ContentTypeChart } from '../components/charts/ContentTypeChart';
import { TopicPerformanceChart } from '../components/charts/TopicPerformanceChart';
import {
  DayPerformanceChart,
  HourlyPerformanceChart,
} from '../components/charts/TimingCharts';
import { EngagementTrendChart } from '../components/charts/EngagementTrendChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
  Layers,
} from 'lucide-react';

export function Analytics() {
  const [contentTypes, setContentTypes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [timing, setTiming] = useState({ day_data: [], hour_data: [] });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [typesRes, topicsRes, timingRes, trendsRes] = await Promise.all([
        getContentTypes(),
        getTopics(),
        getTiming(),
        getTrends(),
      ]);

      setContentTypes(typesRes.data || []);
      setTopics(topicsRes.data || []);
      setTiming(timingRes || { day_data: [], hour_data: [] });
      setTrends(trendsRes.trends || []);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Crunching social performance analytics & trendlines..." />;
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorState
          title="Could not load analytics"
          message={error}
          onRetry={fetchAnalyticsData}
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
            Performance Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
            Examine format velocity, topic resonance, weekly cadence, and longitudinal engagement trends.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#0F172A] border-2 border-black shadow-neo-sm self-start sm:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'all', label: 'All Dimensions' },
            { id: 'content', label: 'Content & Topics' },
            { id: 'timing', label: 'Day & Hour' },
            { id: 'trends', label: 'Historical Trends' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black font-mono transition-all whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-[#FFD12E] text-slate-950 border-black shadow-neo-sm'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-4 bg-[#FFFDF5] text-slate-950 border-[2.5px] border-black shadow-neo">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600">
            <Layers className="w-3.5 h-3.5 text-black" />
            <span>FORMAT LEADER</span>
          </div>
          <p className="text-xl font-black font-display mt-1">Reels (8.2%)</p>
          <span className="text-[11px] font-bold text-[#0D9488]">+1.1% vs carousels</span>
        </div>

        <div className="rounded-2xl p-4 bg-[#FFFDF5] text-slate-950 border-[2.5px] border-black shadow-neo">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600">
            <TrendingUp className="w-3.5 h-3.5 text-black" />
            <span>TOP VOLUME</span>
          </div>
          <p className="text-xl font-black font-display mt-1">Tutorial & Tips</p>
          <span className="text-[11px] font-bold text-slate-600">120 published posts</span>
        </div>

        <div className="rounded-2xl p-4 bg-[#FFFDF5] text-slate-950 border-[2.5px] border-black shadow-neo">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-black" />
            <span>PRIME DAY</span>
          </div>
          <p className="text-xl font-black font-display mt-1">Saturday (8.4%)</p>
          <span className="text-[11px] font-bold text-[#6366F1]">Weekend Peak Reach</span>
        </div>

        <div className="rounded-2xl p-4 bg-[#FFFDF5] text-slate-950 border-[2.5px] border-black shadow-neo">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600">
            <Clock className="w-3.5 h-3.5 text-black" />
            <span>PRIME HOUR</span>
          </div>
          <p className="text-xl font-black font-display mt-1">19:00-21:00 UTC</p>
          <span className="text-[11px] font-bold text-[#FF6B97]">8.2% avg engagement</span>
        </div>
      </div>

      {/* Historical Trend Chart */}
      {(activeTab === 'all' || activeTab === 'trends') && (
        <div>
          <EngagementTrendChart data={trends} />
        </div>
      )}

      {/* Content & Topics Charts */}
      {(activeTab === 'all' || activeTab === 'content') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ContentTypeChart data={contentTypes} />
          <TopicPerformanceChart data={topics} />
        </div>
      )}

      {/* Timing Dimensions (Day & Hourly) */}
      {(activeTab === 'all' || activeTab === 'timing') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DayPerformanceChart data={timing.day_data} />
          <HourlyPerformanceChart data={timing.hour_data} />
        </div>
      )}
    </div>
  );
}
