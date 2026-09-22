import React, { useState } from 'react';
import { Settings, Server, ShieldCheck, Download, Copy, Check, Database, Sliders, HardDrive } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function ConnectionSettings() {
  const [provider, setProvider] = useState('POSTGRESQL');
  const [sharedBuffers, setSharedBuffers] = useState('2GB');
  const [workMem, setWorkMem] = useState('64MB');
  const [maxConnections, setMaxConnections] = useState(100);
  const [copied, setCopied] = useState(false);

  const generatePostgresConf = () => {
    return `# postgresql.conf tuned by SchemaStudio Architect
# Target RAM: 8GB System | Workload: OLTP High Concurrency

max_connections = ${maxConnections}
shared_buffers = ${sharedBuffers}
effective_cache_size = 6GB
maintenance_work_mem = 512MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = ${workMem}
min_wal_size = 1GB
max_wal_size = 4GB
`;
  };

  const handleCopyConf = () => {
    navigator.clipboard.writeText(generatePostgresConf());
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
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">DATABASE MEMORY & CONNECTION CONFIGURATOR</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Tune PostgreSQL shared buffers, work memory, connection pooling, and export production `postgresql.conf`.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyConf}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all flex items-center gap-1.5 font-mono text-xs shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED CONF' : 'COPY POSTGRESQL.CONF'}</span>
          </button>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-12 gap-3.5 font-mono text-xs">
          <div className="col-span-4 space-y-1">
            <label className="text-slate-500 font-semibold">DATABASE ENGINE:</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-indigo-700 font-mono font-semibold focus:outline-none"
            >
              <option value="POSTGRESQL">PostgreSQL 16.2</option>
              <option value="MYSQL">MySQL 8.0</option>
              <option value="SQLITE">SQLite 3.45</option>
            </select>
          </div>

          <div className="col-span-4 space-y-1">
            <label className="text-slate-500 font-semibold">SHARED BUFFERS:</label>
            <select
              value={sharedBuffers}
              onChange={(e) => setSharedBuffers(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-emerald-700 font-mono font-semibold focus:outline-none"
            >
              <option value="1GB">1GB (Small Instance)</option>
              <option value="2GB">2GB (Recommended 8GB RAM)</option>
              <option value="4GB">4GB (Medium Instance)</option>
            </select>
          </div>

          <div className="col-span-4 space-y-1">
            <label className="text-slate-500 font-semibold">WORK MEMORY (WORK_MEM):</label>
            <select
              value={workMem}
              onChange={(e) => setWorkMem(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-amber-600 font-mono font-semibold focus:outline-none"
            >
              <option value="32MB">32MB per query node</option>
              <option value="64MB">64MB per query node</option>
              <option value="128MB">128MB per query node</option>
            </select>
          </div>
        </div>
      </SpotlightCard>

      {/* Generated postgresql.conf block */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600" />
            <span>TUNED POSTGRESQL.CONF CONFIGURATION SCRIPT</span>
          </h3>
        </div>

        <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
          {generatePostgresConf()}
        </pre>
      </div>
    </div>
  );
}
