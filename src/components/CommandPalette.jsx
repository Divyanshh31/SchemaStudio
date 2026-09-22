import React, { useState, useEffect } from 'react';
import { Search, Network, MessageSquareCode, ShieldAlert, Sparkles, GitCompare, BookOpen, Layers, Code2, FileSpreadsheet, Activity, FileCheck, HardDrive, BarChart3, Lock, Zap, GitCommit, Sliders, History, Server, X } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, onSelectTab }) {
  const [query, setQuery] = useState('');

  const commands = [
    { id: 'GRAPH', label: 'Schema studio', sub: 'Interactive ER diagram node graph', icon: Network },
    { id: 'TEXT_TO_SQL', label: 'Text-to-SQL AI', sub: 'Natural language queries & visualization', icon: MessageSquareCode, isAi: true },
    { id: 'ARCHITECT', label: 'AI schema architect', sub: 'Generate database architecture from prompts', icon: Layers, isAi: true },
    { id: 'DICTIONARY', label: 'Data dictionary', sub: 'Export markdown specifications & column docs', icon: BookOpen },
    { id: 'CODE_EXPORT', label: 'ORM exporter', sub: 'Export Prisma, TypeORM, GraphQL, DBML, DDL', icon: Code2 },
    { id: 'IMPORTER', label: 'Schema importer', sub: 'Infer types & auto-generate SQL DDL from raw CSV/DBML', icon: FileSpreadsheet },
    { id: 'RELATIONS', label: 'Foreign key matrix', sub: 'Inspect entity FK links & cascade rules', icon: Network },
    { id: 'HISTORY', label: 'Query history', sub: 'Audit log of executed queries & bookmarked favorites', icon: History },
    { id: 'EXPLAIN_TREE', label: 'Visual EXPLAIN', sub: 'Physical operator tree mapping & node latency', icon: GitCommit },
    { id: 'CONFIG_TUNER', label: 'Config tuner', sub: 'Tune shared_buffers, work_mem & export postgresql.conf', icon: Sliders },
    { id: 'MIGRATION_SAFETY', label: 'Migration safety', sub: 'Dry-run risk scoring & zero-downtime lock checks', icon: GitCommit },
    { id: 'SYSTEM_HEALTH', label: 'System health', sub: 'Real-time CPU/Memory telemetry & replication lag', icon: Server },
    { id: 'SIMULATOR', label: 'Traffic simulator', sub: 'Simulate high QPS throughput & latency charts', icon: Activity },
    { id: 'TEST_SUITE', label: 'Test suite', sub: 'Execute integration assertions & view coverage', icon: FileCheck },
    { id: 'INDEX_ADVISOR', label: 'Index advisor', sub: 'Recommend composite indexes for speedup', icon: Zap, isAi: true },
    { id: 'SECURITY_MASK', label: 'Data masking & RLS', sub: 'Protect sensitive PII, SSN & card data with RLS', icon: Lock },
    { id: 'SNAPSHOTS', label: 'PITR recovery', sub: 'Manage Point-in-Time Recovery (PITR) backups', icon: HardDrive },
    { id: 'ANALYTICS', label: 'Storage analytics', sub: 'Inspect top query patterns, hit ratios, disk usage', icon: BarChart3 },
    { id: 'AUDIT', label: 'Security audit', sub: 'Vulnerability scan & 1-click index fixes', icon: ShieldAlert },
    { id: 'SYNTHETIC', label: 'Synthetic generator', sub: 'Generate mock dataset & export CSV', icon: Sparkles, isAi: true },
    { id: 'DIFF', label: 'Schema diff', sub: 'Compare production vs staging releases', icon: GitCompare }
  ];

  const filtered = commands.filter(
    (c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.sub.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectTab(null);
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-[#15181D]/30 backdrop-blur-xs font-sans">
      <div className="w-full max-w-lg bg-white rounded-md border border-[#DDE0DA] p-3 shadow-lg space-y-2 corner-tick">
        <div className="flex items-center gap-2 border-b border-[#DDE0DA] pb-2.5 px-1">
          <Search className="w-4 h-4 text-[#2454FF]" />
          <input
            type="text"
            placeholder="Search commands or tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[#15181D] placeholder:text-[#7A8087] focus:outline-none font-medium"
            autoFocus
          />
          <button onClick={onClose} className="text-[#7A8087] hover:text-[#15181D]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-0.5 max-h-80 overflow-y-auto">
          {filtered.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={() => {
                  onSelectTab(cmd.id);
                  onClose();
                }}
                className="w-full p-2 rounded-sm border border-transparent text-left text-xs flex items-center justify-between hover:bg-[#F5F6F2] hover:border-[#DDE0DA] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${cmd.isAi ? 'text-[#0E9384]' : 'text-[#2454FF]'}`} />
                  <div>
                    <div className="font-semibold text-[#15181D] flex items-center gap-1.5">
                      <span>{cmd.label}</span>
                      {cmd.isAi && (
                        <span className="text-[9px] font-mono text-[#0E9384] bg-[#E6F7F5] px-1 rounded-sm border border-[#99E3D8]">
                          AI
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[#7A8087] font-normal">{cmd.sub}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-[#F5F6F2] px-1.5 py-0.5 rounded-sm border border-[#DDE0DA] text-[#7A8087]">Jump</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
