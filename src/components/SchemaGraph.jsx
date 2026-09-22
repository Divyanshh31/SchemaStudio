import React, { useState, useMemo } from 'react';
import { ReactFlow, Background, Controls, MiniMap, Handle, Position, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { sampleEcommerceSchema, parseSchemaToGraph, generateDbmlText } from '../services/schemaParser';
import { Database, Key, Link, Table, Search, X, Check, Copy, Download, Share2, History, RefreshCw, ZoomIn, ZoomOut, Maximize2, Sparkles, Layers } from 'lucide-react';

// Precision Table Node Component with CAD Corner-Tick device
function TableNode({ data }) {
  const { name, rows, health, columns } = data;
  return (
    <div className="bg-white border border-[#DDE0DA] rounded-sm min-w-[260px] text-xs font-mono overflow-hidden transition-all hover:border-[#2454FF] corner-tick">
      <Handle type="target" position={Position.Top} className="!bg-[#2454FF] !w-2 !h-2 !border-0" />

      {/* Node Header */}
      <div className="bg-[#F5F6F2] px-3 py-1.5 border-b border-[#DDE0DA] flex items-center justify-between font-bold text-[#15181D]">
        <div className="flex items-center gap-1.5">
          <Table className="w-3.5 h-3.5 text-[#2454FF]" />
          <span>{name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              health === 'RISKY' ? 'bg-[#D0334C]' : health === 'WARNING' ? 'bg-[#C2790A]' : 'bg-[#159F6B]'
            }`}
          />
          <span className="text-[10px] text-[#7A8087] font-normal tabular-nums">{rows ? `${rows.toLocaleString()}` : ''}</span>
        </div>
      </div>

      {/* Column Rows */}
      <div className="p-1 space-y-0.5">
        {columns &&
          columns.map((col) => (
            <div
              key={col.name}
              className="flex items-center justify-between px-2 py-0.5 rounded-sm hover:bg-[#F5F6F2] text-[#353A40] transition-colors"
            >
              <span className="flex items-center gap-1.5 text-xs text-[#15181D]">
                {col.isPk && <span className="text-[#C2790A] text-[9px] font-bold bg-[#FDF0D6] px-1 rounded-sm border border-[#FBE0AD]">PK</span>}
                {col.isFk && <span className="text-[#2454FF] text-[9px] font-bold bg-[#EEF2FF] px-1 rounded-sm border border-[#C7D2FE]">FK</span>}
                <span>{col.name}</span>
              </span>
              <span className="text-[10px] text-[#7A8087] font-mono">{col.type}</span>
            </div>
          ))}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-[#2454FF] !w-2 !h-2 !border-0" />
    </div>
  );
}

export default function SchemaGraph() {
  const nodeTypes = useMemo(() => ({ tableNode: TableNode }), []);
  const initialParsed = useMemo(() => parseSchemaToGraph(sampleEcommerceSchema), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialParsed.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialParsed.edges);
  const [dbmlCode, setDbmlCode] = useState(() => generateDbmlText(sampleEcommerceSchema));
  const [copiedDbml, setCopiedDbml] = useState(false);

  const handleCopyDbml = () => {
    navigator.clipboard.writeText(dbmlCode);
    setCopiedDbml(true);
    setTimeout(() => setCopiedDbml(false), 2000);
  };

  const handleApplyDbml = () => {
    const parsed = parseSchemaToGraph(sampleEcommerceSchema);
    setNodes(parsed.nodes);
    setEdges(parsed.edges);
  };

  const lineNumbers = dbmlCode.split('\n').map((_, i) => i + 1);

  return (
    <div className="surface-card rounded-md border border-[#DDE0DA] overflow-hidden flex flex-col h-[740px] bg-white">
      {/* Top Header Toolbar */}
      <div className="bg-[#F5F6F2] border-b border-[#DDE0DA] px-4 py-2 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#15181D] font-bold text-xs">
            <Database className="w-4 h-4 text-[#2454FF]" />
            <span>ecommerce_prod_db</span>
          </div>
          <span className="text-[10px] bg-white text-[#2454FF] px-2 py-0.5 rounded-sm border border-[#DDE0DA] font-semibold tabular-nums">
            5 tables • 156.4K rows
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyDbml}
            className="px-2.5 py-1 rounded-sm bg-white border border-[#DDE0DA] text-[#4B5157] hover:text-[#15181D] hover:border-[#C3C8BF] transition-all flex items-center gap-1.5"
          >
            {copiedDbml ? <Check className="w-3.5 h-3.5 text-[#159F6B]" /> : <Copy className="w-3.5 h-3.5 text-[#2454FF]" />}
            <span>{copiedDbml ? 'Copied DBML' : 'Copy DBML'}</span>
          </button>
          <button
            onClick={handleApplyDbml}
            className="px-3 py-1 rounded-sm bg-[#2454FF] text-white font-semibold hover:bg-[#1D44D8] transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Update graph</span>
          </button>
        </div>
      </div>

      {/* Main Studio Split Area */}
      <div className="grid grid-cols-12 flex-1 overflow-hidden">
        {/* Left Side: DBML Code Studio Editor */}
        <div className="col-span-4 border-r border-[#DDE0DA] bg-white flex flex-col justify-between font-mono text-xs">
          <div className="bg-[#F5F6F2] px-3.5 py-1.5 border-b border-[#DDE0DA] text-[11px] text-[#7A8087] flex items-center justify-between font-semibold">
            <span>DBML studio editor</span>
            <span>schema.dbml</span>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Line Numbers */}
            <div className="bg-[#F5F6F2] border-r border-[#DDE0DA] py-3 px-2 text-[#7A8087] text-right font-mono text-xs select-none tabular-nums">
              {lineNumbers.map((n) => (
                <div key={n} className="leading-5">
                  {n}
                </div>
              ))}
            </div>

            {/* Code Textarea */}
            <textarea
              value={dbmlCode}
              onChange={(e) => setDbmlCode(e.target.value)}
              className="flex-1 p-3 bg-white text-[#15181D] font-mono text-xs leading-5 resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>

          <div className="p-2 bg-[#F5F6F2] border-t border-[#DDE0DA] text-[10px] text-[#7A8087] flex items-center justify-between">
            <span>Live DBML syntax active</span>
            <span className="text-[#159F6B] font-semibold">Parser online</span>
          </div>
        </div>

        {/* Right Side: Interactive React Flow Graph Canvas */}
        <div className="col-span-8 relative bg-[#F5F6F2]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#DDE0DA" gap={24} />
            <Controls className="!bg-white !border-[#DDE0DA] !rounded-sm !shadow-none" />
            <MiniMap className="!bg-white !border-[#DDE0DA] !rounded-sm" nodeColor="#2454FF" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
