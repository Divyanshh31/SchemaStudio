import React, { useState } from 'react';
import { GitCommit, Activity, Play, Code, Check, Copy, AlertCircle, Layers, Zap } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function ExplainVisualizer() {
  const [query, setQuery] = useState(`EXPLAIN ANALYZE
SELECT c.name, SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM categories c
JOIN products p ON p.category_id = c.id
JOIN order_items oi ON oi.product_id = p.id
GROUP BY c.id, c.name
ORDER BY total_revenue DESC;`);

  const [copied, setCopied] = useState(false);

  const planNodes = [
    {
      id: 'node_1',
      type: 'Sort',
      cost: '142.10..143.20',
      rows: 5,
      actualTime: '12.4ms',
      detail: 'Sort Key: (SUM(oi.quantity * oi.unit_price)) DESC',
      children: [
        {
          id: 'node_2',
          type: 'HashAggregate',
          cost: '110.50..135.00',
          rows: 48,
          actualTime: '9.8ms',
          detail: 'Group Key: c.id, c.name',
          children: [
            {
              id: 'node_3',
              type: 'Hash Join (orders -> order_items)',
              cost: '42.10..88.40',
              rows: 98400,
              actualTime: '7.1ms',
              detail: 'Hash Cond: (oi.product_id = p.id)',
              children: [
                {
                  id: 'node_4',
                  type: 'Index Scan on idx_order_items_product_id',
                  cost: '0.42..35.10',
                  rows: 98400,
                  actualTime: '3.2ms',
                  detail: 'Index Cond: (product_id IS NOT NULL)'
                },
                {
                  id: 'node_5',
                  type: 'Seq Scan on products',
                  cost: '0.00..28.50',
                  rows: 3420,
                  actualTime: '1.4ms',
                  detail: 'Filter: (price > 0)'
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderNode = (node, depth = 0) => (
    <div key={node.id} className="space-y-2 pl-4 border-l-2 border-indigo-200 my-2">
      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1 font-mono text-xs hover:border-indigo-300 transition-all shadow-sm">
        <div className="flex items-center justify-between">
          <span className="font-bold text-indigo-700 flex items-center gap-2">
            <GitCommit className="w-3.5 h-3.5 text-emerald-600" />
            <span>{node.type}</span>
          </span>
          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
            TIME: {node.actualTime}
          </span>
        </div>
        <div className="text-[11px] text-slate-700 font-semibold">{node.detail}</div>
        <div className="text-[10px] text-slate-500 flex items-center gap-3 pt-0.5 font-mono">
          <span>COST: {node.cost}</span>
          <span>EST. ROWS: {node.rows.toLocaleString()}</span>
        </div>
      </div>

      {node.children && node.children.map((child) => renderNode(child, depth + 1))}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <SpotlightCard className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">VISUAL EXPLAIN QUERY EXECUTION PLANNER</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Inspect physical operator tree nodes, join algorithms, hash aggregates, and execution latency bottlenecks.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1.5 font-mono text-xs font-semibold"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />}
            <span>{copied ? 'COPIED EXPLAIN' : 'COPY EXPLAIN QUERY'}</span>
          </button>
        </div>

        {/* Query Input Area */}
        <div className="space-y-2 font-mono text-xs">
          <span className="text-slate-500 font-semibold uppercase">SQL QUERY FOR EXPLAIN TREE ANALYSIS:</span>
          <textarea
            rows={4}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </SpotlightCard>

      {/* Execution Tree Output */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>PHYSICAL QUERY PLAN TREE (TOTAL EXECUTION TIME: 12.4ms)</span>
          </h3>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">1 INDEX SCAN • 1 SEQ SCAN</span>
        </div>

        <div className="pt-1">
          {planNodes.map((node) => renderNode(node))}
        </div>
      </div>
    </div>
  );
}
