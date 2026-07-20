'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Clock, BookOpen } from 'lucide-react';

interface ActivityItemProps {
  title: string;
  desc: string;
  time: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

const iconMap = {
  success: <CheckCircle className="w-5 h-5 text-primary" />,
  warning: <AlertCircle className="w-5 h-5 text-amber-500" />,
  danger: <Clock className="w-5 h-5 text-destructive" />,
  info: <BookOpen className="w-5 h-5 text-primary" />,
};

const bgMap = {
  success: 'bg-primary-light border-primary/20',
  warning: 'bg-amber-50/70 border-amber-100/50',
  danger: 'bg-destructive/10 border-destructive/20',
  info: 'bg-primary/5 border-primary/10',
};

export default function ActivityItem({ title, desc, time, type }: ActivityItemProps) {
  return (
    <div className="flex gap-4 group items-center py-3.5 first:pt-0 last:pb-0">
      <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-slate-800 group-hover:text-primary transition-colors truncate leading-tight">{title}</h4>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed font-medium">{desc}</p>
      </div>
      <span className="text-xs font-medium text-slate-400 shrink-0">{time}</span>
    </div>
  );
}