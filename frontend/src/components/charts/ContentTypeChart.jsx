import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Card } from '../common/Card';

const NEO_COLORS = ['#FFD12E', '#FF6B97', '#2DD4BF', '#38BDF8', '#C084FC'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#FFFDF5] text-slate-950 border-2 border-black p-3 rounded-xl shadow-neo text-xs font-bold font-mono">
        <p className="text-sm font-extrabold font-display mb-1.5 border-b border-black/30 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 my-1">
            <span className="w-3 h-3 rounded-sm border border-black" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-700 capitalize">{entry.name}:</span>
            <span className="font-extrabold text-black">
              {entry.name.includes('rate') || entry.name.includes('(%)') ? `${entry.value}%` : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ContentTypeChart({ data = [], title = 'Content Type Performance' }) {
  const chartData = data.map((item) => ({
    name: item.content_type,
    'Avg Engagement (%)': Number(item.average_engagement_rate),
    'Median Engagement (%)': Number(item.median_engagement_rate),
    'Post Count': Number(item.post_count),
  }));

  return (
    <Card
      windowControls
      windowTitle="CHARTS // CONTENT FORMATS"
      title={title}
      subtitle="Average and median engagement rates across content formats"
    >
      <div className="h-72 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A374A" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              fontSize={12}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={12}
              fontWeight={700}
              tickLine={false}
              axisLine={{ stroke: '#000000', strokeWidth: 2 }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', fontWeight: 700, paddingTop: '10px' }}
              iconType="square"
            />
            <Bar
              dataKey="Avg Engagement (%)"
              fill="#FFD12E"
              stroke="#000000"
              strokeWidth={2}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={NEO_COLORS[index % NEO_COLORS.length]} />
              ))}
            </Bar>
            <Bar
              dataKey="Median Engagement (%)"
              fill="#38BDF8"
              stroke="#000000"
              strokeWidth={2}
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
