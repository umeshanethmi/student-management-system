'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface NotificationUpdate {
  id?: number;
  message?: string;
  title?: string;
  desc?: string;
  relativeTime?: string;
  time?: string;
  type: string;
}

export default function NotificationsPage() {
  const [updates, setUpdates] = useState<NotificationUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem('username') || 'Student';
    apiFetch<NotificationUpdate[]>(`/api/students/profile/${username}/updates`)
      .then((data) => {
        if (Array.isArray(data)) {
          setUpdates(data);
        }
      })
      .catch((err) => console.error('Error fetching notifications:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-4xl mx-auto p-4">
      
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#5c4fe5] shadow-sm">
          <Bell className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800">Academic Notifications</h2>
          <p className="text-xs text-slate-400 mt-0.5">Stay updated on classes, deadlines, and grade verifications</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-400 font-semibold animate-pulse">Loading updates feed...</div>
      ) : updates.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center text-slate-400 font-bold text-xs uppercase tracking-wider shadow-sm">
          No new notifications or alerts this semester.
        </div>
      ) : (
        <div className="space-y-4">
          {updates.map((update, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200/85 hover:border-slate-350 p-6 rounded-[1.8rem] shadow-sm flex items-start gap-4 transition-all duration-200"
            >
              <div className={`p-3 rounded-xl shrink-0 ${
                update.type === 'Alert' || update.type === 'danger' || update.type === 'warning'
                  ? 'bg-rose-50 text-rose-500 border border-rose-100' 
                  : 'bg-indigo-50 text-indigo-650 border border-indigo-100'
              }`}>
                {update.type === 'Alert' || update.type === 'danger' || update.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-slate-800 leading-snug">{update.title || update.message}</p>
                {update.desc && <p className="text-xs text-slate-500 mt-1 leading-snug">{update.desc}</p>}
                <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider gap-1 mt-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{update.time || update.relativeTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
