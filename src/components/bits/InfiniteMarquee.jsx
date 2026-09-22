import React from 'react';
import { Database, ShieldCheck, Zap, Activity, CheckCircle2, Server } from 'lucide-react';

export default function InfiniteMarquee() {
  const items = [
    { text: 'PostgreSQL 16.2 connected', icon: Database },
    { text: '98.2% index coverage', icon: Zap },
    { text: '1,240 QPS simulated load', icon: Activity },
    { text: 'Zero-downtime dry-run ready', icon: ShieldCheck },
    { text: '100% test suite passing', icon: CheckCircle2 },
    { text: '0.2s hot standby replication', icon: Server }
  ];

  return (
    <div className="w-full bg-[#F5F6F2] border-y border-[#DDE0DA] overflow-hidden py-1 select-none">
      <div className="flex w-max animate-marquee space-x-8 font-mono text-[11px] text-[#4B5157]">
        {[...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
              <Icon className="w-3.5 h-3.5 text-[#2454FF]" />
              <span className="font-semibold text-[#15181D]">{item.text}</span>
              <span className="text-[#C3C8BF] font-normal">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
