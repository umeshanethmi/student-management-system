'use client';

import React from 'react';

interface PageHeaderProps {
  icon?: React.ReactNode;
  tag?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function PageHeader({ icon, tag, title, description, children }: PageHeaderProps) {
  return (
    <div className="p-8 rounded-[2rem] bg-gradient-to-r from-sidebar via-[#051d18] to-[#072d25] border border-sidebar-border/40 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />

      <div className="flex items-start gap-5 relative z-10">
        {icon && (
          <div className="w-14 h-14 bg-sidebar-border/50 border border-sidebar-border rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/15">
            {icon}
          </div>
        )}
        <div>
          {tag && (
            <span className="inline-block px-3 py-1 rounded-full bg-sidebar-hover/40 border border-sidebar-border/50 text-xs font-semibold text-primary tracking-wider mb-2.5 uppercase">
              {tag}
            </span>
          )}
          <h1 className="text-3xl font-bold text-primary leading-tight">
            {title}
          </h1>
          {description && (
            <p className="text-slate-300 text-base font-medium mt-1 max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>

      {children && (
        <div className="relative z-10 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}