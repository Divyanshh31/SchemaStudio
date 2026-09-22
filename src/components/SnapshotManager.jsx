import React, { useState } from 'react';
import { Database, HardDrive, RotateCcw, Plus, Check, Download, ShieldCheck, Clock, AlertCircle, Trash2 } from 'lucide-react';
import SpotlightCard from './bits/SpotlightCard';

export default function SnapshotManager() {
  const [snapshots, setSnapshots] = useState([
    { id: 'snap_20260922_01', name: 'pre_migration_v2.0.0', type: 'FULL BACKUP', sizeMb: 1420, createdAt: '2026-09-22 22:30:00 UTC', status: 'READY' },
    { id: 'snap_20260922_02', name: 'daily_auto_backup_001', type: 'INCREMENTAL', sizeMb: 380, createdAt: '2026-09-22 18:00:00 UTC', status: 'READY' },
    { id: 'snap_20260921_01', name: 'production_golden_master', type: 'FULL BACKUP', sizeMb: 1390, createdAt: '2026-09-21 00:00:00 UTC', status: 'READY' }
  ]);

  const [newSnapName, setNewSnapName] = useState('');
  const [newSnapType, setNewSnapType] = useState('FULL BACKUP');
  const [isCreating, setIsCreating] = useState(false);
  const [restoredId, setRestoredId] = useState(null);

  const handleCreateSnapshot = () => {
    if (!newSnapName) return;
    setIsCreating(true);
    setTimeout(() => {
      const now = new Date();
      const newSnap = {
        id: `snap_${now.getTime()}`,
        name: newSnapName,
        type: newSnapType,
        sizeMb: newSnapType === 'FULL BACKUP' ? 1435 : 210,
        createdAt: `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)} UTC`,
        status: 'READY'
      };
      setSnapshots([newSnap, ...snapshots]);
      setNewSnapName('');
      setIsCreating(false);
    }, 1000);
  };

  const handleRestore = (id) => {
    setRestoredId(id);
    setTimeout(() => setRestoredId(null), 3000);
  };

  const handleDelete = (id) => {
    setSnapshots(snapshots.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <SpotlightCard className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-semibold text-slate-800 tracking-wide uppercase">DATABASE SNAPSHOT & RECOVERY MANAGER</h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">
                Manage Point-in-Time Recovery (PITR) backups, schema snapshots, and automated disaster recovery.
              </p>
            </div>
          </div>

          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200 flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>PITR ACTIVE (7-DAY RETENTION)</span>
          </span>
        </div>

        {/* Create Snapshot Controls */}
        <div className="flex items-center gap-2.5 pt-1 font-mono text-xs">
          <input
            type="text"
            placeholder="Snapshot tag name (e.g. pre_release_v2.1)"
            value={newSnapName}
            onChange={(e) => setNewSnapName(e.target.value)}
            className="flex-1 px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
          />
          <select
            value={newSnapType}
            onChange={(e) => setNewSnapType(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-indigo-700 font-semibold focus:outline-none font-mono"
          >
            <option value="FULL BACKUP">FULL BACKUP</option>
            <option value="INCREMENTAL">INCREMENTAL</option>
            <option value="SCHEMA ONLY">SCHEMA ONLY</option>
          </select>
          <button
            onClick={handleCreateSnapshot}
            disabled={isCreating || !newSnapName}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-mono font-semibold text-xs flex items-center gap-1.5 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreating ? 'CREATING...' : 'CREATE SNAPSHOT'}</span>
          </button>
        </div>
      </SpotlightCard>

      {/* Snapshots List */}
      <div className="surface-card p-5 rounded-xl border border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <span>AVAILABLE SNAPSHOTS ({snapshots.length})</span>
          </h3>
          <span className="text-slate-500 font-semibold">TOTAL BACKUP FOOTPRINT: 3.19 GB</span>
        </div>

        {restoredId && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs flex items-center gap-2 font-semibold">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>POINT-IN-TIME RECOVERY EXECUTED SUCCESSFULLY. DATABASE RESTORED TO SNAPSHOT `{restoredId}`.</span>
          </div>
        )}

        <div className="space-y-2.5 font-mono text-xs">
          {snapshots.map((snap) => (
            <div
              key={snap.id}
              className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-100/80 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-900 text-xs">{snap.name}</span>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded border font-semibold ${
                      snap.type === 'FULL BACKUP'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {snap.type}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-3 font-mono">
                  <span>ID: {snap.id}</span>
                  <span>SIZE: {snap.sizeMb} MB</span>
                  <span>CREATED: {snap.createdAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(snap.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 font-semibold transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESTORE</span>
                </button>
                <button
                  onClick={() => handleDelete(snap.id)}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
