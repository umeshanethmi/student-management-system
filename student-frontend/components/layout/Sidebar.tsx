'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronRight, LogOut, LayoutDashboard, BookOpen, User, Bell, Settings, CheckCircle, GraduationCap } from 'lucide-react';

export interface MenuItem {
  id: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  username: string;
  role: string;
  userInitials: string;
  pathname: string;
  onLogout: () => void;
}

function getPortalLabel(role: string) {
  switch (role.toUpperCase()) {
    case 'ADMIN': return 'Admin Portal';
    case 'TEACHER': return 'Teacher Portal';
    default: return 'Student Portal';
  }
}

export default function Sidebar({ menuItems, username, role, userInitials, pathname, onLogout }: SidebarProps) {
  return (
    <aside className="w-72 bg-sidebar flex flex-col justify-between transition-all duration-300 relative z-20 border-r border-sidebar-border shrink-0">
      {/* Top Branding Section */}
      <div>
        <div className="p-6 flex items-center space-x-3 border-b border-sidebar-border/40">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">AuraEdu</span>
        </div>

        {/* Menu Items with Link routing */}
        <div className="py-6 px-4 space-y-2 overflow-y-auto dark-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (
              item.path !== '/dashboard' &&
              item.path !== '/dashboard/teacher' &&
              item.path !== '/admin/dashboard' &&
              pathname.startsWith(item.path)
            );
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary-hover text-white font-semibold shadow-lg shadow-primary/20'
                    : 'text-slate-300 hover:bg-sidebar-hover/70 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                  <span className="text-base font-medium">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-0 transition-all ${isActive ? 'opacity-100 translate-x-0.5' : 'group-hover:opacity-60'}`} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sidebar Bottom Profile/Logout Block */}
      <div className="p-4 border-t border-sidebar-border/40">
        <div className="bg-sidebar-hover border border-sidebar-border/60 p-4 rounded-2xl flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center font-semibold text-white text-base shrink-0 border border-sidebar-border">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate leading-tight">{username}</span>
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-0.5">{getPortalLabel(role)}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2.5 bg-sidebar-border/50 hover:bg-destructive/20 hover:text-destructive text-slate-400 rounded-xl transition-colors shrink-0 group"
            title="Logout"
          >
            <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}