import React, { useState, useEffect } from 'react';
import { Activity, Play, Square, Zap, Server, ShieldCheck, Gauge, AlertTriangle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import SpotlightCard from './bits/SpotlightCard';
import AnimatedCounter from './bits/AnimatedCounter';

export default function PerformanceSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [qps, setQps] = useState(1240);
  const [readWriteRatio, setReadWriteRatio] = useState('80:20');
  const [latencyHistory, setLatencyHistory] = useState([
    { time: '12:00', avgMs: 12, p99Ms: 45, qps: 1100 },
    { time: '12:01', avgMs: 14, p99Ms: 52, qps: 1180 },
    { time: '12:02', avgMs: 11, p99Ms: 38, qps: 1210 },
    { time: '12:03', avgMs: 15, p99Ms: 60, qps: 1240 },
    { time: '12:04', avgMs: 13, p99Ms: 42, qps: 1250 }
  ]);

  const [slowQueries, setSlowQueries] = useState([
    { id: 'q_981', query: 'SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at DESC;', latencyMs: 420, rows: 98400, indexUsed: false },
    { id: 'q_982', query: 'SELECT p.title, COUNT(*) FROM products p GROUP BY p.category_id;', latencyMs: 280, rows: 3420, indexUsed: false }
  ]);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        const now = new Date();
        const timeStr = `${now.getMinutes()}:${now.getSeconds() < 10 ? '0' : ''}${now.getSeconds()}`;
        const newAvg = Math.floor(Math.random() * 8) + 10;
        const newP99 = Math.floor(Math.random() * 25) + 35;
        const newQps = qps + Math.floor(Math.random() * 100) - 50;

        setLatencyHistory((prev) => [
          ...prev.slice(-9),
          { time: timeStr, avgMs: newAvg, p99Ms: newP99, qps: newQps }
        ]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isRunning, qps]);

  return (
    <div className="space-y-5">
      {/* Configuration & Controls Header */}
      <SpotlightCard className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">REAL-TIME PRODUCTION LOAD & TRAFFIC SIMULATOR</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Simulate high-concurrency database queries, track latency metrics, and detect slow queries.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-2 rounded-lg font-mono font-semibold text-xs flex items-center gap-2 transition-all ${
                isRunning
                  ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
              }`}
            >
              {isRunning ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isRunning ? 'STOP TRAFFIC SIMULATION' : 'START TRAFFIC SIMULATION'}</span>
            </button>
          </div>
        </div>

        {/* Live Gauges & Controls */}
        <div className="grid grid-cols-12 gap-3.5 font-mono text-xs pt-1">
          <div className="col-span-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              <span>THROUGHPUT (QPS)</span>
            </div>
            <div className="text-xl font-bold text-indigo-600 flex items-baseline gap-1">
              <AnimatedCounter from={1000} to={qps} duration={1} />
              <span className="text-xs text-slate-500">QPS</span>
            </div>
            <div className="text-[11px] text-slate-500">Simulated Concurrent Load</div>
          </div>

          <div className="col-span-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Gauge className="w-3.5 h-3.5 text-emerald-600" />
              <span>AVG LATENCY / P99</span>
            </div>
            <div className="text-xl font-bold text-emerald-700">
              {latencyHistory[latencyHistory.length - 1]?.avgMs || 12} ms / {latencyHistory[latencyHistory.length - 1]?.p99Ms || 45} ms
            </div>
            <div className="text-[11px] text-slate-500">Under 50ms SLA Target</div>
          </div>

          <div className="col-span-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Server className="w-3.5 h-3.5 text-amber-600" />
              <span>ACTIVE POOL CONNECTIONS</span>
            </div>
            <div className="text-xl font-bold text-amber-600">42 / 100</div>
            <div className="text-[11px] text-slate-500">PgBouncer Transaction Pool</div>
          </div>
        </div>
      </SpotlightCard>

      {/* Latency Chart */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-mono font-semibold text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span>REAL-TIME LATENCY (ms) & QPS TIMELINE</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Updating every 2s</span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="time" stroke="#64748B" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748B" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '8px', color: '#0F172A', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="avgMs" name="Avg Latency (ms)" stroke="#059669" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="p99Ms" name="P99 Latency (ms)" stroke="#D97706" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Slow Query Alert Log */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-mono font-semibold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>SLOW QUERIES LOG (&gt; 100ms LATENCY THRESHOLD)</span>
          </h3>
          <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-semibold">2 Bottlenecks Detected</span>
        </div>

        <div className="space-y-2.5">
          {slowQueries.map((sq) => (
            <div key={sq.id} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-red-700 font-bold">{sq.id} - Latency: {sq.latencyMs} ms</span>
                <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 font-semibold">
                  UNINDEXED SCAN
                </span>
              </div>
              <pre className="text-slate-800 text-[11px] bg-white p-2.5 rounded border border-slate-200 overflow-x-auto font-mono">
                {sq.query}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
