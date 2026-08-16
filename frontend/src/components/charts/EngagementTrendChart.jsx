import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Card } from '../common/Card';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FFFDF5] text-slate-950 border-2 border-black p-3.5 rounded-xl shadow-neo text-xs font-bold font-mono">
        <p className="text-sm font-extrabold font-display mb-2 border-b border-black/30 pb-1">Period: {label}</p>
        {payload.map((entry, index) => (
          <div key={`trend-${index}`} className="flex items-center justify-between gap-4 my-1">
            <span className="text-slate-700 capitalize">{entry.name}:</span>
            <span className="font-extrabold text-black">
              {entry.dataKey === 'engagement_rate' ? `${entry.value}%` : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function EngagementTrendChart({ data = [], title = 'Engagement Trends Over Time' }) {
  return (
    <Card
      windowControls
      windowTitle="ANALYTICS // LONGITUDINAL TRAJECTORY"
      title={title}
      subtitle="Historical engagement rate progression and weekly post velocity"
    >
      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="neoTrendGrad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD12E" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#FFD12E" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="neoTrendGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B97" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#FF6B97" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A374A" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#FFD12E"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              tickFormatter={(val) => `${val}%`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#FF6B97"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '8px' }}
              iconType="square"
            />
            <Area
              yAxisId="left"
              type="monotone"
              name="Engagement Rate (%)"
              dataKey="engagement_rate"
              stroke="#FFD12E"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#neoTrendGrad1)"
            />
            <Area
              yAxisId="right"
              type="monotone"
              name="Published Posts"
              dataKey="posts"
              stroke="#FF6B97"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#neoTrendGrad2)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
