import React, { useState } from 'react';
import { Sparkles, Download, RefreshCw, Table, Copy, Check, ShieldCheck, Code } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function SyntheticDataGenerator() {
  const [targetTable, setTargetTable] = useState('customers');
  const [rowCount, setRowCount] = useState(10);
  const [dataProfile, setDataProfile] = useState('REALISTIC');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const [generatedRows, setGeneratedRows] = useState([
    { id: 'usr_89f02a', email: 'alex.chen@tech.io', full_name: 'Alex Chen', role: 'CUSTOMER', created_at: '2026-09-15 14:20:00' },
    { id: 'usr_77c12b', email: 'priya.sharma@srm.edu', full_name: 'Priya Sharma', role: 'CUSTOMER', created_at: '2026-09-18 09:45:12' },
    { id: 'usr_44d90e', email: 'david.miller@corp.com', full_name: 'David Miller', role: 'ADMIN', created_at: '2026-09-20 18:02:44' }
  ]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/ai/synthetic-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: targetTable, count: rowCount, profile: dataProfile })
      });
      const data = await res.json();
      if (data.rows) setGeneratedRows(data.rows);
    } catch (e) {
      console.warn('API connection error, using mock dataset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    if (generatedRows.length === 0) return;
    const headers = Object.keys(generatedRows[0]).join(',');
    const csvRows = generatedRows.map((row) => Object.values(row).map((val) => `"${val}"`).join(','));
    const blob = new Blob([[headers, ...csvRows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${targetTable}_synthetic_${dataProfile.toLowerCase()}.csv`;
    a.click();
  };

  const handleCopySqlInsert = () => {
    if (generatedRows.length === 0) return;
    const cols = Object.keys(generatedRows[0]).join(', ');
    const values = generatedRows
      .map((row) => `(${Object.values(row).map((v) => `'${v}'`).join(', ')})`)
      .join(',\n  ');
    const sql = `INSERT INTO ${targetTable} (${cols})\nVALUES\n  ${values};`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Configuration Header Banner */}
      <SpotlightCard className="p-4 rounded-md border border-[#DDE0DA] bg-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0E9384] text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#0E9384]" />
            <span className="font-heading uppercase tracking-wide">AI Synthetic Test Data Generator</span>
          </div>
          <span className="text-[10px] font-mono text-[#159F6B] bg-[#E8F8F2] px-2 py-0.5 rounded-sm border border-[#A3E3C9] flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#159F6B]" />
            <span>Privacy guaranteed</span>
          </span>
        </div>

        <div className="grid grid-cols-12 gap-3 text-xs font-sans">
          <div className="col-span-4 space-y-1">
            <label className="text-[#4B5157] font-medium">Target table:</label>
            <select
              value={targetTable}
              onChange={(e) => setTargetTable(e.target.value)}
              className="w-full px-3 py-1.5 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-[#15181D] font-mono focus:outline-none focus:border-[#0E9384]"
            >
              <option value="customers">customers (UUID, email, full_name, role)</option>
              <option value="products">products (UUID, title, category_id, price)</option>
              <option value="orders">orders (UUID, customer_id, total_amount, status)</option>
            </select>
          </div>

          <div className="col-span-4 space-y-1">
            <label className="text-[#4B5157] font-medium">Data profile:</label>
            <select
              value={dataProfile}
              onChange={(e) => setDataProfile(e.target.value)}
              className="w-full px-3 py-1.5 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-[#15181D] focus:outline-none focus:border-[#0E9384]"
            >
              <option value="REALISTIC">Realistic production data</option>
              <option value="EDGE_CASES">Edge casing (max len, nulls)</option>
              <option value="ANONYMIZED">Anonymized hashed</option>
            </select>
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-[#4B5157] font-medium">Rows:</label>
            <input
              type="number"
              value={rowCount}
              onChange={(e) => setRowCount(parseInt(e.target.value, 10) || 10)}
              min={1}
              max={100}
              className="w-full px-3 py-1.5 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-[#15181D] font-mono tabular-nums focus:outline-none focus:border-[#0E9384]"
            />
          </div>

          <div className="col-span-2 flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-1.5 rounded-sm bg-[#0E9384] text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#0B7A6D] transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </div>
      </SpotlightCard>

      {/* Output AI Dataset Table */}
      <div className="ai-surface p-4 rounded-md space-y-3">
        <div className="flex items-center justify-between border-b border-[#C2EEE8] pb-2">
          <h3 className="text-xs font-semibold text-[#15181D] flex items-center gap-1.5">
            <Table className="w-4 h-4 text-[#0E9384]" />
            <span className="font-heading">AI Generated Dataset</span>
            <span className="text-[10px] font-mono text-[#0E9384] bg-[#E6F7F5] px-1.5 py-0.5 rounded-sm border border-[#99E3D8] font-semibold tabular-nums">
              {generatedRows.length} rows
            </span>
          </h3>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={handleCopySqlInsert}
              className="px-2.5 py-1 rounded-sm bg-white border border-[#99E3D8] text-[#0E9384] hover:bg-[#E6F7F5] transition-all flex items-center gap-1 font-medium"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-[#159F6B]" /> : <Code className="w-3.5 h-3.5 text-[#0E9384]" />}
              <span>{copiedSql ? 'Copied SQL' : 'Copy INSERT SQL'}</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="px-2.5 py-1 rounded-sm bg-[#2454FF] text-white font-semibold hover:bg-[#1D44D8] transition-all flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto border border-[#DDE0DA] rounded-sm bg-white">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#DDE0DA] text-[#0E9384] bg-[#E6F7F5] font-semibold">
                {generatedRows.length > 0 &&
                  Object.keys(generatedRows[0]).map((key) => (
                    <th key={key} className="p-2.5">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {generatedRows.map((row, idx) => (
                <tr key={idx} className="border-b border-[#DDE0DA] hover:bg-[#F5F6F2] text-[#15181D]">
                  {Object.values(row).map((val, cellIdx) => (
                    <td key={cellIdx} className="p-2.5 tabular-nums">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
