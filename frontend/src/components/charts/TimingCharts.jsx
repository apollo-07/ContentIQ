import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card } from '../common/Card';
import { formatHour } from '../../utils/formatters';

const CustomDayTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FFFDF5] text-slate-950 border-2 border-black p-3 rounded-xl shadow-neo text-xs font-bold font-mono">
        <p className="text-sm font-extrabold font-display mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <span className="text-slate-700">Avg Engagement:</span>
          <span className="font-extrabold text-[#6366F1]">{payload[0].value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

const CustomHourTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FFFDF5] text-slate-950 border-2 border-black p-3 rounded-xl shadow-neo text-xs font-bold font-mono">
        <p className="text-sm font-extrabold font-display mb-1">{formatHour(label)} UTC</p>
        <div className="flex items-center gap-2">
          <span className="text-slate-700">Avg Engagement:</span>
          <span className="font-extrabold text-[#0D9488]">{payload[0].value}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export function DayPerformanceChart({ data = [], title = 'Day of Week Performance' }) {
  return (
    <Card
      windowControls
      windowTitle="TIMING // DAY DISTRIBUTION"
      title={title}
      subtitle="Engagement rate distribution by day"
    >
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A374A" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              tickFormatter={(val) => val.slice(0, 3)}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomDayTooltip />} />
            <Bar
              dataKey="average_engagement_rate"
              fill="#FFD12E"
              stroke="#000000"
              strokeWidth={2}
              radius={[6, 6, 0, 0]}
              maxBarSize={36}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function HourlyPerformanceChart({ data = [], title = 'Hourly Engagement Heatmap' }) {
  const formattedData = data.map((d) => ({
    ...d,
    hourLabel: `${d.hour}:00`,
  }));

  return (
    <Card
      windowControls
      windowTitle="TIMING // 24-HOUR RADAR"
      title={title}
      subtitle="24-hour engagement activity curve"
    >
      <div className="h-64 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="neoHourGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A374A" vertical={false} />
            <XAxis
              dataKey="hour"
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              tickFormatter={(val) => `${val}h`}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomHourTooltip />} />
            <Area
              type="monotone"
              dataKey="average_engagement_rate"
              stroke="#2DD4BF"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#neoHourGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
