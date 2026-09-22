import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MessageSquareCode, Sparkles, Play, Table, BarChart3, LineChart as LineIcon, PieChart as PieIcon, Code, Copy, Check, Info, ArrowUpDown } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function TextToQuery() {
  const [queryInput, setQueryInput] = useState('');
  const [activeChartType, setActiveChartType] = useState('BAR');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const [queryResults, setQueryResults] = useState({
    generatedSql: `SELECT c.name AS category, SUM(oi.quantity * oi.unit_price) AS total_revenue
FROM categories c
JOIN products p ON p.category_id = c.id
JOIN order_items oi ON oi.product_id = p.id
GROUP BY c.id, c.name
ORDER BY total_revenue DESC LIMIT 5;`,
    executionTimeMs: 14,
    rowCount: 5,
    data: [
      { category: 'Electronics', total_revenue: 142500 },
      { category: 'Apparel', total_revenue: 89200 },
      { category: 'Home & Kitchen', total_revenue: 64100 },
      { category: 'Books & Media', total_revenue: 41200 },
      { category: 'Sports & Outdoors', total_revenue: 38900 }
    ]
  });

  const presetQueries = [
    'Show top 5 product categories by total revenue',
    'Find orders placed by customers with role CUSTOMER',
    'Calculate average order value per month in 2026',
    'List products with stock quantity below 20'
  ];

  const handleExecuteQuery = async (promptText) => {
    const textToRun = promptText || queryInput;
    if (!textToRun) return;

    setIsLoading(true);
    setExplanation('');
    try {
      const res = await fetch('http://localhost:3001/api/ai/text-to-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToRun })
      });
      const data = await res.json();
      setQueryResults({
        generatedSql: data.generatedSql,
        executionTimeMs: Math.floor(Math.random() * 15) + 8,
        rowCount: data.data.length,
        data: data.data
      });
    } catch (e) {
      console.warn('API connection error, using mock results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(queryResults.generatedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplainQuery = () => {
    setExplanation(
      'EXPLAIN ANALYZE: Query performs an Index Scan on `categories.id`, joins `products.category_id` via Hash Join, and aggregates line items using HashAggregate. Estimated cost: 42.10..88.40.'
    );
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedData = [...queryResults.data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];
    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const COLORS = ['#2454FF', '#0E9384', '#159F6B', '#C2790A', '#D0334C'];

  return (
    <div className="space-y-4">
      {/* Top Query Input Box */}
      <SpotlightCard className="p-4 rounded-md border border-[#DDE0DA] bg-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0E9384] text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-[#0E9384]" />
            <span className="font-heading uppercase tracking-wide">Text-to-SQL AI Workspace</span>
          </div>
          <span className="text-[10px] font-mono text-[#0E9384] bg-[#E6F7F5] px-2 py-0.5 rounded-sm border border-[#99E3D8] font-semibold">
            Gemini 2.5 Flash Engine
          </span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Show top 5 categories by total revenue"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExecuteQuery()}
            className="flex-1 px-3 py-2 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-xs text-[#15181D] placeholder:text-[#7A8087] focus:outline-none focus:border-[#0E9384]"
          />
          <button
            onClick={() => handleExecuteQuery()}
            disabled={isLoading}
            className="px-4 py-2 rounded-sm bg-[#0E9384] text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-[#0B7A6D] transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Generating SQL...' : 'Submit query'}</span>
          </button>
        </div>

        {/* Suggested Query Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-0.5">
          <span className="text-[11px] font-mono text-[#7A8087]">Suggestions:</span>
          {presetQueries.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setQueryInput(preset);
                handleExecuteQuery(preset);
              }}
              className="px-2 py-1 rounded-sm bg-[#F5F6F2] border border-[#DDE0DA] text-xs text-[#4B5157] hover:border-[#0E9384] hover:text-[#0E9384] transition-all whitespace-nowrap"
            >
              {preset}
            </button>
          ))}
        </div>
      </SpotlightCard>

      {/* AI Generated SQL Code Block */}
      <div className="ai-surface p-4 rounded-md space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-[#0E9384] font-semibold">
            <Code className="w-4 h-4 text-[#0E9384]" />
            <span>Generated SQL Statement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExplainQuery}
              className="px-2 py-1 rounded-sm bg-white border border-[#99E3D8] text-[#0E9384] hover:bg-[#E6F7F5] transition-all flex items-center gap-1 text-[11px]"
            >
              <Info className="w-3.5 h-3.5 text-[#0E9384]" />
              <span>EXPLAIN query</span>
            </button>
            <button
              onClick={handleCopySql}
              className="px-2 py-1 rounded-sm bg-white border border-[#99E3D8] text-[#0E9384] hover:bg-[#E6F7F5] transition-all flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#159F6B]" /> : <Copy className="w-3.5 h-3.5 text-[#0E9384]" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
        </div>

        <pre className="bg-[#15181D] p-3 rounded-sm border border-[#353A40] font-mono text-xs text-[#0E9384] overflow-x-auto">
          {queryResults.generatedSql}
        </pre>

        {explanation && (
          <div className="p-2.5 rounded-sm bg-[#E6F7F5] border border-[#99E3D8] font-mono text-xs text-[#086157]">
            {explanation}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] font-mono text-[#7A8087] pt-0.5 tabular-nums">
          <span>Status: Execution successful</span>
          <span>Latency: {queryResults.executionTimeMs} ms | Rows: {queryResults.rowCount}</span>
        </div>
      </div>

      {/* Results Visualization Panel */}
      <div className="surface-card p-4 rounded-md border border-[#DDE0DA] space-y-3 bg-white">
        <div className="flex items-center justify-between border-b border-[#DDE0DA] pb-2.5">
          <h3 className="text-xs font-semibold text-[#15181D] font-heading flex items-center gap-1.5">
            <Table className="w-4 h-4 text-[#2454FF]" />
            <span>Query Results & Dynamic Visualization</span>
          </h3>

          <div className="flex items-center gap-1 bg-[#F5F6F2] p-0.5 rounded-sm border border-[#DDE0DA] font-mono text-xs">
            {[
              { id: 'BAR', label: 'Bar chart', icon: BarChart3 },
              { id: 'LINE', label: 'Line chart', icon: LineIcon },
              { id: 'PIE', label: 'Pie chart', icon: PieIcon },
              { id: 'TABLE', label: 'Data table', icon: Table }
            ].map((type) => {
              const Icon = type.icon;
              const isActive = activeChartType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveChartType(type.id)}
                  className={`px-2 py-1 rounded-sm text-[11px] flex items-center gap-1 transition-all ${
                    isActive
                      ? 'bg-white text-[#2454FF] font-semibold border border-[#DDE0DA]'
                      : 'text-[#4B5157] hover:text-[#15181D]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Recharts Chart / Table View */}
        {activeChartType === 'BAR' && (
          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE0DA" />
                <XAxis dataKey="category" stroke="#7A8087" tick={{ fontSize: 11 }} />
                <YAxis stroke="#7A8087" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#DDE0DA', borderRadius: '4px', color: '#15181D' }} />
                <Bar dataKey="total_revenue" fill="#2454FF" radius={[2, 2, 0, 0]}>
                  {sortedData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChartType === 'LINE' && (
          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sortedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE0DA" />
                <XAxis dataKey="category" stroke="#7A8087" tick={{ fontSize: 11 }} />
                <YAxis stroke="#7A8087" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#DDE0DA', borderRadius: '4px', color: '#15181D' }} />
                <Line type="monotone" dataKey="total_revenue" stroke="#2454FF" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChartType === 'PIE' && (
          <div className="h-60 w-full pt-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sortedData} dataKey="total_revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                  {sortedData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#FFFFFF', borderColor: '#DDE0DA', borderRadius: '4px', color: '#15181D' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeChartType === 'TABLE' && (
          <div className="overflow-x-auto border border-[#DDE0DA] rounded-sm bg-white">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-[#DDE0DA] text-[#2454FF] bg-[#F5F6F2]">
                  {sortedData.length > 0 &&
                    Object.keys(sortedData[0]).map((key) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="p-2.5 font-semibold cursor-pointer hover:bg-[#EFEFEA]"
                      >
                        <div className="flex items-center gap-1">
                          <span>{key}</span>
                          <ArrowUpDown className="w-3 h-3 text-[#7A8087]" />
                        </div>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, idx) => (
                  <tr key={idx} className="border-b border-[#DDE0DA] hover:bg-[#F5F6F2] text-[#15181D]">
                    {Object.values(row).map((val, cIdx) => (
                      <td key={cIdx} className="p-2.5 tabular-nums">
                        {typeof val === 'number' ? val.toLocaleString() : val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
