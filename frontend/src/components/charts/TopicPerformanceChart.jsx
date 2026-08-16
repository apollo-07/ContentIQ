import React from 'react';
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
import { Card } from '../common/Card';

const TOPIC_NEO_COLORS = ['#FFD12E', '#FF6B97', '#2DD4BF', '#38BDF8', '#C084FC', '#A3E635'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#FFFDF5] text-slate-950 border-2 border-black p-3 rounded-xl shadow-neo text-xs font-bold font-mono">
        <p className="text-sm font-extrabold font-display mb-1.5 border-b border-black/30 pb-1">{data.topic}</p>
        <div className="flex items-center justify-between gap-4 my-1">
          <span className="text-slate-700">Avg Engagement:</span>
          <span className="font-extrabold text-[#0D9488]">{data.average_engagement_rate}%</span>
        </div>
        <div className="flex items-center justify-between gap-4 my-1">
          <span className="text-slate-700">Median Rate:</span>
          <span className="font-extrabold text-black">{data.median_engagement_rate}%</span>
        </div>
        <div className="flex items-center justify-between gap-4 my-1">
          <span className="text-slate-700">Total Posts:</span>
          <span className="font-extrabold text-black">{data.post_count}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function TopicPerformanceChart({ data = [], title = 'Topic Performance' }) {
  const sortedData = [...data].sort(
    (a, b) => Number(b.average_engagement_rate) - Number(a.average_engagement_rate)
  );

  return (
    <Card
      windowControls
      windowTitle="CHARTS // TOPIC RESONANCE"
      title={title}
      subtitle="Ranked topic categories by average engagement rate"
    >
      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={sortedData}
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2A374A" horizontal={false} />
            <XAxis
              type="number"
              stroke="#94A3B8"
              fontSize={12}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              tickFormatter={(val) => `${val}%`}
            />
            <YAxis
              dataKey="topic"
              type="category"
              stroke="#94A3B8"
              fontSize={11}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              width={110}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="average_engagement_rate"
              stroke="#000000"
              strokeWidth={2}
              radius={[0, 6, 6, 0]}
              maxBarSize={26}
            >
              {sortedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={TOPIC_NEO_COLORS[index % TOPIC_NEO_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
