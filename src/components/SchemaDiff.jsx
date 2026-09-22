import React, { useState } from 'react';
import { GitCompare, Plus, Minus, Edit3, ArrowRight, Copy, Check, Download, AlertTriangle, Code } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function SchemaDiff() {
  const [currentVersion, setCurrentVersion] = useState('v1.4.0-PROD');
  const [targetVersion, setTargetVersion] = useState('v2.0.0-RC1');
  const [copied, setCopied] = useState(false);

  const diffs = [
    { type: 'ADDED_TABLE', title: 'Table Added: audit_logs', detail: 'New table created with 6 columns (id, user_id, action, ip_address, metadata, created_at).' },
    { type: 'ALTERED_COLUMN', title: 'Column Modified: users.phone_number', detail: 'Type changed from VARCHAR(15) to VARCHAR(20) with UNIQUE constraint.' },
    { type: 'ADDED_INDEX', title: 'Index Added: idx_orders_user_id', detail: 'Created composite index on orders(user_id, created_at DESC) for 4x query acceleration.' },
    { type: 'DELETED_COLUMN', title: 'Column Dropped: products.legacy_sku', detail: 'Breaking Change: Column removed. Ensure API serialization is updated.' }
  ];

  const migrationSql = `-- SchemaStudio Schema Migration Script
-- Target: ${targetVersion} from ${currentVersion}

BEGIN;

-- 1. Create audit_logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  ip_address VARCHAR(45),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Alter column phone_number
ALTER TABLE users ALTER COLUMN phone_number TYPE VARCHAR(20);

-- 3. Create index idx_orders_user_id
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id, created_at DESC);

-- 4. Drop column legacy_sku (RISKY)
ALTER TABLE products DROP COLUMN IF EXISTS legacy_sku;

COMMIT;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(migrationSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([migrationSql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration_${currentVersion}_to_${targetVersion}.sql`;
    a.click();
  };

  return (
    <div className="space-y-5">
      {/* Version Selector Banner */}
      <SpotlightCard className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">SCHEMA MIGRATION DIFF & IMPACT ENGINE</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Visualizing structural differences between target database releases.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 font-semibold">
              <Plus className="w-3.5 h-3.5" /> 2 Additions
            </span>
            <span className="px-3 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 font-semibold">
              <Edit3 className="w-3.5 h-3.5" /> 1 Modification
            </span>
            <span className="px-3 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 flex items-center gap-1 font-semibold">
              <Minus className="w-3.5 h-3.5" /> 1 Deletion
            </span>
          </div>
        </div>

        {/* Version Selectors */}
        <div className="grid grid-cols-12 gap-3.5 font-mono text-xs pt-1">
          <div className="col-span-5 space-y-1">
            <label className="text-slate-500 font-semibold">BASE VERSION (CURRENT):</label>
            <select
              value={currentVersion}
              onChange={(e) => setCurrentVersion(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-indigo-700 font-mono font-semibold focus:outline-none"
            >
              <option value="v1.4.0-PROD">v1.4.0-PROD (Active Production)</option>
              <option value="v1.3.2-PROD">v1.3.2-PROD (Previous Release)</option>
            </select>
          </div>

          <div className="col-span-2 flex items-center justify-center pt-3 text-indigo-600">
            <ArrowRight className="w-5 h-5" />
          </div>

          <div className="col-span-5 space-y-1">
            <label className="text-slate-500 font-semibold">TARGET VERSION (PROPOSED):</label>
            <select
              value={targetVersion}
              onChange={(e) => setTargetVersion(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-emerald-700 font-mono font-semibold focus:outline-none"
            >
              <option value="v2.0.0-RC1">v2.0.0-RC1 (Staging Release Candidate)</option>
              <option value="v2.1.0-DEV">v2.1.0-DEV (Development Feature Branch)</option>
            </select>
          </div>
        </div>
      </SpotlightCard>

      {/* Migration Diff Cards */}
      <div className="space-y-2.5">
        <div className="text-xs font-mono text-slate-500 font-semibold uppercase tracking-wider">
          STRUCTURAL CHANGES ({diffs.length})
        </div>

        {diffs.map((diff, i) => (
          <div
            key={i}
            className={`surface-card p-4 rounded-xl border font-mono text-xs space-y-1.5 shadow-sm ${
              diff.type === 'ADDED_TABLE' || diff.type === 'ADDED_INDEX'
                ? 'border-emerald-200 bg-emerald-50/40'
                : diff.type === 'ALTERED_COLUMN'
                ? 'border-amber-200 bg-amber-50/40'
                : 'border-red-200 bg-red-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
                {diff.type === 'ADDED_TABLE' && <Plus className="w-3.5 h-3.5 text-emerald-600" />}
                {diff.type === 'ADDED_INDEX' && <Plus className="w-3.5 h-3.5 text-emerald-600" />}
                {diff.type === 'ALTERED_COLUMN' && <Edit3 className="w-3.5 h-3.5 text-amber-600" />}
                {diff.type === 'DELETED_COLUMN' && <Minus className="w-3.5 h-3.5 text-red-600" />}
                <span>{diff.title}</span>
              </span>
              <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded border bg-white border-slate-200 text-slate-700 font-bold">
                {diff.type}
              </span>
            </div>
            <p className="text-slate-600 text-xs pl-5 font-mono">{diff.detail}</p>
          </div>
        ))}
      </div>

      {/* SQL Script Block */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-600" />
            <span>EXECUTABLE MIGRATION DDL SCRIPT</span>
          </h3>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-all font-semibold flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />}
              <span>{copied ? 'COPIED' : 'COPY SCRIPT'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD .SQL</span>
            </button>
          </div>
        </div>

        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-emerald-400 text-xs overflow-x-auto font-mono">
          {migrationSql}
        </pre>
      </div>
    </div>
  );
}
