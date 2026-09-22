import React from 'react';
import { Activity, Server, Cpu, HardDrive, ShieldCheck, CheckCircle2, Zap, RefreshCw } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';
import AnimatedCounter from './bits/AnimatedCounter';

export default function SystemHealth() {
  const metrics = [
    { label: 'CPU UTILIZATION', rawVal: 24, unit: '%', status: 'HEALTHY', sub: '8 vCPUs Dedicated' },
    { label: 'MEMORY ALLOCATION', rawVal: 48, unit: '%', status: 'HEALTHY', sub: '3.8 / 8.0 GB Utilized' },
    { label: 'DISK I/O THROUGHPUT', rawVal: 320, unit: ' IOPS', status: 'HEALTHY', sub: 'Provisioned NVMe SSD' },
    { label: 'REPLICATION LAG', rawVal: 0.2, unit: 's', status: 'STREAMING', sub: 'Hot Standby Replica' }
  ];

  const replicas = [
    { name: 'db-replica-us-east-1a', role: 'READ REPLICA', lag: '0.2s', status: 'STREAMING', location: 'us-east-1' },
    { name: 'db-replica-eu-west-1b', role: 'READ REPLICA', lag: '0.4s', status: 'STREAMING', location: 'eu-west-1' }
  ];

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <SpotlightCard className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">DATABASE SYSTEM HEALTH & REPLICATION MONITOR</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Real-time node telemetry, CPU/Memory utilization, and physical replication stream status.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>SYSTEM HEALTH 100% OPERATIONAL</span>
          </span>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-12 gap-3.5 font-mono text-xs pt-1">
          {metrics.map((m, idx) => (
            <div key={idx} className="col-span-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
              <div className="text-slate-500 text-[10px] flex items-center gap-1.5 font-semibold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>{m.label}</span>
              </div>
              <div className="text-xl font-bold text-slate-900 flex items-baseline gap-0.5">
                <AnimatedCounter from={0} to={m.rawVal} duration={1.2} decimals={m.unit === 's' ? 1 : 0} />
                <span>{m.unit}</span>
              </div>
              <div className="text-[11px] text-slate-500">{m.sub}</div>
            </div>
          ))}
        </div>
      </SpotlightCard>

      {/* Replicas & Cluster Status */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-600" />
            <span>HIGH AVAILABILITY REPLICATION REPLICAS ({replicas.length})</span>
          </h3>
          <span className="text-emerald-700 font-medium bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">UPTIME: 42 DAYS 14 HOURS</span>
        </div>

        <div className="space-y-2.5">
          {replicas.map((rep) => (
            <div key={rep.name} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-100/80 transition-all">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <span>{rep.name}</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                    {rep.role}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">LOCATION: {rep.location}</div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-700 font-semibold">LAG: {rep.lag}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-200 font-semibold">
                  {rep.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
