import React, { useState } from 'react';
import { Zap, Check, Copy, Code, ArrowUpRight, Play, AlertTriangle, CheckCircle2 } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function IndexAdvisor() {
  const [appliedIndexes, setAppliedIndexes] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const recommendations = [
    {
      id: 'idx_rec_01',
      table: 'order_items',
      columns: ['order_id', 'product_id'],
      type: 'COMPOSITE BTREE INDEX',
      impact: '+4.8x Speedup (450ms -> 94ms)',
      sizeMb: 24,
      reason: 'Reduces 98.4K row sequential scans during joined order revenue aggregation queries.',
      sql: 'CREATE INDEX CONCURRENTLY idx_order_items_order_prod ON order_items(order_id, product_id);'
    },
    {
      id: 'idx_rec_02',
      table: 'products',
      columns: ['category_id'],
      type: 'SINGLE COLUMN BTREE',
      impact: '+2.1x Speedup (180ms -> 85ms)',
      sizeMb: 8,
      reason: 'Eliminates sequential scans when filtering products catalog by category.',
      sql: 'CREATE INDEX CONCURRENTLY idx_products_category ON products(category_id);'
    },
    {
      id: 'idx_rec_03',
      table: 'audit_logs',
      columns: ['org_id', 'created_at DESC'],
      type: 'COMPOSITE COVERING INDEX',
      impact: '+6.2x Speedup (920ms -> 148ms)',
      sizeMb: 68,
      reason: 'Accelerates tenant security log timeline queries across 450K rows.',
      sql: 'CREATE INDEX CONCURRENTLY idx_audit_logs_org_created ON audit_logs(org_id, created_at DESC);'
    }
  ];

  const handleApplyIndex = (id) => {
    setAppliedIndexes((prev) => [...prev, id]);
  };

  const handleCopySql = (id, sql) => {
    navigator.clipboard.writeText(sql);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <SpotlightCard className="p-4 rounded-md border border-[#DDE0DA] bg-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-[#0E9384] text-white flex items-center justify-center font-bold">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#15181D] font-heading">Workload index advisor</h2>
              <p className="text-xs text-[#4B5157]">
                AI performance tuning engine analyzing query execution plans to recommend optimal indexes.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-[#0E9384] bg-[#E6F7F5] px-2.5 py-1 rounded-sm border border-[#99E3D8] font-semibold tabular-nums">
            Gain: +4.3x average latency reduction
          </span>
        </div>
      </SpotlightCard>

      {/* AI Recommendations Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[#4B5157]">
          <span className="font-semibold text-[#15181D]">
            AI recommended indexes ({recommendations.length})
          </span>
          <span className="tabular-nums">Applied: {appliedIndexes.length} / {recommendations.length}</span>
        </div>

        {recommendations.map((rec) => {
          const isApplied = appliedIndexes.includes(rec.id);
          return (
            <div
              key={rec.id}
              className={`p-4 rounded-md border space-y-3 transition-all ${
                isApplied
                  ? 'border-[#A3E3C9] bg-[#E8F8F2]'
                  : 'ai-surface corner-tick'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#0E9384] bg-[#E6F7F5] px-2 py-0.5 rounded-sm border border-[#99E3D8] font-bold">
                    {rec.type}
                  </span>
                  <h4 className="font-semibold text-[#15181D]">{rec.table} ({rec.columns.join(', ')})</h4>
                </div>

                {isApplied ? (
                  <span className="text-xs text-[#159F6B] font-bold flex items-center gap-1 bg-white px-2.5 py-1 rounded-sm border border-[#A3E3C9]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#159F6B]" /> Index created
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopySql(rec.id, rec.sql)}
                      className="px-2.5 py-1 rounded-sm bg-white border border-[#DDE0DA] text-[#4B5157] hover:text-[#15181D] hover:border-[#C3C8BF] transition-all font-semibold flex items-center gap-1"
                    >
                      {copiedId === rec.id ? <Check className="w-3.5 h-3.5 text-[#159F6B]" /> : <Copy className="w-3.5 h-3.5 text-[#2454FF]" />}
                      <span>{copiedId === rec.id ? 'Copied SQL' : 'Copy SQL'}</span>
                    </button>
                    <button
                      onClick={() => handleApplyIndex(rec.id)}
                      className="px-3 py-1 rounded-sm bg-[#2454FF] text-white font-semibold text-xs flex items-center gap-1 hover:bg-[#1D44D8] transition-all"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Create index</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2.5 font-mono text-xs text-[#4B5157]">
                <div className="bg-[#F5F6F2] p-2 rounded-sm border border-[#DDE0DA]">
                  <span className="text-[10px] text-[#7A8087] font-semibold block">Estimated impact:</span>
                  <div className="text-[#159F6B] font-bold mt-0.5 tabular-nums">{rec.impact}</div>
                </div>
                <div className="bg-[#F5F6F2] p-2 rounded-sm border border-[#DDE0DA]">
                  <span className="text-[10px] text-[#7A8087] font-semibold block">Storage overhead:</span>
                  <div className="text-[#15181D] font-semibold mt-0.5 tabular-nums">{rec.sizeMb} MB</div>
                </div>
                <div className="bg-[#F5F6F2] p-2 rounded-sm border border-[#DDE0DA]">
                  <span className="text-[10px] text-[#7A8087] font-semibold block">Reasoning:</span>
                  <div className="text-[#353A40] mt-0.5 text-[11px] font-sans">{rec.reason}</div>
                </div>
              </div>

              <pre className="bg-[#15181D] p-3 rounded-sm border border-[#353A40] font-mono text-xs text-[#159F6B] overflow-x-auto">
                {rec.sql}
              </pre>
            </div>
          );
        })}
      </div>
    </div>
  );
}
