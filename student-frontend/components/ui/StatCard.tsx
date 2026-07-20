'use client';

import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: string;
}

export default function StatCard({ icon, label, value, trend, trendUp, color }: StatCardProps) {
  const stripeColors: Record<string, string> = {
    emerald: 'from-primary to-primary-hover',
    blue: 'from-primary to-primary-hover',
    rose: 'from-destructive to-destructive-hover',
    amber: 'from-amber-500 to-amber-600',
  };

  const glowColors: Record<string, string> = {
    emerald: 'shadow-primary/5 group-hover:shadow-primary/15',
    blue: 'shadow-primary/5 group-hover:shadow-primary/15',
    rose: 'shadow-destructive/5 group-hover:shadow-destructive/15',
    amber: 'shadow-amber-500/5 group-hover:shadow-amber-500/15',
  };

  const iconBgs: Record<string, string> = {
    emerald: 'bg-primary-light text-primary border-primary/20',
    blue: 'bg-primary-light text-primary border-primary/20',
    rose: 'bg-destructive/10 text-destructive border-destructive/20',
    amber: 'bg-amber-50 text-amber-600 border-amber-100/50',
  };

  return (
    <div className={`group bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-[2rem] p-6 relative overflow-hidden flex flex-col shadow-xl ${glowColors[color]} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer pb-8`}>
      <div className="flex justify-between items-center mb-5">
        <div className={`w-11 h-11 rounded-2xl ${iconBgs[color] || 'bg-slate-50'} flex items-center justify-center border shadow-inner transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
        trendUp
          ? 'bg-primary-light text-primary border border-primary/20'
          : color === 'rose'
            ? 'bg-destructive/10 text-destructive border border-destructive/20'
            : 'bg-muted text-slate-500 border border-muted-border'
      } uppercase tracking-wider`}>
          {trend}
        </div>
      </div>

      <div className="flex space-x-1.5 mb-4 opacity-25">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
      </div>

      <div className="mt-auto">
        <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider leading-none mb-1.5">{label}</p>
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h3>
      </div>

      <div className={`h-1.5 absolute bottom-0 left-0 right-0 w-full bg-gradient-to-r ${stripeColors[color] || 'from-slate-200 to-slate-350'} rounded-b-[2rem]`} />
    </div>
  );
}