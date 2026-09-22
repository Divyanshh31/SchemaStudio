import React, { useState } from 'react';
import { History, Star, Search, Copy, Check, Play, Clock, Code, Filter } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function QueryHistory({ onReRunQuery }) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [copiedIdx, setCopiedIdx] = useState(null);

  const [historyItems, setHistoryItems] = useState([
    { id: 1, query: 'SELECT c.name, SUM(oi.quantity * oi.unit_price) AS total_revenue FROM categories c JOIN products p ON p.category_id = c.id JOIN order_items oi ON oi.product_id = p.id GROUP BY c.id, c.name ORDER BY total_revenue DESC LIMIT 5;', durationMs: 14, rows: 5, status: 'SUCCESS', timestamp: '2026-09-22 23:55:12 UTC', isFavorite: true, tag: 'Analytics' },
    { id: 2, query: 'EXPLAIN ANALYZE SELECT * FROM order_items WHERE order_id = $1;', durationMs: 420, rows: 98400, status: 'EXPLAIN', timestamp: '2026-09-22 23:50:00 UTC', isFavorite: true, tag: 'Performance' },
    { id: 3, query: 'SELECT u.full_name, COUNT(o.id) AS total_orders FROM users u JOIN orders o ON o.user_id = u.id GROUP BY u.id, u.full_name LIMIT 10;', durationMs: 18, rows: 10, status: 'SUCCESS', timestamp: '2026-09-22 23:42:15 UTC', isFavorite: false, tag: 'Reporting' },
    { id: 4, query: 'ALTER TABLE order_items ADD CONSTRAINT fk_order_items_orders FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;', durationMs: 8, rows: 0, status: 'SUCCESS', timestamp: '2026-09-22 23:30:00 UTC', isFavorite: false, tag: 'Migration' }
  ]);

  const toggleFavorite = (id) => {
    setHistoryItems(
      historyItems.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  };

  const filtered = historyItems.filter((item) => {
    if (activeFilter === 'FAVORITES') return item.isFavorite;
    if (activeFilter === 'EXPLAIN') return item.status === 'EXPLAIN';
    return true;
  });

  const handleCopy = (idx, text) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <SpotlightCard className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">QUERY EXECUTION HISTORY & SAVED FAVORITES</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Audit log of executed SQL queries, execution latency benchmarks, and tagged saved queries.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-3 py-1 rounded-md border border-amber-200 font-semibold">
            {historyItems.filter((h) => h.isFavorite).length} FAVORITE QUERIES SAVED
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 font-mono text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-500 font-semibold">FILTER:</span>
          {['ALL', 'FAVORITES', 'EXPLAIN'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 rounded-md transition-all font-semibold ${
                activeFilter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </SpotlightCard>

      {/* History Items */}
      <div className="space-y-3">
        {filtered.map((item, idx) => (
          <div key={item.id} className="surface-card p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button onClick={() => toggleFavorite(item.id)} className="text-amber-500 hover:scale-110 transition-transform">
                  <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current text-amber-500' : 'text-slate-300'}`} />
                </button>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded border border-indigo-200 font-bold">
                  {item.tag}
                </span>
                <span className="text-slate-400 text-[11px] font-mono">{item.timestamp}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-emerald-700 font-bold">{item.durationMs} ms ({item.rows} rows)</span>
                <button
                  onClick={() => handleCopy(idx, item.query)}
                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1 text-[11px] font-semibold"
                >
                  {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-indigo-600" />}
                  <span>{copiedIdx === idx ? 'COPIED' : 'COPY'}</span>
                </button>
              </div>
            </div>

            <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-emerald-400 text-xs overflow-x-auto font-mono">
              {item.query}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
