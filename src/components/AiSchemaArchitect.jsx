import React, { useState } from 'react';
import { Sparkles, Play, Code, Copy, Check, Table, ArrowRight, ShieldCheck, Download, Layers } from 'lucide-react';

export default function AiSchemaArchitect({ onLoadIntoGraph }) {
  const [promptInput, setPromptInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(null);

  const [architectResult, setArchitectResult] = useState({
    systemName: 'Logistics & Fleet Dispatch System',
    description: 'Auto-generated production database schema optimized for high concurrency, real-time GPS tracking, and automated driver dispatching.',
    tables: [
      {
        name: 'fleet_vehicles',
        rows: 4200,
        columns: ['id (UUID PRIMARY KEY)', 'vin (VARCHAR UNIQUE)', 'license_plate (VARCHAR)', 'vehicle_type (ENUM)', 'status (ENUM)', 'last_maintenance (TIMESTAMPTZ)'],
        foreignKeys: []
      },
      {
        name: 'drivers',
        rows: 6800,
        columns: ['id (UUID PRIMARY KEY)', 'full_name (VARCHAR)', 'license_no (VARCHAR UNIQUE)', 'rating (DECIMAL)', 'is_active (BOOLEAN)'],
        foreignKeys: []
      },
      {
        name: 'dispatch_jobs',
        rows: 142500,
        columns: ['id (UUID PRIMARY KEY)', 'vehicle_id (FK -> fleet_vehicles.id)', 'driver_id (FK -> drivers.id)', 'pickup_lat (DOUBLE)', 'pickup_lng (DOUBLE)', 'status (ENUM)', 'created_at (TIMESTAMPTZ)'],
        foreignKeys: ['vehicle_id -> fleet_vehicles.id', 'driver_id -> drivers.id']
      },
      {
        name: 'gps_telemetry_logs',
        rows: 4890000,
        columns: ['id (UUID PRIMARY KEY)', 'vehicle_id (FK -> fleet_vehicles.id)', 'lat (DOUBLE)', 'lng (DOUBLE)', 'speed_kmh (DECIMAL)', 'recorded_at (TIMESTAMPTZ)'],
        foreignKeys: ['vehicle_id -> fleet_vehicles.id']
      }
    ]
  });

  const presetPrompts = [
    'Design a Ride-Sharing & Fleet Dispatch platform database',
    'Architect a Multi-Tenant B2B SaaS analytics schema',
    'Create an E-Learning platform with courses, quizzes, and certificates',
    'Build a Healthcare EHR & Doctor appointment scheduling database'
  ];

  const handleGenerateSchema = async (text) => {
    const queryText = text || promptInput;
    if (!queryText) return;

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/ai/generate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText })
      });
      const data = await res.json();
      setArchitectResult(data);
    } catch (e) {
      console.warn('API connection error, using mock schema');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSqlDdl = () => {
    let sql = `-- ${architectResult.systemName} DDL Script\n-- Description: ${architectResult.description}\n\nBEGIN;\n\n`;
    architectResult.tables.forEach((tbl) => {
      sql += `CREATE TABLE ${tbl.name} (\n`;
      tbl.columns.forEach((col, idx) => {
        const isLast = idx === tbl.columns.length - 1;
        sql += `  ${col.replace(' (', ' ').replace(')', '')}${isLast ? '' : ','}\n`;
      });
      sql += `);\n\n`;
    });
    sql += `COMMIT;`;
    return sql;
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(generateSqlDdl());
    setCopiedFormat('SQL');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Configuration Header Banner */}
      <div className="surface-card p-4 rounded-md border border-[#DDE0DA] space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0E9384] text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#0E9384]" />
            <span className="font-heading uppercase tracking-wide">AI Schema Architect</span>
          </div>
          <span className="text-[10px] font-mono text-[#0E9384] bg-[#E6F7F5] px-2 py-0.5 rounded-sm border border-[#99E3D8] font-semibold">
            Gemini 2.5 Flash Engine
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Design a Ride-Sharing platform database with drivers, vehicles, and real-time GPS telemetry"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateSchema()}
            className="flex-1 px-3 py-2 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-xs text-[#15181D] placeholder:text-[#7A8087] focus:outline-none focus:border-[#0E9384]"
          />
          <button
            onClick={() => handleGenerateSchema()}
            disabled={isLoading}
            className="px-4 py-2 rounded-sm bg-[#0E9384] text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-[#0B7A6D] transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Architecting...' : 'Generate schema'}</span>
          </button>
        </div>

        {/* Suggested Query Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          <span className="text-[11px] font-mono text-[#7A8087]">Templates:</span>
          {presetPrompts.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setPromptInput(preset);
                handleGenerateSchema(preset);
              }}
              className="px-2 py-1 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-xs text-[#4B5157] hover:border-[#0E9384] hover:text-[#0E9384] transition-all whitespace-nowrap"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Architecture Overview (AI Surface Treatment) */}
      <div className="ai-surface p-5 rounded-md space-y-4">
        <div className="flex items-center justify-between border-b border-[#C2EEE8] pb-3">
          <div>
            <span className="text-[10px] font-mono text-[#0E9384] uppercase font-semibold">AI Generated Schema</span>
            <h3 className="text-base font-bold text-[#15181D] font-heading">{architectResult.systemName}</h3>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-sm bg-white border border-[#99E3D8] text-[#0E9384] hover:bg-[#E6F7F5] transition-all flex items-center gap-1.5 font-medium"
            >
              {copiedFormat === 'SQL' ? <Check className="w-3.5 h-3.5 text-[#159F6B]" /> : <Copy className="w-3.5 h-3.5 text-[#0E9384]" />}
              <span>{copiedFormat === 'SQL' ? 'Copied DDL' : 'Copy SQL DDL'}</span>
            </button>
            {onLoadIntoGraph && (
              <button
                onClick={() => onLoadIntoGraph(architectResult)}
                className="px-3 py-1.5 rounded-sm bg-[#2454FF] text-white font-medium hover:bg-[#1D44D8] transition-all flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Inspect in graph</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-[#4B5157]">{architectResult.description}</p>

        {/* Table Cards Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {architectResult.tables.map((tbl) => (
            <div key={tbl.name} className="bg-white p-3.5 rounded-sm border border-[#DDE0DA] space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-[#DDE0DA] pb-2 font-mono">
                <span className="font-semibold text-[#15181D] flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-[#0E9384]" />
                  <span>{tbl.name}</span>
                </span>
                <span className="text-[10px] text-[#7A8087] font-mono tabular-nums">{tbl.columns.length} columns</span>
              </div>

              <div className="space-y-1 font-mono text-[11px]">
                <span className="text-[10px] text-[#7A8087] uppercase font-semibold">Columns:</span>
                <div className="space-y-1 pl-1">
                  {tbl.columns.map((col, i) => (
                    <div key={i} className="text-[#353A40] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0E9384]" />
                      <span>{col}</span>
                    </div>
                  ))}
                </div>
              </div>

              {tbl.foreignKeys && tbl.foreignKeys.length > 0 && (
                <div className="pt-1.5 border-t border-[#DDE0DA] text-[10px] font-mono text-[#0E9384] font-semibold">
                  FK: {tbl.foreignKeys.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
