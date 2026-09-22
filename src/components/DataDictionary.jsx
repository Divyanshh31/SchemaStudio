import React, { useState } from 'react';
import { BookOpen, Download, Search, Table, Key, Link2, FileText, Check, Copy, Sparkles, Filter, Code } from 'lucide-react';

export default function DataDictionary() {
  const [activePreset, setActivePreset] = useState('ECOMMERCE');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedFormat, setCopiedFormat] = useState(null);

  const dictionaries = {
    ECOMMERCE: [
      {
        table: 'users',
        description: 'Primary customer and administration user registry for authentication and order ownership.',
        rowCount: 14250,
        columns: [
          { name: 'id', type: 'UUID', isPk: true, isFk: false, nullable: false, index: 'PRIMARY KEY', description: 'Unique surrogate identifier for user.' },
          { name: 'email', type: 'VARCHAR(255)', isPk: false, isFk: false, nullable: false, index: 'UNIQUE idx_users_email', description: 'Primary login email address.' },
          { name: 'full_name', type: 'VARCHAR(100)', isPk: false, isFk: false, nullable: false, index: 'NONE', description: 'User full display name.' },
          { name: 'role', type: 'ENUM(CUSTOMER, ADMIN)', isPk: false, isFk: false, nullable: false, index: 'idx_users_role', description: 'System authorization role flag.' },
          { name: 'created_at', type: 'TIMESTAMPTZ', isPk: false, isFk: false, nullable: false, index: 'idx_users_created', description: 'Account creation UTC timestamp.' }
        ]
      },
      {
        table: 'products',
        description: 'Catalog items available for purchase with inventory stock and category classification.',
        rowCount: 3420,
        columns: [
          { name: 'id', type: 'UUID', isPk: true, isFk: false, nullable: false, index: 'PRIMARY KEY', description: 'Product identifier.' },
          { name: 'title', type: 'VARCHAR(200)', isPk: false, isFk: false, nullable: false, index: 'idx_products_title', description: 'Public product catalog title.' },
          { name: 'category_id', type: 'UUID', isPk: false, isFk: true, fkTarget: 'categories.id', nullable: false, index: 'idx_products_category', description: 'Foreign key referencing category table.' },
          { name: 'price', type: 'NUMERIC(10,2)', isPk: false, isFk: false, nullable: false, index: 'NONE', description: 'Base retail price in USD.' },
          { name: 'stock_qty', type: 'INTEGER', isPk: false, isFk: false, nullable: false, index: 'idx_products_stock', description: 'Current available warehouse inventory.' }
        ]
      },
      {
        table: 'orders',
        description: 'Customer order transactions recording payment status and order monetary totals.',
        rowCount: 48200,
        columns: [
          { name: 'id', type: 'UUID', isPk: true, isFk: false, nullable: false, index: 'PRIMARY KEY', description: 'Unique order invoice reference.' },
          { name: 'user_id', type: 'UUID', isPk: false, isFk: true, fkTarget: 'users.id', nullable: false, index: 'idx_orders_user', description: 'Customer owner of the order.' },
          { name: 'total_amount', type: 'NUMERIC(12,2)', isPk: false, isFk: false, nullable: false, index: 'NONE', description: 'Final order total amount.' },
          { name: 'status', type: 'ENUM(PENDING, PAID, SHIPPED)', isPk: false, isFk: false, nullable: false, index: 'idx_orders_status', description: 'Fulfillment workflow status.' },
          { name: 'created_at', type: 'TIMESTAMPTZ', isPk: false, isFk: false, nullable: false, index: 'idx_orders_created', description: 'Order placement timestamp.' }
        ]
      }
    ],
    SAAS: [
      {
        table: 'organizations',
        description: 'Multi-tenant organization accounts subscribing to SaaS platform services.',
        rowCount: 840,
        columns: [
          { name: 'id', type: 'UUID', isPk: true, isFk: false, nullable: false, index: 'PRIMARY KEY', description: 'Tenant organization ID.' },
          { name: 'name', type: 'VARCHAR(150)', isPk: false, isFk: false, nullable: false, index: 'idx_orgs_name', description: 'Company or team workspace name.' },
          { name: 'plan_tier', type: 'ENUM(FREE, PRO, ENTERPRISE)', isPk: false, isFk: false, nullable: false, index: 'NONE', description: 'Subscription tier level.' }
        ]
      },
      {
        table: 'audit_logs',
        description: 'Immutable security log tracing user actions across organization tenants.',
        rowCount: 450000,
        columns: [
          { name: 'id', type: 'UUID', isPk: true, isFk: false, nullable: false, index: 'PRIMARY KEY', description: 'Log entry UUID.' },
          { name: 'org_id', type: 'UUID', isPk: false, isFk: true, fkTarget: 'organizations.id', nullable: false, index: 'idx_audit_org', description: 'Tenant context organization.' },
          { name: 'action', type: 'VARCHAR(100)', isPk: false, isFk: false, nullable: false, index: 'idx_audit_action', description: 'Event action identifier.' },
          { name: 'created_at', type: 'TIMESTAMPTZ', isPk: false, isFk: false, nullable: false, index: 'idx_audit_created', description: 'Event occurrence timestamp.' }
        ]
      }
    ]
  };

  const currentTables = dictionaries[activePreset] || dictionaries.ECOMMERCE;

  const filteredTables = currentTables.filter(
    (t) =>
      t.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.columns.some((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const generateMarkdownDict = () => {
    let md = `# Data Dictionary - ${activePreset} Schema\n\n`;
    currentTables.forEach((tbl) => {
      md += `## Table: \`${tbl.table}\` (${tbl.rowCount.toLocaleString()} rows)\n`;
      md += `${tbl.description}\n\n`;
      md += `| Column | Data Type | Key | Nullable | Index | Description |\n`;
      md += `| --- | --- | --- | --- | --- | --- |\n`;
      tbl.columns.forEach((col) => {
        const keyType = col.isPk ? 'PK' : col.isFk ? `FK (${col.fkTarget})` : '-';
        md += `| \`${col.name}\` | \`${col.type}\` | ${keyType} | ${col.nullable ? 'YES' : 'NO'} | \`${col.index}\` | ${col.description} |\n`;
      });
      md += `\n---\n\n`;
    });
    return md;
  };

  const handleExportMarkdown = () => {
    const mdContent = generateMarkdownDict();
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_dictionary_${activePreset.toLowerCase()}.md`;
    a.click();
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownDict());
    setCopiedFormat('MD');
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="surface-card p-5 rounded-xl border border-[#E2E8F0] space-y-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-[#0F172A]">AUTOMATED DATA DICTIONARY & SPECIFICATION</h2>
              <p className="text-xs font-mono text-[#64748B] mt-0.5">
                Comprehensive technical schema documentation with key annotations and indexes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all flex items-center gap-1.5"
            >
              {copiedFormat === 'MD' ? <Check className="w-3.5 h-3.5 text-[#059669]" /> : <Copy className="w-3.5 h-3.5 text-[#4F46E5]" />}
              <span>{copiedFormat === 'MD' ? 'COPIED MD' : 'COPY MARKDOWN'}</span>
            </button>
            <button
              onClick={handleExportMarkdown}
              className="px-3 py-1.5 rounded-lg bg-[#4F46E5] text-white font-medium hover:bg-[#4338CA] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT DATA DICTIONARY</span>
            </button>
          </div>
        </div>

        {/* Filters & Presets */}
        <div className="flex items-center justify-between pt-1 font-mono text-xs gap-3">
          <div className="flex items-center gap-2 bg-[#F8FAFC] p-1 rounded-lg border border-[#E2E8F0]">
            {['ECOMMERCE', 'SAAS'].map((preset) => (
              <button
                key={preset}
                onClick={() => setActivePreset(preset)}
                className={`px-3 py-1 rounded-md transition-all ${
                  activePreset === preset
                    ? 'bg-white text-[#4F46E5] font-semibold border border-[#C7D2FE] shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search table, column name, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#4F46E5]"
            />
          </div>
        </div>
      </div>

      {/* Tables Breakdown */}
      <div className="space-y-4">
        {filteredTables.map((tbl) => (
          <div key={tbl.table} className="surface-card p-5 rounded-xl border border-[#E2E8F0] space-y-3 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2.5">
                <Table className="w-4 h-4 text-[#4F46E5]" />
                <h3 className="font-mono text-xs font-semibold text-[#0F172A] uppercase">
                  {tbl.table}
                </h3>
                <span className="text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
                  {tbl.rowCount.toLocaleString()} ROWS
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#64748B]">{tbl.columns.length} COLUMNS</span>
            </div>

            <p className="text-xs font-mono text-[#64748B]">{tbl.description}</p>

            <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#4F46E5] bg-[#F8FAFC]">
                    <th className="p-2.5">COLUMN NAME</th>
                    <th className="p-2.5">DATA TYPE</th>
                    <th className="p-2.5">KEY / FK TARGET</th>
                    <th className="p-2.5">NULLABLE</th>
                    <th className="p-2.5">INDEXING</th>
                    <th className="p-2.5">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {tbl.columns.map((col) => (
                    <tr key={col.name} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] text-[#334155]">
                      <td className="p-2.5 font-semibold text-[#0F172A] flex items-center gap-1.5">
                        {col.isPk && <Key className="w-3 h-3 text-[#D97706]" />}
                        {col.isFk && <Link2 className="w-3 h-3 text-[#4F46E5]" />}
                        <span>{col.name}</span>
                      </td>
                      <td className="p-2.5 text-[#059669] font-medium">{col.type}</td>
                      <td className="p-2.5 text-[11px]">
                        {col.isPk ? (
                          <span className="text-[#D97706] bg-[#FEF3C7] px-1.5 py-0.5 rounded border border-[#FDE68A] font-semibold">PRIMARY</span>
                        ) : col.isFk ? (
                          <span className="text-[#4F46E5] bg-[#EEF2FF] px-1.5 py-0.5 rounded border border-[#C7D2FE] font-semibold">
                            FK → {col.fkTarget}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8]">-</span>
                        )}
                      </td>
                      <td className="p-2.5 text-[11px] text-[#64748B]">{col.nullable ? 'YES' : 'NO'}</td>
                      <td className="p-2.5 text-[11px] text-[#64748B]">{col.index}</td>
                      <td className="p-2.5 text-[#64748B]">{col.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
