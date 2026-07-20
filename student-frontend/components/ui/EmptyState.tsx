'use client';

import { FileText } from 'lucide-react';
import React from 'react';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-slate-450 font-bold text-xs uppercase tracking-wider">
      {icon && <div className="flex justify-center mb-3">{icon}</div>}
      {message}
    </div>
  );
}