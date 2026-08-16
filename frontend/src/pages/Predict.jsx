import React, { useState } from 'react';
import { predictPerformance } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getPredictionBadgeColor } from '../utils/formatters';
import {
  Zap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Tag,
  Calendar,
  Hash,
  AlignLeft,
  Users,
  Cpu,
  RefreshCw,
} from 'lucide-react';

export function Predict() {
  const [formData, setFormData] = useState({
    content_type: 'Reel',
    topic: 'Behind the Scenes',
    day: 'Saturday',
    posting_hour: 19,
    caption_length: 180,
    hashtag_count: 5,
    followers: 24500,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const contentTypes = ['Reel', 'Carousel', 'Single Image', 'Video (Long)', 'Text / Quote'];
  const topics = [
    'Behind the Scenes',
    'Product',
    'Tutorial & Tips',
    'Industry Insights',
    'User Testimonials',
    'Company Culture',
  ];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await predictPerformance(formData);
      setResult(data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError(
        err.response?.data?.detail || err.message || 'Failed to generate performance prediction.'
      );
    } finally {
      setLoading(false);
    }
  };

  const badgeStyles = result ? getPredictionBadgeColor(result.prediction) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neo-yellow/20 border-2 border-neo-yellow text-neo-yellow text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            ML Reach Forecaster
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Post Performance Predictor
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Input draft content attributes to forecast reach tier, probability, and AI-assisted refinements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card title="POST CONFIGURATION" subtitle="Define draft content parameters" icon={Zap}>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Content Type & Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-neo-indigo" />
                    Content Type
                  </label>
                  <select
                    name="content_type"
                    value={formData.content_type}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-neo-indigo focus:ring-0 transition-colors shadow-neo-sm"
                  >
                    {contentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-neo-pink" />
                    Content Topic
                  </label>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-neo-pink focus:ring-0 transition-colors shadow-neo-sm"
                  >
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Day and Hour */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neo-mint" />
                    Scheduled Day
                  </label>
                  <select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-neo-mint focus:ring-0 transition-colors shadow-neo-sm"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-neo-yellow" />
                      Posting Hour (UTC)
                    </span>
                    <span className="text-neo-yellow font-black px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-xs">
                      {formData.posting_hour}:00
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="23"
                    step="1"
                    name="posting_hour"
                    value={formData.posting_hour}
                    onChange={handleChange}
                    className="w-full h-2.5 bg-slate-800 border border-slate-700 rounded-lg appearance-none cursor-pointer accent-neo-yellow"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:00</span>
                  </div>
                </div>
              </div>

              {/* Caption Length, Hashtag Count, Followers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <AlignLeft className="w-3.5 h-3.5 text-neo-indigo" />
                    Caption (Chars)
                  </label>
                  <input
                    type="number"
                    name="caption_length"
                    min="0"
                    max="2200"
                    value={formData.caption_length}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-neo-indigo focus:ring-0 shadow-neo-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-neo-pink" />
                    Hashtags Count
                  </label>
                  <input
                    type="number"
                    name="hashtag_count"
                    min="0"
                    max="30"
                    value={formData.hashtag_count}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-neo-pink focus:ring-0 shadow-neo-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-200 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-neo-mint" />
                    Account Followers
                  </label>
                  <input
                    type="number"
                    name="followers"
                    min="10"
                    value={formData.followers}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-3.5 py-2 text-sm font-bold text-white focus:outline-none focus:border-neo-mint focus:ring-0 shadow-neo-sm font-mono"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-4"
                isLoading={loading}
                icon={Zap}
                iconPosition="left"
              >
                RUN ML PERFORMANCE PREDICTION
              </Button>
            </form>
          </Card>
        </div>

        {/* Prediction Results Display Column */}
        <div className="lg:col-span-5 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500 text-rose-300 text-xs font-bold flex items-start gap-3 shadow-neo">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <Card className="p-8 text-center">
              <LoadingSpinner message="Running inference through trained ML model..." />
            </Card>
          )}

          {!loading && !result && (
            <Card className="p-8 text-center border-dashed">
              <div className="w-14 h-14 rounded-2xl bg-neo-yellow/20 border-2 border-neo-yellow text-neo-yellow flex items-center justify-center mx-auto mb-3 shadow-neo-sm">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-display font-black text-white">Awaiting Post Evaluation</h4>
              <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                Configure your draft parameters on the left and click predict to see performance probability.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={() => handleSubmit()}
              >
                Evaluate Sample Post
              </Button>
            </Card>
          )}

          {!loading && result && (
            <Card glow className="space-y-6">
              {/* Prediction Banner */}
              <div className="text-center pb-4 border-b-2 border-slate-800">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-black block mb-2 font-mono">
                  PREDICTED PERFORMANCE TIER
                </span>

                <div className="inline-block">
                  <span
                    className={`inline-flex items-center px-6 py-2.5 rounded-2xl text-xl font-display font-black border-2 uppercase tracking-wider shadow-neo ${
                      result.prediction === 'HIGH'
                        ? 'bg-emerald-400 text-slate-950 border-slate-950'
                        : result.prediction === 'MEDIUM'
                        ? 'bg-neo-yellow text-slate-950 border-slate-950'
                        : 'bg-neo-pink text-slate-950 border-slate-950'
                    }`}
                  >
                    {result.prediction} PERFORMANCE
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono font-bold">
                  <Cpu className="w-3.5 h-3.5 text-neo-indigo" />
                  <span>MODEL: </span>
                  <strong className="text-white">{result.model || 'RandomForest'}</strong>
                </div>
              </div>

              {/* Segmented Speed / Confidence Power Meter (Inspired by inspo Image 1) */}
              <div className="space-y-3 bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-4 shadow-neo-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-300 font-mono tracking-wider">
                    CONFIDENCE POWER METER:
                  </span>
                  <span className="text-lg font-display font-black text-neo-yellow">
                    {Math.round((result.probability || 0) * 100)}%
                  </span>
                </div>
                <ProgressBar
                  value={Math.round((result.probability || 0) * 100)}
                  max={100}
                  variant="segmented"
                  color={
                    result.prediction === 'HIGH'
                      ? 'emerald'
                      : result.prediction === 'MEDIUM'
                      ? 'yellow'
                      : 'pink'
                  }
                  size="lg"
                />
              </div>

              {/* Recommendations list */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="space-y-2 pt-2 border-t-2 border-slate-800">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-neo-yellow" />
                    AI Optimization Directives:
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, idx) => (
                      <li
                        key={idx}
                        className="text-xs font-medium text-slate-200 bg-slate-950/80 p-3 rounded-xl border-2 border-slate-800 flex items-start gap-2.5 shadow-neo-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-neo-mint flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
