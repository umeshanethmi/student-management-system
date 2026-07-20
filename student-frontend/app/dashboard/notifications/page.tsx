 'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  GraduationCap,
  CheckCircle,
  ClipboardCheck,
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useTheme } from '@/contexts/ThemeContext';

interface NotificationItem {
  id: number;
  studentUsername: string;
  title: string;
  message: string;
  type: 'ATTENDANCE' | 'GRADE' | 'ASSIGNMENT';
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);

    apiFetch<NotificationItem[]>(`/api/notifications/${user}`)
      .then((data) => {
        if (Array.isArray(data)) setNotifications(data);
      })
      .catch((err) => console.error('Error fetching notifications:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'GRADE':
        return <GraduationCap className="w-5 h-5" />;
      case 'ATTENDANCE':
        return <CheckCircle className="w-5 h-5" />;
      case 'ASSIGNMENT':
        return <ClipboardCheck className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getIconColors = (type: string) => {
    switch (type) {
      case 'GRADE':
        return { bg: theme.warningLight, text: theme.warning, border: theme.warning + '30' };
      case 'ATTENDANCE':
        return { bg: theme.successLight, text: theme.success, border: theme.success + '30' };
      case 'ASSIGNMENT':
        return { bg: theme.accentLight, text: theme.accent, border: theme.accent + '30' };
      default:
        return { bg: theme.muted, text: theme.accent, border: theme.mutedBorder };
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHrs = Math.floor(diffMs / 3600000);
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return <LoadingSpinner message="Loading notifications..." />;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: theme.mutedBorder }}>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border"
            style={{
              backgroundColor: theme.accentLight,
              borderColor: theme.accent + '30',
              color: theme.accent,
            }}
          >
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: theme.textPrimary }}>
              Academic Notifications
            </h2>
            <p className="text-sm mt-0.5" style={{ color: theme.textMuted }}>
              Stay updated on grades, attendance, and assignments
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <span
            className="px-3 py-1 rounded-full text-xs font-bold tracking-wider"
            style={{
              backgroundColor: theme.primaryLight,
              color: theme.primary,
              border: `1px solid ${theme.primary}30`,
            }}
          >
            {unreadCount} unread
          </span>
        )}
      </div>

      {notifications.length === 0 ? (
        <div
          className="rounded-[2rem] p-12 text-center font-semibold text-sm shadow-sm border"
          style={{
            backgroundColor: theme.card,
            borderColor: theme.mutedBorder,
            color: theme.textMuted,
          }}
        >
          No notifications yet. We'll let you know when there are updates.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const iconColors = getIconColors(n.type);
            return (
              <div
                key={n.id}
                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                className="flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md"
                style={{
                  backgroundColor: n.isRead ? theme.card : theme.primaryLight,
                  borderColor: n.isRead ? theme.mutedBorder : theme.primary + '40',
                }}
              >
                <div
                  className="p-3 rounded-xl shrink-0 flex items-center justify-center border"
                  style={{
                    backgroundColor: iconColors.bg,
                    color: iconColors.text,
                    borderColor: iconColors.border,
                  }}
                >
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-semibold text-sm"
                      style={{ color: n.isRead ? theme.textMuted : theme.textPrimary }}
                    >
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: theme.primary }}
                      />
                    )}
                  </div>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: theme.textMuted }}>
                    {n.message}
                  </p>
                  <div
                    className="flex items-center gap-1 mt-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: theme.textMuted }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(n.createdAt)} &bull; {n.type}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}