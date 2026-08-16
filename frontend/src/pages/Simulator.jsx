import React, { useState } from 'react';
import { simulateScenarios } from '../services/api';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getPredictionBadgeColor } from '../utils/formatters';
import {
  Sliders,
  Plus,
  Trash2,
  Play,
  TrendingUp,
  Award,
  Layers,
  Tag,
  Clock,
  Calendar,
  AlertCircle,
  BarChart2,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

export function Simulator() {
  const [scenarios, setScenarios] = useState([
    {
      id: 'sc_1',
      name: 'Scenario A (Reel + Behind Scenes)',
      content_type: 'Reel',
      topic: 'Behind the Scenes',
      day: 'Saturday',
      posting_hour: 19,
    },
    {
      id: 'sc_2',
      name: 'Scenario B (Carousel + Tutorial)',
      content_type: 'Carousel',
      topic: 'Tutorial & Tips',
      day: 'Thursday',
      posting_hour: 18,
    },
    {
      id: 'sc_3',
      name: 'Scenario C (Single Image + Product)',
      content_type: 'Single Image',
      topic: 'Product',
      day: 'Monday',
      posting_hour: 12,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
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

  const addScenario = () => {
    const nextLetter = String.fromCharCode(65 + scenarios.length);
    const newSc = {
      id: 'sc_' + Date.now(),
      name: `Scenario ${nextLetter} (Custom)`,
      content_type: 'Reel',
      topic: 'Tutorial & Tips',
      day: 'Wednesday',
      posting_hour: 20,
    };
    setScenarios([...scenarios, newSc]);
  };

  const removeScenario = (id) => {
    if (scenarios.length <= 1) return;
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const updateScenario = (id, field, value) => {
    setScenarios(
      scenarios.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        scenarios: scenarios.map((s) => ({
          name: s.name,
          content_type: s.content_type,
          topic: s.topic,
          day: s.day,
          posting_hour: Number(s.posting_hour),
        })),
      };
      const data = await simulateScenarios(payload);
      setResults(data.results || []);
    } catch (err) {
      console.error('Simulation failed:', err);
      setError(
        err.response?.data?.detail || err.message || 'Failed to simulate scenario outcomes.'
      );
    } finally {
      setLoading(false);
    }
  };

  const SIM_COLORS = ['#FFD12E', '#FF6B97', '#2DD4BF', '#6366F1', '#38BDF8'];

  return (
    <div className="space-y-8">
      {/* Header & Simulation Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neo-pink/20 border-2 border-neo-pink text-neo-pink text-xs font-black uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            Competitive Sandbox
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight">
            Scenario Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build multiple content variations and run competitive AI simulations to compare predicted outcomes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={addScenario}
            icon={Plus}
          >
            Add Scenario
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={runSimulation}
            isLoading={loading}
            icon={Play}
          >
            Run Comparison Simulation
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500 text-rose-300 text-xs font-bold flex items-start gap-3 shadow-neo">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Scenario Builder Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <Sliders className="w-4 h-4 text-neo-yellow" />
            Active Scenarios ({scenarios.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Configure parameters for each variation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scenarios.map((sc, idx) => (
            <Card key={sc.id} className="space-y-4 relative group" hoverable>
              <div className="flex items-center justify-between gap-2 border-b-2 border-slate-800 pb-3">
                <div className="flex items-center gap-2 flex-1">
                  <Badge variant="sticker" colorIndex={idx} size="xs">
                    0{idx + 1}
                  </Badge>
                  <input
                    type="text"
                    value={sc.name}
                    onChange={(e) => updateScenario(sc.id, 'name', e.target.value)}
                    className="bg-transparent font-bold font-display text-white text-sm focus:outline-none focus:border-b-2 border-neo-yellow w-full"
                  />
                </div>
                {scenarios.length > 1 && (
                  <button
                    onClick={() => removeScenario(sc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-colors"
                    aria-label="Remove scenario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 text-[11px] font-mono">
                    Content Format
                  </label>
                  <select
                    value={sc.content_type}
                    onChange={(e) => updateScenario(sc.id, 'content_type', e.target.value)}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-neo-indigo shadow-neo-sm"
                  >
                    {contentTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 text-[11px] font-mono">
                    Thematic Topic
                  </label>
                  <select
                    value={sc.topic}
                    onChange={(e) => updateScenario(sc.id, 'topic', e.target.value)}
                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-neo-pink shadow-neo-sm"
                  >
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 text-[11px] font-mono">
                      Publish Day
                    </label>
                    <select
                      value={sc.day}
                      onChange={(e) => updateScenario(sc.id, 'day', e.target.value)}
                      className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs font-bold focus:outline-none focus:border-neo-mint shadow-neo-sm"
                    >
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d.slice(0, 3)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold uppercase tracking-wider mb-1 text-[11px] font-mono">
                      Hour (UTC)
                    </label>
                    <select
                      value={sc.posting_hour}
                      onChange={(e) => updateScenario(sc.id, 'posting_hour', Number(e.target.value))}
                      className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-2.5 py-2 text-white text-xs font-bold focus:outline-none focus:border-neo-yellow shadow-neo-sm font-mono"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}:00
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Results Section */}
      {loading && (
        <Card className="p-12 text-center">
          <LoadingSpinner message="Simulating comparative scenario outcomes across ML models..." />
        </Card>
      )}

      {!loading && results && results.length > 0 && (
        <div className="space-y-6 pt-4 border-t-2 border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-display font-black text-white tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-neo-yellow" />
              Simulation Results & Comparison Matrix
            </h3>
            <span className="text-xs text-slate-400 font-mono">Ranked by estimated probability</span>
          </div>

          {/* Comparison Bar Chart */}
          <Card title="PROBABILITY COMPARISON" subtitle="Predicted success probability across all scenarios">
            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={results.map((r) => ({
                    name: r.name,
                    'Probability (%)': Math.round((r.probability || 0) * 100),
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#22272e" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1117',
                      border: '2px solid #000000',
                      borderRadius: '12px',
                      boxShadow: '3px 3px 0px #000000',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                    }}
                  />
                  <Bar dataKey="Probability (%)" radius={[6, 6, 0, 0]} maxBarSize={50}>
                    {results.map((_, index) => (
                      <Cell key={`sim-cell-${index}`} fill={SIM_COLORS[index % SIM_COLORS.length]} stroke="#000" strokeWidth={1.5} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Side by Side Result Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((res, idx) => {
              return (
                <Card
                  key={idx}
                  className={`relative ${
                    idx === 0 ? 'border-2 border-emerald-400 shadow-neo' : ''
                  }`}
                  hoverable
                >
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <span className="text-sm font-display font-black text-white truncate">
                      {res.name}
                    </span>
                    {idx === 0 && (
                      <Badge variant="sticker" colorIndex={2} size="xs">
                        TOP OUTCOME
                      </Badge>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border-2 border-slate-800 text-center mb-4 shadow-neo-sm">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 block mb-1 font-mono font-bold">
                      PREDICTION TIER
                    </span>
                    <span
                      className={`inline-block px-3 py-1 rounded-xl text-xs font-black uppercase border-2 shadow-neo-sm ${
                        res.prediction === 'HIGH'
                          ? 'bg-emerald-400 text-slate-950 border-slate-950'
                          : res.prediction === 'MEDIUM'
                          ? 'bg-neo-yellow text-slate-950 border-slate-950'
                          : 'bg-neo-pink text-slate-950 border-slate-950'
                      }`}
                    >
                      {res.prediction}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-slate-400 font-bold">Success Probability:</span>
                      <strong className="text-white font-black">
                        {Math.round((res.probability || 0) * 100)}%
                      </strong>
                    </div>
                    <ProgressBar
                      value={Math.round((res.probability || 0) * 100)}
                      max={100}
                      variant="segmented"
                      color={
                        res.prediction === 'HIGH'
                          ? 'emerald'
                          : res.prediction === 'MEDIUM'
                          ? 'yellow'
                          : 'pink'
                      }
                      size="sm"
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

