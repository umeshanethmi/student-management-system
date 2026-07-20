'use client';

import React from 'react';
import { Calendar, Search, MessageSquare, Bell, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  currentDate: string;
  username: string;
  userInitials: string;
}

export default function DashboardHeader({ currentDate, username, userInitials }: DashboardHeaderProps) {
  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-muted-border/60 bg-card/70 backdrop-blur-md relative z-10">
      <div className="flex items-center text-slate-500 text-sm font-medium">
        <Calendar className="w-5 h-5 mr-2.5 text-primary" />
        <span>{currentDate}</span>
      </div>

      <div className="flex items-center space-x-5">
        {/* Search Pill */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search classes, events, payments..."
            className="bg-white border border-muted-border text-slate-700 text-sm rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-72 shadow-sm transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Message Action Icon */}
        <button className="bg-card border border-muted-border p-2.5 rounded-full text-slate-500 hover:text-primary hover:bg-muted shadow-sm transition-all relative">
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Notification Action Icon */}
        <button className="bg-card border border-muted-border p-2.5 rounded-full text-slate-500 hover:text-primary hover:bg-muted shadow-sm transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white" />
        </button>

        {/* Profile Capsule */}
        <div className="bg-card border border-muted-border/80 shadow-sm p-1.5 pr-4 rounded-full flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar border border-slate-850 flex items-center justify-center font-semibold text-white text-xs shadow-inner">
            {userInitials}
          </div>
          <div className="flex flex-col text-left shrink-0">
            <span className="text-sm font-semibold text-slate-800 leading-none">{username}</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">User Portal</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>
      </div>
    </header>
  );
}