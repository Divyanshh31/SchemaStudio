import React, { useState } from 'react';
import {
  Network, MessageSquareCode, ShieldAlert, Sparkles, GitCompare, Command, Database,
  BookOpen, Layers, Code2, FileSpreadsheet, Activity, FileCheck, HardDrive, BarChart3,
  Lock, Zap, GitCommit, Sliders, History, Server, Search, ChevronLeft, ChevronRight,
  FolderTree, Flame, Shield, Cpu
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Studio and architecture',
      items: [
        { id: 'GRAPH', label: 'Schema studio', sub: 'DBML code & graph', icon: Network },
        { id: 'TEXT_TO_SQL', label: 'Text-to-SQL AI', sub: 'Natural language query', icon: MessageSquareCode, isAi: true },
        { id: 'ARCHITECT', label: 'AI architect', sub: 'Prompt to schema', icon: Layers, isAi: true },
        { id: 'DICTIONARY', label: 'Data dictionary', sub: 'Markdown docs', icon: BookOpen },
        { id: 'CODE_EXPORT', label: 'ORM exporter', sub: 'Prisma, TypeORM, GraphQL', icon: Code2 },
        { id: 'IMPORTER', label: 'Schema importer', sub: 'SQL & DBML parse', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'Performance and tuning',
      items: [
        { id: 'EXPLAIN_TREE', label: 'Visual EXPLAIN', sub: 'Query plan tree', icon: GitCommit },
        { id: 'INDEX_ADVISOR', label: 'Index advisor', sub: 'AI workload tuner', icon: Zap, isAi: true },
        { id: 'SIMULATOR', label: 'Traffic simulator', sub: 'Concurrency & latency', icon: Activity },
        { id: 'ANALYTICS', label: 'Storage analytics', sub: 'Disk footprint', icon: BarChart3 },
        { id: 'CONFIG_TUNER', label: 'Config tuner', sub: 'postgresql.conf', icon: Sliders }
      ]
    },
    {
      title: 'Security and reliability',
      items: [
        { id: 'SECURITY_MASK', label: 'Data masking & RLS', sub: 'PII protection', icon: Lock },
        { id: 'AUDIT', label: 'Security audit', sub: 'Vulnerability scan', icon: ShieldAlert },
        { id: 'MIGRATION_SAFETY', label: 'Migration safety', sub: 'Zero-downtime locks', icon: GitCommit },
        { id: 'TEST_SUITE', label: 'Test suite', sub: 'Automated assertions', icon: FileCheck },
        { id: 'SNAPSHOTS', label: 'PITR recovery', sub: 'Snapshots & backup', icon: HardDrive },
        { id: 'SYSTEM_HEALTH', label: 'System health', sub: 'Replication streams', icon: Server }
      ]
    },
    {
      title: 'Schema ops and data',
      items: [
        { id: 'RELATIONS', label: 'Foreign key matrix', sub: 'Dependency links', icon: Network },
        { id: 'DIFF', label: 'Schema diff', sub: 'Version compare', icon: GitCompare },
        { id: 'SYNTHETIC', label: 'Synthetic generator', sub: 'Mock test data', icon: Sparkles, isAi: true },
        { id: 'HISTORY', label: 'Query history', sub: 'Audit execution log', icon: History }
      ]
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 bg-white border-r border-[#DDE0DA] flex flex-col justify-between transition-all duration-200 select-none ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Header Branding & Collapse Toggle */}
      <div className="p-3.5 border-b border-[#DDE0DA] flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-[#2454FF] text-white flex items-center justify-center font-bold">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-[#15181D] tracking-tight">
                SchemaStudio
              </div>
              <span className="text-[10px] font-mono text-[#7A8087] block font-normal">v3.0 workspace</span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-6 h-6 rounded-sm bg-[#2454FF] text-white flex items-center justify-center mx-auto">
            <Database className="w-3.5 h-3.5" />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-[#4B5157] hover:text-[#15181D] hover:border-[#C3C8BF] transition-all ml-auto"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Module Search Bar */}
      {!isCollapsed && (
        <div className="px-3 py-2 border-b border-[#DDE0DA]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7A8087] absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Filter tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-7 pr-2.5 py-1 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-xs font-normal text-[#15181D] placeholder:text-[#7A8087] focus:outline-none focus:border-[#2454FF]"
            />
          </div>
        </div>
      )}

      {/* Navigation Group List */}
      <div className="flex-1 overflow-y-auto px-2 py-2.5 space-y-3 font-sans">
        {categories.map((cat, catIdx) => {
          const matchingItems = cat.items.filter((item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sub.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (matchingItems.length === 0) return null;

          return (
            <div key={catIdx} className="space-y-0.5">
              {!isCollapsed && (
                <div className="px-2 py-1 text-[11px] font-sans font-medium text-[#7A8087] border-b border-[#DDE0DA]/60 mb-1">
                  {cat.title}
                </div>
              )}

              <div className="space-y-0.5">
                {matchingItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full text-left rounded-sm transition-all flex items-center relative ${
                        isCollapsed ? 'justify-center p-2' : 'px-2.5 py-1.5 justify-between'
                      } ${
                        isActive
                          ? 'bg-[#F5F6F2] text-[#2454FF] font-semibold border border-[#2454FF] corner-tick'
                          : 'text-[#4B5157] hover:bg-[#F5F6F2] hover:text-[#15181D] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${item.isAi ? 'text-[#0E9384]' : isActive ? 'text-[#2454FF]' : 'text-[#4B5157]'}`} />
                        {!isCollapsed && (
                          <div className="truncate">
                            <div className="text-xs leading-tight flex items-center gap-1.5">
                              <span>{item.label}</span>
                              {item.isAi && (
                                <span className="text-[9px] font-mono text-[#0E9384] bg-[#E6F7F5] px-1 rounded-sm border border-[#99E3D8]">
                                  AI
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer System Status */}
      {!isCollapsed && (
        <div className="p-2.5 border-t border-[#DDE0DA] bg-[#F5F6F2] text-[11px] font-mono text-[#4B5157] flex items-center justify-between">
          <span>Status:</span>
          <span className="text-[#159F6B] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#159F6B]" />
            100% online
          </span>
        </div>
      )}
    </aside>
  );
}
