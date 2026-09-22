import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AmbientBackground from './components/AmbientBackground';
import InfiniteMarquee from './components/bits/InfiniteMarquee';
import CommandPalette from './components/CommandPalette';
import SchemaGraph from './components/SchemaGraph';
import TextToQuery from './components/TextToQuery';
import AiSchemaArchitect from './components/AiSchemaArchitect';
import DataDictionary from './components/DataDictionary';
import CodeExporter from './components/CodeExporter';
import SchemaImporter from './components/SchemaImporter';
import RelationshipGraph from './components/RelationshipGraph';
import QueryHistory from './components/QueryHistory';
import MigrationImpact from './components/MigrationImpact';
import SystemHealth from './components/SystemHealth';
import PerformanceSimulator from './components/PerformanceSimulator';
import TestSuite from './components/TestSuite';
import SnapshotManager from './components/SnapshotManager';
import QueryAnalytics from './components/QueryAnalytics';
import SecurityMasking from './components/SecurityMasking';
import IndexAdvisor from './components/IndexAdvisor';
import ExplainVisualizer from './components/ExplainVisualizer';
import ConnectionSettings from './components/ConnectionSettings';
import AuditPanel from './components/AuditPanel';
import SyntheticDataGenerator from './components/SyntheticDataGenerator';
import SchemaDiff from './components/SchemaDiff';
import LoginPage from './components/auth/LoginPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ShieldCheck } from 'lucide-react';

function WorkspaceContent() {
  const [activeTab, setActiveTab] = useState('GRAPH');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [showLoginPage, setShowLoginPage] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // If not authenticated or explicitly switching login, show LoginPage
  if (!isAuthenticated || showLoginPage) {
    return (
      <LoginPage
        onLoginSuccess={() => {
          setShowLoginPage(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex relative overflow-x-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Soft Ambient Motion Background */}
      <AmbientBackground />

      {/* Left Collapsible Studio Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Studio Content Body */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 ${
          isSidebarCollapsed ? 'pl-16' : 'pl-64'
        }`}
      >
        {/* Top Studio Header Bar */}
        <Header
          activeTab={activeTab}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onShowLogin={() => setShowLoginPage(true)}
        />

        {/* Main Workspace Canvas Area */}
        <main className="p-6 flex-1 space-y-5 relative z-10 max-w-7xl mx-auto w-full">
          {/* React Bits Infinite Marquee Ticker */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-white">
            <InfiniteMarquee />
          </div>

          {activeTab === 'GRAPH' && <SchemaGraph />}
          {activeTab === 'TEXT_TO_SQL' && <TextToQuery />}
          {activeTab === 'ARCHITECT' && <AiSchemaArchitect onLoadIntoGraph={() => setActiveTab('GRAPH')} />}
          {activeTab === 'DICTIONARY' && <DataDictionary />}
          {activeTab === 'CODE_EXPORT' && <CodeExporter />}
          {activeTab === 'IMPORTER' && <SchemaImporter />}
          {activeTab === 'RELATIONS' && <RelationshipGraph />}
          {activeTab === 'HISTORY' && <QueryHistory onReRunQuery={() => setActiveTab('TEXT_TO_SQL')} />}
          {activeTab === 'EXPLAIN_TREE' && <ExplainVisualizer />}
          {activeTab === 'CONFIG_TUNER' && <ConnectionSettings />}
          {activeTab === 'MIGRATION_SAFETY' && <MigrationImpact />}
          {activeTab === 'SYSTEM_HEALTH' && <SystemHealth />}
          {activeTab === 'SIMULATOR' && <PerformanceSimulator />}
          {activeTab === 'TEST_SUITE' && <TestSuite />}
          {activeTab === 'INDEX_ADVISOR' && <IndexAdvisor />}
          {activeTab === 'SECURITY_MASK' && <SecurityMasking />}
          {activeTab === 'SNAPSHOTS' && <SnapshotManager />}
          {activeTab === 'ANALYTICS' && <QueryAnalytics />}
          {activeTab === 'AUDIT' && <AuditPanel />}
          {activeTab === 'SYNTHETIC' && <SyntheticDataGenerator />}
          {activeTab === 'DIFF' && <SchemaDiff />}
        </main>

        {/* Studio Footer */}
        <footer className="p-4 text-center font-mono text-xs text-slate-500 flex items-center justify-center gap-2 border-t border-slate-200 bg-white/50 backdrop-blur-xs relative z-10 mt-6">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>SCHEMASTUDIO v3.0 • LOGGED IN AS {user?.name?.toUpperCase() || 'DEVELOPER'} ({user?.institution || 'SRMIST KTR'})</span>
        </footer>
      </div>

      {/* Command Palette Modal (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tabId) => {
          if (tabId) setActiveTab(tabId);
          else setIsCommandPaletteOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WorkspaceContent />
    </AuthProvider>
  );
}
