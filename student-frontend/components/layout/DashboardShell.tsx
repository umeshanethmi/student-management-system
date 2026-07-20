'use client';

import React from 'react';
import Sidebar, { MenuItem } from '@/components/layout/Sidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';

interface DashboardShellProps {
  children: React.ReactNode;
  menuItems: MenuItem[];
  username: string;
  role: string;
  userInitials: string;
  currentDate: string;
  pathname: string;
  onLogout: () => void;
}

export default function DashboardShell({
  children,
  menuItems,
  username,
  role,
  userInitials,
  currentDate,
  pathname,
  onLogout,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen bg-muted text-slate-850 overflow-hidden font-sans selection:bg-primary/20">
      {/* SIDEBAR */}
      <Sidebar
        menuItems={menuItems}
        username={username}
        role={role}
        userInitials={userInitials}
        pathname={pathname}
        onLogout={onLogout}
      />

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* HEADER */}
        <DashboardHeader
          currentDate={currentDate}
          username={username}
          userInitials={userInitials}
        />

        {/* Dynamic Inner Scrollable Content Canvas */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}