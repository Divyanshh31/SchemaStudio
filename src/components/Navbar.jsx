import React, { useState } from 'react';
import { Network, MessageSquareCode, ShieldAlert, Sparkles, GitCompare, Command, Database, BookOpen, Layers, Code2, FileSpreadsheet, Activity, FileCheck, HardDrive, BarChart3, Lock, Zap, GitCommit, Sliders, History, Server, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenCommandPalette, onShowLogin }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const tabs = [
    { id: 'GRAPH', label: 'GRAPH', icon: Network },
    { id: 'TEXT_TO_SQL', label: 'SQL STUDIO', icon: MessageSquareCode },
    { id: 'ARCHITECT', label: 'ARCHITECT', icon: Layers },
    { id: 'DICTIONARY', label: 'DICTIONARY', icon: BookOpen },
    { id: 'CODE_EXPORT', label: 'ORM EXPORT', icon: Code2 },
    { id: 'IMPORTER', label: 'IMPORTER', icon: FileSpreadsheet },
    { id: 'RELATIONS', label: 'RELATIONS', icon: Network },
    { id: 'HISTORY', label: 'HISTORY', icon: History },
    { id: 'EXPLAIN_TREE', label: 'EXPLAIN TREE', icon: GitCommit },
    { id: 'CONFIG_TUNER', label: 'CONFIG TUNER', icon: Sliders },
    { id: 'MIGRATION_SAFETY', label: 'DRY RUN SAFETY', icon: GitCommit },
    { id: 'SYSTEM_HEALTH', label: 'SYSTEM HEALTH', icon: Server },
    { id: 'SIMULATOR', label: 'TRAFFIC SIM', icon: Activity },
    { id: 'TEST_SUITE', label: 'TEST SUITE', icon: FileCheck },
    { id: 'INDEX_ADVISOR', label: 'INDEX ADVISOR', icon: Zap },
    { id: 'SECURITY_MASK', label: 'SECURITY & RLS', icon: Lock },
    { id: 'SNAPSHOTS', label: 'SNAPSHOTS', icon: HardDrive },
    { id: 'ANALYTICS', label: 'ANALYTICS', icon: BarChart3 },
    { id: 'AUDIT', label: 'AUDIT', icon: ShieldAlert },
    { id: 'SYNTHETIC', label: 'SYNTHETIC', icon: Sparkles },
    { id: 'DIFF', label: 'DIFF', icon: GitCompare }
  ];

  return (
    <header className="surface-card rounded-xl border border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-sm bg-white">
      {/* Brand & Connection Status */}
      <div className="flex items-center gap-3">
        <div className="w-8.5 h-8.5 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
          <Database className="w-4.5 h-4.5 text-indigo-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono font-bold text-sm text-slate-900 tracking-wide">
              SCHEMA <span className="text-[#2454FF]">STUDIO</span>
            </h1>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            CONNECTED • PostgreSQL 16.2
          </div>
        </div>
      </div>

      {/* Workspace Tabs Navigation */}
      <nav className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200 overflow-x-auto max-w-3xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-md font-mono text-xs flex items-center gap-1.5 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-indigo-600 font-bold border border-indigo-200 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Command Palette & User Profile Pill */}
      <div className="flex items-center gap-2 font-mono">
        <button
          onClick={onOpenCommandPalette}
          className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 text-xs flex items-center gap-1.5 transition-all font-semibold"
        >
          <Command className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ctrl+K</span>
        </button>

        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-50/70 border border-indigo-200 hover:bg-indigo-100/60 transition-all"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-5 h-5 rounded-full border border-indigo-300 object-cover"
              />
              <span className="text-xs font-bold text-slate-900 truncate max-w-[110px]">{user.name}</span>
              <ChevronDown className="w-3 h-3 text-indigo-600" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 text-xs font-mono space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-900">{user.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  <div className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-semibold inline-block">
                    {user.role}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { setShowUserMenu(false); if (onShowLogin) onShowLogin(); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-50 text-slate-700 font-medium flex items-center justify-between"
                  >
                    <span>Switch Account</span>
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                  </button>
                  <button
                    onClick={() => { setShowUserMenu(false); logout(); if (onShowLogin) onShowLogin(); }}
                    className="w-full text-left p-2 rounded-lg hover:bg-red-50 text-red-600 font-medium flex items-center justify-between"
                  >
                    <span>Sign Out</span>
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onShowLogin}
            className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-xs"
          >
            SIGN IN
          </button>
        )}
      </div>
    </header>
  );
}
