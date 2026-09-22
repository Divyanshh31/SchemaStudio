import React from 'react';
import { BarChart3, PieChart, Activity, HardDrive, Zap, ShieldCheck, Database, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import SpotlightCard from './bits/SpotlightCard';
import AnimatedCounter from './bits/AnimatedCounter';

export default function QueryAnalytics() {
  const tableSizes = [
    { table: 'audit_logs', sizeMb: 2840, rows: 450000 },
    { table: 'posts', sizeMb: 1240, rows: 640000 },
    { table: 'order_items', sizeMb: 420, rows: 98400 },
    { table: 'users', sizeMb: 185, rows: 18900 },
    { table: 'products', sizeMb: 45, rows: 3420 }
  ];

  const topQueries = [
    { pattern: 'SELECT * FROM order_items WHERE order_id = $1 ORDER BY id DESC;', calls: 42100, avgMs: 4.2, cpuPercent: 24.5 },
    { pattern: 'SELECT u.full_name, COUNT(o.id) FROM users u JOIN orders o ON ...;', calls: 18400, avgMs: 14.8, cpuPercent: 18.2 },
    { pattern: 'INSERT INTO audit_logs (org_id, actor_id, action, created_at) ...;', calls: 145000, avgMs: 1.1, cpuPercent: 12.8 },
    { pattern: 'UPDATE products SET stock_qty = stock_qty - $1 WHERE id = $2;', calls: 8900, avgMs: 2.4, cpuPercent: 8.4 }
  ];

  const COLORS = ['#4F46E5', '#059669', '#D97706', '#8B5CF6', '#DC2626'];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <SpotlightCard className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">WORKLOAD ANALYTICS & DISK FOOTPRINT</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Inspect top query execution frequencies, CPU consumption, index hit ratios, and table storage footprints.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 font-semibold">
            SHARED BUFFERS: 99.4% HIT RATIO
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-12 gap-3.5 font-mono text-xs pt-1">
          <div className="col-span-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              <span>INDEX HIT RATIO</span>
            </div>
            <div className="text-xl font-bold text-emerald-700 flex items-baseline gap-0.5">
              <AnimatedCounter from={0} to={98.2} duration={1.2} decimals={1} />
              <span>%</span>
            </div>
            <div className="text-[11px] text-slate-500">Optimal Index Coverage</div>
          </div>

          <div className="col-span-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              <span>CACHE HIT RATIO</span>
            </div>
            <div className="text-xl font-bold text-indigo-600 flex items-baseline gap-0.5">
              <AnimatedCounter from={0} to={99.4} duration={1.2} decimals={1} />
              <span>%</span>
            </div>
            <div className="text-[11px] text-slate-500">Buffer Cache Hot</div>
          </div>

          <div className="col-span-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <HardDrive className="w-3.5 h-3.5 text-amber-600" />
              <span>DATABASE DISK SIZE</span>
            </div>
            <div className="text-xl font-bold text-amber-600">4.73 GB</div>
            <div className="text-[11px] text-slate-500">5 Tables Allocated</div>
          </div>

          <div className="col-span-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5 text-slate-600" />
              <span>VACUUM DEAD TUPLES</span>
            </div>
            <div className="text-xl font-bold text-slate-800">0.8%</div>
            <div className="text-[11px] text-emerald-700 font-semibold">Autovacuum Healthy</div>
          </div>
        </div>
      </SpotlightCard>

      {/* Table Size Bar Chart */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-mono font-semibold text-slate-800 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-indigo-600" />
            <span>TABLE DISK STORAGE ALLOCATION (MB)</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Top 5 Largest Tables</span>
        </div>

        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tableSizes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="table" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="sizeMb" fill="#4F46E5" radius={[4, 4, 0, 0]}>
                {tableSizes.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Workload Patterns */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span>MOST FREQUENT QUERY PATTERNS & CPU CONSUMPTION</span>
          </h3>
        </div>

        <div className="space-y-2.5">
          {topQueries.map((q, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-indigo-700">{q.calls.toLocaleString()} CALLS</span>
                <span className="text-emerald-700">AVG: {q.avgMs} ms | CPU: {q.cpuPercent}%</span>
              </div>
              <pre className="text-slate-800 text-[11px] bg-white p-2.5 rounded border border-slate-200 overflow-x-auto font-mono">
                {q.pattern}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
