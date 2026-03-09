"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

interface CostComparisonChartProps {
  data: readonly ChartDataItem[];
  costRatio: number;
  className?: string;
}

function formatTooltipValue(value: number): string {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value}`;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: ChartDataItem }>;
}) => {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="glass rounded-lg px-4 py-3 shadow-2xl" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
      <p className="font-medium text-zinc-100">{item.name}</p>
      <p className="text-sm text-zinc-400 mt-0.5">
        {item.value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
      </p>
    </div>
  );
};

export function CostComparisonChart({
  data,
  costRatio,
  className = "",
}: CostComparisonChartProps) {
  const chartData = data.map((d) => ({ ...d }));

  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-zinc-100">
          Interceptor vs Drone Cost
        </h3>
        <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400 ring-1 ring-red-500/20">
          Cost ratio: {costRatio}:1
        </span>
      </div>
      <div className="w-full" style={{ height: 256 }}>
        <ResponsiveContainer width="100%" height={256}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
            layout="vertical"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              horizontal={false}
            />
            <XAxis
              type="number"
              tickFormatter={(v) => formatTooltipValue(v)}
              stroke="#52525b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
              stroke="#52525b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
