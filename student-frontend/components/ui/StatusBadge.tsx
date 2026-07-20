'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = String(status).toLowerCase().trim();

  if (s === 'present' || s === 'active' || s === 'paid' || s === 'completed' || s === 'graded') {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-light border border-primary/20 text-sm font-semibold text-primary tracking-wider">
        <CheckCircle className="w-4 h-4" />
        {status}
      </span>
    );
  }

  if (s === 'absent' || s === 'inactive' || s === 'pending' || s === 'rejected') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-destructive/10 text-destructive border border-destructive/20">
        {status}
      </span>
    );
  }

  if (s === 'enrolled') {
    return (
      <span className="text-sm font-semibold bg-primary-light text-primary-hover px-4 py-1.5 rounded-xl border border-primary/20 uppercase tracking-wider flex items-center gap-1.5">
        <CheckCircle className="w-4 h-4 text-primary" /> Enrolled
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-muted text-slate-500 border border-muted-border">
      {status}
    </span>
  );
}