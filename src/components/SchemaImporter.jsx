import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Code, Check, Copy, Table, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';

export default function SchemaImporter() {
  const [rawText, setRawText] = useState(`id,email,full_name,age,is_active,signup_date
usr_101,alex.chen@tech.io,Alex Chen,28,true,2026-09-15T14:20:00Z
usr_102,priya.sharma@srm.edu,Priya Sharma,22,true,2026-09-18T09:45:12Z
usr_103,david.m@corp.com,David Miller,34,false,2026-09-20T18:02:44Z`);

  const [tableName, setTableName] = useState('imported_dataset');
  const [copied, setCopied] = useState(false);

  // Inferred Schema Parsing logic
  const parseInferredSchema = () => {
    const lines = rawText.trim().split('\n');
    if (lines.length === 0) return { columns: [], sampleRows: [] };

    const headers = lines[0].split(',').map((h) => h.trim().replace(/"/g, ''));
    const rows = lines.slice(1).map((line) => line.split(',').map((cell) => cell.trim().replace(/"/g, '')));

    const columns = headers.map((header, colIdx) => {
      const sampleVal = rows[0] ? rows[0][colIdx] : '';
      let detectedType = 'VARCHAR(255)';
      let isPk = header.toLowerCase() === 'id' || header.toLowerCase().endsWith('_id');

      if (!isNaN(sampleVal) && sampleVal !== '') {
        detectedType = Number.isInteger(Number(sampleVal)) ? 'INTEGER' : 'DECIMAL(10,2)';
      } else if (sampleVal === 'true' || sampleVal === 'false') {
        detectedType = 'BOOLEAN';
      } else if (sampleVal.includes('Z') || sampleVal.includes('-') && sampleVal.includes(':')) {
        detectedType = 'TIMESTAMPTZ';
      } else if (sampleVal.length > 100) {
        detectedType = 'TEXT';
      }

      return { name: header, type: detectedType, isPk, sample: sampleVal };
    });

    return { columns, sampleRows: rows.slice(0, 5) };
  };

  const inferred = parseInferredSchema();

  const generateSqlDdl = () => {
    let sql = `-- Auto-generated DDL inferred from CSV dataset\nCREATE TABLE ${tableName} (\n`;
    inferred.columns.forEach((col, idx) => {
      const pk = col.isPk ? ' PRIMARY KEY' : '';
      const isLast = idx === inferred.columns.length - 1;
      sql += `  ${col.name.padEnd(20)} ${col.type}${pk}${isLast ? '' : ','}\n`;
    });
    sql += `);`;
    return sql;
  };

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(generateSqlDdl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="surface-card p-5 rounded-xl border border-[#E2E8F0] space-y-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-[#0F172A]">DATASET SCHEMA INFERRER & DDL GENERATOR</h2>
              <p className="text-xs font-mono text-[#64748B] mt-0.5">
                Paste raw CSV or JSON data to automatically infer data types, constraints, and generate SQL DDL.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleCopyDdl}
              className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white font-medium hover:bg-[#4338CA] transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED DDL' : 'COPY SQL DDL'}</span>
            </button>
          </div>
        </div>

        {/* Input Text Area & Table Name */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">TARGET TABLE NAME:</span>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value || 'imported_dataset')}
                className="px-2.5 py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#4F46E5] font-mono focus:outline-none focus:border-[#4F46E5]"
              />
            </div>
            <span className="text-[#64748B]">{inferred.columns.length} columns inferred</span>
          </div>

          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste CSV headers and rows here..."
            className="w-full p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5]"
          />
        </div>
      </div>

      {/* Inferred Columns Breakdown */}
      <div className="surface-card p-5 rounded-xl border border-[#E2E8F0] space-y-4 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
          <h3 className="text-xs font-mono font-semibold text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <span>INFERRED SCHEMA COLUMNS & TYPES</span>
          </h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#4F46E5] bg-[#F8FAFC]">
                <th className="p-2.5">COLUMN NAME</th>
                <th className="p-2.5">INFERRED DATA TYPE</th>
                <th className="p-2.5">PRIMARY KEY</th>
                <th className="p-2.5">SAMPLE VALUE</th>
              </tr>
            </thead>
            <tbody>
              {inferred.columns.map((col) => (
                <tr key={col.name} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] text-[#334155]">
                  <td className="p-2.5 font-semibold text-[#0F172A]">{col.name}</td>
                  <td className="p-2.5 text-[#059669] font-medium">{col.type}</td>
                  <td className="p-2.5 text-[11px]">
                    {col.isPk ? (
                      <span className="text-[#D97706] bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FDE68A] font-semibold">YES</span>
                    ) : (
                      <span className="text-[#94A3B8]">NO</span>
                    )}
                  </td>
                  <td className="p-2.5 text-[#64748B]">{col.sample}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Generated DDL Block */}
        <div className="pt-2 space-y-2">
          <span className="text-[11px] font-mono text-[#64748B]">GENERATED POSTGRESQL DDL:</span>
          <pre className="bg-[#0F172A] p-3.5 rounded-lg border border-[#1E293B] font-mono text-xs text-[#38BDF8] overflow-x-auto">
            {generateSqlDdl()}
          </pre>
        </div>
      </div>
    </div>
  );
}
