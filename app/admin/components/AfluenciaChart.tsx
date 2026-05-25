"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DATA = [
  { dia: "Lun", clientes: 48 },
  { dia: "Mar", clientes: 62 },
  { dia: "Mié", clientes: 55 },
  { dia: "Jue", clientes: 71 },
  { dia: "Vie", clientes: 93 },
  { dia: "Sáb", clientes: 118 },
  { dia: "Dom", clientes: 104 },
];

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e8eaed",
        borderRadius: 10,
        padding: "8px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        fontSize: "0.82rem",
        fontFamily: "var(--adm-font, system-ui)",
        color: "#1a1d23",
        pointerEvents: "none",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
      <div style={{ color: "#10b981" }}>{payload[0].value} clientes</div>
    </div>
  );
}

export default function AfluenciaChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="afluenciaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e8eaed"
          vertical={false}
        />
        <XAxis
          dataKey="dia"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#9ca3af", fontFamily: "var(--adm-font, system-ui)" }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#9ca3af", fontFamily: "var(--adm-font, system-ui)" }}
          dx={-4}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#10b981", strokeWidth: 1, strokeDasharray: "4 4" }} />
        <Area
          type="monotone"
          dataKey="clientes"
          stroke="#10b981"
          strokeWidth={2.5}
          fill="url(#afluenciaGradient)"
          dot={false}
          activeDot={{ r: 5, fill: "#10b981", stroke: "#fff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
