import React, { useState } from 'react';
import { Network, Link2, AlertTriangle, ShieldCheck, Check, ArrowRight, Table } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function RelationshipGraph() {
  const [selectedTable, setSelectedTable] = useState('order_items');

  const relationships = [
    { source: 'orders', target: 'users', fkColumn: 'user_id', refColumn: 'id', constraint: 'fk_orders_users', cascade: 'SET NULL', status: 'HEALTHY' },
    { source: 'order_items', target: 'orders', fkColumn: 'order_id', refColumn: 'id', constraint: 'fk_order_items_orders', cascade: 'CASCADE', status: 'HEALTHY' },
    { source: 'order_items', target: 'products', fkColumn: 'product_id', refColumn: 'id', constraint: 'fk_order_items_products', cascade: 'RESTRICT', status: 'HEALTHY' },
    { source: 'products', target: 'categories', fkColumn: 'category_id', refColumn: 'id', constraint: 'fk_products_categories', cascade: 'NO ACTION', status: 'UNINDEXED' },
    { source: 'reviews', target: 'products', fkColumn: 'product_id', refColumn: 'id', constraint: 'fk_reviews_products', cascade: 'CASCADE', status: 'HEALTHY' },
    { source: 'reviews', target: 'users', fkColumn: 'user_id', refColumn: 'id', constraint: 'fk_reviews_users', cascade: 'CASCADE', status: 'HEALTHY' }
  ];

  const filtered = relationships.filter(
    (r) => r.source === selectedTable || r.target === selectedTable
  );

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <SpotlightCard className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">FOREIGN KEY RELATIONSHIPS & DEPENDENCY MATRIX</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Inspect entity foreign key links, referential integrity constraints, and cascade delete rules.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 font-semibold">
            NO CIRCULAR DEPENDENCIES DETECTED
          </span>
        </div>

        {/* Table Selector */}
        <div className="flex items-center gap-2 font-mono text-xs pt-2 border-t border-slate-100">
          <span className="text-slate-500 font-semibold">FILTER BY TABLE:</span>
          {['order_items', 'orders', 'products', 'users', 'reviews'].map((tbl) => (
            <button
              key={tbl}
              onClick={() => setSelectedTable(tbl)}
              className={`px-3 py-1 rounded-md transition-all font-semibold ${
                selectedTable === tbl
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tbl}
            </button>
          ))}
        </div>
      </SpotlightCard>

      {/* Relationships Table */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-600" />
            <span>ACTIVE FOREIGN KEY CONSTRAINTS FOR `{selectedTable}` ({filtered.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-indigo-700 bg-slate-50 font-semibold">
                <th className="p-3">SOURCE TABLE & FK</th>
                <th className="p-3">RELATION</th>
                <th className="p-3">TARGET TABLE & PK</th>
                <th className="p-3">CONSTRAINT NAME</th>
                <th className="p-3">ON DELETE RULE</th>
                <th className="p-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((rel, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 text-slate-800">
                  <td className="p-3 font-bold text-slate-900">
                    {rel.source}.<span className="text-indigo-600">{rel.fkColumn}</span>
                  </td>
                  <td className="p-3 text-indigo-600">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    {rel.target}.<span className="text-emerald-700">{rel.refColumn}</span>
                  </td>
                  <td className="p-3 text-[11px] text-slate-500 font-mono">{rel.constraint}</td>
                  <td className="p-3 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded border font-semibold ${
                        rel.cascade === 'CASCADE'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}
                    >
                      {rel.cascade}
                    </span>
                  </td>
                  <td className="p-3">
                    {rel.status === 'HEALTHY' ? (
                      <span className="text-emerald-700 text-[10px] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-semibold">
                        INDEXED
                      </span>
                    ) : (
                      <span className="text-amber-700 text-[10px] bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-semibold">
                        UNINDEXED FK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
