import React, { useState } from 'react';
import { GitCommit, ShieldAlert, CheckCircle2, AlertTriangle, Play, Check, Copy, Code, FileText, ArrowRight } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function MigrationImpact() {
  const [migrationScript, setMigrationScript] = useState(`-- Proposed Release v2.1.0 Migration
BEGIN;

ALTER TABLE users ADD COLUMN last_login_ip VARCHAR(45);
CREATE INDEX CONCURRENTLY idx_users_last_login ON users(last_login_ip);
ALTER TABLE products ALTER COLUMN title TYPE VARCHAR(255);
-- ALTER TABLE order_items DROP COLUMN legacy_sku; -- RISKY

COMMIT;`);

  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationPassed, setSimulationPassed] = useState(true);

  const risks = [
    { title: 'Zero-Downtime Index Creation', severity: 'SAFE', detail: 'Using CONCURRENTLY keyword avoids exclusive table locks during index creation.' },
    { title: 'In-Place Column Extension', severity: 'SAFE', detail: 'VARCHAR(200) to VARCHAR(255) is metadata-only alteration in PostgreSQL 16.' },
    { title: 'Additive Column Addition', severity: 'SAFE', detail: 'Adding nullable last_login_ip column is non-blocking.' }
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationPassed(true);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(migrationScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">MIGRATION SAFETY & ZERO-DOWNTIME IMPACT ENGINE</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Analyze SQL DDL scripts for table lock risks, destructive drops, and zero-downtime compliance before deployment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-mono font-semibold text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isSimulating ? 'SIMULATING DRY-RUN...' : 'RUN MIGRATION DRY-RUN'}</span>
            </button>
          </div>
        </div>

        {/* Risk Score Indicator */}
        <div className="grid grid-cols-12 gap-3.5 font-mono text-xs pt-1">
          <div className="col-span-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
              <span>MIGRATION RISK SCORE</span>
            </div>
            <div className="text-xl font-bold text-emerald-700">LOW RISK (0/10)</div>
            <div className="text-[11px] text-slate-500">Safe for Production Dry-Run</div>
          </div>

          <div className="col-span-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>ESTIMATED DOWNTIME</span>
            </div>
            <div className="text-xl font-bold text-indigo-600">0 ms (ZERO DOWNTIME)</div>
            <div className="text-[11px] text-slate-500">Non-blocking Concurrent Locks</div>
          </div>

          <div className="col-span-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>ROLLBACK PLAN</span>
            </div>
            <div className="text-xl font-bold text-amber-600">AUTO-GENERATED</div>
            <div className="text-[11px] text-emerald-700 font-semibold">1-Click Rollback Script Ready</div>
          </div>
        </div>
      </SpotlightCard>

      {/* Editor & Risks */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Code className="w-4 h-4 text-indigo-600" />
            <span>MIGRATION DDL SCRIPT FOR DRY-RUN EVALUATION</span>
          </h3>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-all flex items-center gap-1.5 font-semibold text-[11px]"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-indigo-600" />}
            <span>{copied ? 'COPIED' : 'COPY DDL'}</span>
          </button>
        </div>

        <textarea
          rows={6}
          value={migrationScript}
          onChange={(e) => setMigrationScript(e.target.value)}
          className="w-full p-4 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500"
        />

        {/* Risk Checks */}
        <div className="space-y-2 pt-2">
          <span className="text-slate-500 text-[11px] font-semibold uppercase">SAFETY & IMPACT AUDIT RESULTS:</span>
          {risks.map((r, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{r.title}</span>
                </span>
                <p className="text-[11px] text-slate-500 pl-5.5">{r.detail}</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                {r.severity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
