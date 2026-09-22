import React, { useState } from 'react';
import { ShieldAlert, Eye, EyeOff, Key, Lock, Check, Copy, Code, Sparkles, Filter } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function SecurityMasking() {
  const [activeRole, setActiveRole] = useState('ANALYST');
  const [copied, setCopied] = useState(false);

  const [maskingRules, setMaskingRules] = useState([
    { column: 'users.email', maskType: 'EMAIL_PARTIAL', sampleOriginal: 'alex.chen@tech.io', sampleMasked: 'a***@tech.io', active: true },
    { column: 'users.phone_number', maskType: 'REGEX_LAST4', sampleOriginal: '+1-555-839-2019', sampleMasked: '***-***-2019', active: true },
    { column: 'patients.ssn', maskType: 'FULL_REDACT', sampleOriginal: '987-65-4321', sampleMasked: '***-**-****', active: true },
    { column: 'billing.credit_card', maskType: 'CARD_LAST4', sampleOriginal: '4532-1198-3482-9012', sampleMasked: '****-****-****-9012', active: true }
  ]);

  const toggleRule = (column) => {
    setMaskingRules(
      maskingRules.map((r) => (r.column === column ? { ...r, active: !r.active } : r))
    );
  };

  const generateRlsPoliciesSql = () => {
    return `-- SchemaStudio Automated RLS Policies & Dynamic Data Masking\n\nBEGIN;\n\n-- 1. Enable Row Level Security on Sensitive Tables\nALTER TABLE users ENABLE ROW LEVEL SECURITY;\nALTER TABLE billing ENABLE ROW LEVEL SECURITY;\n\n-- 2. Tenant & Owner Access Policy\nCREATE POLICY user_tenant_isolation_policy ON users\n  FOR SELECT\n  USING (id = auth.uid() OR auth.jwt() ->> 'role' = 'ADMIN');\n\n-- 3. Dynamic Column Masking Function\nCREATE OR REPLACE FUNCTION mask_email(email text)\nRETURNS text AS $$\n  SELECT regexp_replace(email, '(^.).*(@.*$)', '\\1***\\2');\n$$ LANGUAGE sql IMMUTABLE;\n\nCOMMIT;`;
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(generateRlsPoliciesSql());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <SpotlightCard className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">DYNAMIC DATA MASKING & RLS POLICY ENGINE</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Protect sensitive PII, SSN, and financial columns with role-based access control (RLS) and real-time data masking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={handleCopySql}
              className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED RLS SQL' : 'COPY RLS POLICIES'}</span>
            </button>
          </div>
        </div>

        {/* Role Simulator Controls */}
        <div className="flex items-center justify-between pt-3 font-mono text-xs border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">SIMULATED VIEWER ROLE:</span>
            {['ADMIN', 'ANALYST', 'SUPPORT'].map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-3 py-1 rounded-md transition-all font-semibold ${
                  activeRole === role
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 text-[11px] font-semibold">
            {activeRole === 'ADMIN' ? 'UNMASKED FULL ACCESS' : 'DYNAMIC MASKING ENFORCED'}
          </span>
        </div>
      </SpotlightCard>

      {/* Masking Rules Table */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-indigo-600" />
            <span>ACTIVE COLUMN MASKING RULES ({maskingRules.length})</span>
          </h3>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-indigo-700 bg-slate-50 font-semibold">
                <th className="p-3">COLUMN</th>
                <th className="p-3">MASK STRATEGY</th>
                <th className="p-3">ORIGINAL VALUE (RAW)</th>
                <th className="p-3">RESULT FOR ROLE ({activeRole})</th>
                <th className="p-3">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {maskingRules.map((rule) => (
                <tr key={rule.column} className="border-b border-slate-100 hover:bg-slate-50 text-slate-700">
                  <td className="p-3 font-bold text-slate-900">{rule.column}</td>
                  <td className="p-3 text-emerald-700 font-semibold">{rule.maskType}</td>
                  <td className="p-3 text-slate-400">{rule.sampleOriginal}</td>
                  <td className="p-3 font-bold text-indigo-600">
                    {activeRole === 'ADMIN' || !rule.active ? rule.sampleOriginal : rule.sampleMasked}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleRule(rule.column)}
                      className={`px-2.5 py-0.5 rounded text-[10px] border font-semibold ${
                        rule.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {rule.active ? 'ENFORCED' : 'DISABLED'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SQL Policy Block */}
        <div className="pt-2 space-y-2 font-mono text-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">POSTGRESQL RLS & MASKING DDL SCRIPT:</span>
          <pre className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-emerald-400 text-xs overflow-x-auto font-mono">
            {generateRlsPoliciesSql()}
          </pre>
        </div>
      </div>
    </div>
  );
}
