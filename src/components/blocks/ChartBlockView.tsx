import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Check, Copy } from "lucide-react";
import type { ChartBlock, ChartDataPoint } from "../../types/blocks";

interface ChartBlockViewProps {
  block: ChartBlock;
}

const SERIES_COLORS = [
  "var(--blue-700)",
  "var(--green-700)",
  "var(--amber-700)",
  "var(--purple-700)",
  "var(--pink-700)",
  "var(--teal-700)",
];

const AXIS_TICK_STYLE = { fill: "var(--gray-800)", fontSize: 12 };
const GRID_STROKE = "var(--gray-alpha-300)";
const TOOLTIP_STYLE = {
  background: "var(--background-200)",
  border: "1px solid var(--gray-alpha-400)",
  borderRadius: "var(--radius-sm)",
  fontSize: 12,
  color: "var(--gray-1000)",
};

function ChartHeader({
  title,
  data,
}: {
  title?: string;
  data: ChartDataPoint[];
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="mb-2 flex items-center justify-between gap-2">
      <span className="text-sm font-medium text-gray-1000">
        {title ?? "Chart"}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        title="Copy data sebagai JSON"
        className="flex items-center gap-1 rounded-[4px] px-1.5 py-1 text-xs text-gray-800 transition-colors hover:bg-gray-alpha-200 hover:text-gray-1000">
        {copied ? <Check size={13} /> : <Copy size={13} />}
        Data
      </button>
    </div>
  );
}

export function ChartBlockView({ block }: ChartBlockViewProps) {
  const { chartType, title, xKey, dataKeys, data } = block;

  if (chartType === "pie") {
    const valueKey = dataKeys[0];
    return (
      <div className="mb-3 rounded-(--radius-md) border border-gray-alpha-300 bg-background-200 p-3">
        <ChartHeader title={title} data={data} />
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={(entry) =>
                String((entry as unknown as ChartDataPoint)[xKey])
              }>
              {data.map((_, i) => (
                <Cell key={i} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chartType === "scatter") {
    return (
      <div className="mb-3 rounded-(--radius-md) border border-gray-alpha-300 bg-background-200 p-3">
        <ChartHeader title={title} data={data} />
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart>
            <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" />
            <XAxis dataKey={xKey} tick={AXIS_TICK_STYLE} />
            <YAxis tick={AXIS_TICK_STYLE} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {dataKeys.map((key, i) => (
              <Scatter
                key={key}
                name={key}
                data={data}
                dataKey={key}
                fill={SERIES_COLORS[i % SERIES_COLORS.length]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const ChartComponent =
    chartType === "bar"
      ? BarChart
      : chartType === "area"
        ? AreaChart
        : LineChart;

  return (
    <div className="mb-3 rounded-(--radius-md) border border-gray-alpha-300 bg-background-200 p-3">
      <ChartHeader title={title} data={data} />
      <ResponsiveContainer width="100%" height={280}>
        <ChartComponent data={data}>
          <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" />
          <XAxis dataKey={xKey} tick={AXIS_TICK_STYLE} />
          <YAxis tick={AXIS_TICK_STYLE} />
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {dataKeys.map((key, i) => {
            const color = SERIES_COLORS[i % SERIES_COLORS.length];
            if (chartType === "bar") {
              return (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={color}
                  radius={[4, 4, 0, 0]}
                />
              );
            }
            if (chartType === "area") {
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.15}
                />
              );
            }
            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
