import React, { useState } from 'react';
import { Command, ChevronRight, Database, User, LogOut, ChevronDown, Check, Zap, Server } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ activeTab, onOpenCommandPalette, onShowLogin }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('ECOMMERCE');

  const presets = [
    { id: 'ECOMMERCE', name: 'E-commerce & retail' },
    { id: 'SAAS', name: 'SaaS multi-tenant' },
    { id: 'HEALTHCARE', name: 'Healthcare EHR' },
    { id: 'FINTECH', name: 'FinTech banking' },
    { id: 'SOCIAL', name: 'Social network' }
  ];

  const tabNames = {
    GRAPH: 'Schema studio',
    TEXT_TO_SQL: 'Text-to-SQL AI',
    ARCHITECT: 'AI schema architect',
    DICTIONARY: 'Data dictionary',
    CODE_EXPORT: 'ORM exporter',
    IMPORTER: 'Schema importer',
    EXPLAIN_TREE: 'Visual EXPLAIN',
    INDEX_ADVISOR: 'Index advisor',
    SIMULATOR: 'Traffic simulator',
    ANALYTICS: 'Storage analytics',
    CONFIG_TUNER: 'Config tuner',
    SECURITY_MASK: 'Data masking & RLS',
    AUDIT: 'Security audit',
    MIGRATION_SAFETY: 'Migration safety',
    TEST_SUITE: 'Test suite',
    SNAPSHOTS: 'PITR recovery',
    SYSTEM_HEALTH: 'System health',
    RELATIONS: 'Foreign key matrix',
    DIFF: 'Schema diff',
    SYNTHETIC: 'Synthetic data',
    HISTORY: 'Query history'
  };

  return (
    <header className="bg-white border-b border-[#DDE0DA] px-5 py-2.5 flex items-center justify-between sticky top-0 z-20 font-sans">
      {/* Breadcrumb Hierarchy */}
      <div className="flex items-center gap-2 text-xs font-medium text-[#4B5157]">
        <span className="text-[#15181D] font-semibold font-heading">SchemaStudio</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#7A8087]" />
        <span className="text-[#2454FF] font-semibold">{tabNames[activeTab] || 'Workspace'}</span>
      </div>

      {/* Preset Selector & Live System Stats */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-[#F5F6F2] px-2.5 py-1 rounded-sm border border-[#DDE0DA]">
          <Database className="w-3.5 h-3.5 text-[#2454FF]" />
          <span className="text-[#7A8087]">Preset:</span>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="bg-transparent text-[#15181D] font-medium focus:outline-none cursor-pointer"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center gap-1.5 bg-[#E8F8F2] px-2.5 py-1 rounded-sm border border-[#A3E3C9] text-[#159F6B] font-mono text-[11px] font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#159F6B]" />
          <span>PostgreSQL 16.2 • 0.2ms latency</span>
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="px-2.5 py-1 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-[#4B5157] hover:border-[#C3C8BF] hover:text-[#15181D] flex items-center gap-1.5 transition-all text-xs font-mono"
        >
          <Command className="w-3.5 h-3.5 text-[#2454FF]" />
          <span>Ctrl+K</span>
        </button>

        {/* User Account Profile Pill */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] hover:border-[#C3C8BF] transition-all text-xs"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span className="font-medium text-[#15181D] truncate max-w-[120px]">{user.name}</span>
              <ChevronDown className="w-3 h-3 text-[#7A8087]" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white border border-[#DDE0DA] rounded-sm shadow-md z-50 p-2 text-xs font-sans space-y-2">
                <div className="p-2 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] space-y-0.5">
                  <div className="font-semibold text-[#15181D]">{user.name}</div>
                  <div className="text-[11px] text-[#7A8087] font-mono truncate">{user.email}</div>
                  <div className="text-[10px] font-mono bg-white text-[#2454FF] px-1.5 py-0.5 rounded-sm border border-[#DDE0DA] font-semibold inline-block">
                    {user.role}
                  </div>
                </div>

                <div className="space-y-0.5 text-xs">
                  <button
                    onClick={() => { setShowUserMenu(false); if (onShowLogin) onShowLogin(); }}
                    className="w-full text-left p-1.5 rounded-sm hover:bg-[#F5F6F2] text-[#4B5157] font-medium flex items-center justify-between"
                  >
                    <span>Switch account</span>
                    <User className="w-3.5 h-3.5 text-[#2454FF]" />
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); logout(); if (onShowLogin) onShowLogin(); }}
                    className="w-full text-left p-1.5 rounded-sm hover:bg-[#FDF2F4] text-[#D0334C] font-medium flex items-center justify-between"
                  >
                    <span>Sign out</span>
                    <LogOut className="w-3.5 h-3.5 text-[#D0334C]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onShowLogin}
            className="px-3 py-1 rounded-sm bg-[#2454FF] text-white font-semibold text-xs hover:bg-[#1D44D8] transition-all"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
