import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getOverview,
  getContentTypes,
  getTopics,
  getInsights,
  getRecommendations,
} from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { ContentTypeChart } from '../components/charts/ContentTypeChart';
import { TopicPerformanceChart } from '../components/charts/TopicPerformanceChart';
import {
  formatNumber,
  formatPercent,
  getScoreColor,
} from '../utils/formatters';
import {
  FileText,
  Percent,
  Heart,
  Video,
  Tag,
  Clock,
  Zap,
  Sliders,
  CalendarDays,
  UploadCloud,
  ArrowRight,
  Sparkles,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

export function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [contentTypes, setContentTypes] = useState([]);
  const [topics, setTopics] = useState([]);
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewData, typesData, topicsData, insightsData, recsData] =
        await Promise.all([
          getOverview(),
          getContentTypes(),
          getTopics(),
          getInsights(),
          getRecommendations(),
        ]);

      setOverview(overviewData);
      setContentTypes(typesData.data || []);
      setTopics(topicsData.data || []);
      setInsights(insightsData.insights || []);
      setRecommendations(recsData.recommendations || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullPage message="Aggregating social analytics & intelligence..." />;
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorState
          title="Could not load dashboard data"
          message={error}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  if (!overview) {
    return (
      <EmptyState
        title="No overview data found"
        description="Please upload a dataset or check your backend connection."
        actionLabel="Upload Dataset"
        onAction={() => (window.location.href = '/upload')}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#151D2C] border-[2.5px] border-black shadow-neo">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
            Performance Command Deck
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium">
            Live social engagement signals, algorithmic takeaways, and campaign health metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/predict">
            <Button variant="yellow" size="sm" icon={Zap}>
              Predict Post
            </Button>
          </Link>
          <Link to="/simulator">
            <Button variant="pink" size="sm" icon={Sliders}>
              Simulate
            </Button>
          </Link>
          <Link to="/upload">
            <Button variant="mint" size="sm" icon={UploadCloud}>
              Upload CSV
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI 6 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Posts"
          value={formatNumber(overview.total_posts)}
          subtitle="Analyzed historical social posts"
          icon={FileText}
          trend="+14.2%"
          trendLabel="vs previous cycle"
          trendDirection="up"
          color="yellow"
        />

        <StatCard
          title="Average Engagement Rate"
          value={formatPercent(overview.average_engagement_rate)}
          subtitle="Interactions per reach benchmark"
          icon={Percent}
          trend="+2.1%"
          trendLabel="above platform avg"
          trendDirection="up"
          color="mint"
        />

        <StatCard
          title="Total Engagement"
          value={formatNumber(overview.total_engagement)}
          subtitle="Combined likes, comments, shares"
          icon={Heart}
          trend="+8,420"
          trendLabel="30d interactions"
          trendDirection="up"
          color="pink"
        />

        <StatCard
          title="Best Content Type"
          value={overview.best_content_type}
          subtitle="Highest avg engagement format"
          icon={Video}
          trend="8.2% avg"
          trendLabel="retention rate"
          trendDirection="up"
          color="blue"
        />

        <StatCard
          title="Best Topic"
          value={overview.best_topic}
          subtitle="Top performing thematic subject"
          icon={Tag}
          trend="8.6% avg"
          trendLabel="community score"
          trendDirection="up"
          color="yellow"
        />

        <StatCard
          title="Best Posting Time"
          value={overview.best_posting_time}
          subtitle="Peak audience activity window (UTC)"
          icon={Clock}
          trend="+41%"
          trendLabel="traffic surge"
          trendDirection="up"
          color="pink"
        />
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentTypeChart data={contentTypes} />
        <TopicPerformanceChart data={topics} />
      </div>

      {/* Insights & Recommendations Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Insights Card */}
        <Card
          windowControls
          windowTitle="DISCOVERED PATTERNS // INSIGHTS"
          title="Key Algorithmic Insights"
          subtitle="High-impact findings from behavioral data"
          icon={Lightbulb}
          action={
            <Link
              to="/insights"
              className="text-xs text-[#38BDF8] hover:underline font-black font-mono inline-flex items-center gap-1"
            >
              VIEW ALL (5) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="space-y-3 mt-4">
            {insights.slice(0, 3).map((insight, idx) => (
              <div
                key={insight.id}
                className="p-3.5 rounded-xl bg-[#FFFDF5] text-slate-950 border-2 border-black shadow-neo-sm flex items-start justify-between gap-3 hover:translate-x-1 transition-transform"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-black text-white font-mono text-[10px] font-black flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h4 className="text-sm font-black font-display">{insight.title}</h4>
                  </div>
                  <p className="text-xs text-slate-700 font-medium line-clamp-2 pl-7">
                    {insight.description}
                  </p>
                </div>
                <Badge
                  variant={insight.impact === 'high' ? 'mint' : insight.impact === 'medium' ? 'yellow' : 'pink'}
                  size="xs"
                >
                  {insight.impact.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Recommendations Card */}
        <Card
          windowControls
          windowTitle="ACTIONABLE PLAYBOOK // RANKED"
          title="Top Recommendations"
          subtitle="Immediate actionable strategic opportunities"
          icon={Sparkles}
          action={
            <Link
              to="/recommendations"
              className="text-xs text-[#38BDF8] hover:underline font-black font-mono inline-flex items-center gap-1"
            >
              FULL RANKINGS <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          <div className="space-y-3 mt-4">
            {recommendations.slice(0, 2).map((rec) => (
              <div
                key={rec.rank}
                className="p-4 rounded-xl bg-[#FFFDF5] text-slate-950 border-2 border-black shadow-neo-sm space-y-2 hover:translate-x-1 transition-transform"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#FFD12E] text-black font-mono text-xs font-black border border-black shadow-[1px_1px_0px_#000]">
                      RANK #{rec.rank}
                    </span>
                    <span className="text-sm font-black font-display">
                      {rec.content_type} • {rec.topic}
                    </span>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-[#2DD4BF] text-slate-950 border border-black">
                    Score {rec.score}
                  </span>
                </div>

                <div className="text-xs font-mono font-bold text-slate-600 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-black" />
                    {rec.day}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-black" />
                    {rec.time_range} UTC
                  </span>
                </div>

                {rec.reasons && rec.reasons.length > 0 && (
                  <p className="text-xs text-slate-800 font-semibold italic border-l-2 border-black pl-2 mt-1">
                    "{rec.reasons[0]}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
