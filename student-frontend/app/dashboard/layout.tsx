'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Settings,
  Sparkles,
} from 'lucide-react';
import AuthGuard from '@/components/shared/AuthGuard';
import DashboardShell from '@/components/layout/DashboardShell';
import { MenuItem } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('User');
  const [role, setRole] = useState('STUDENT');
  const [currentDate, setCurrentDate] = useState('');
  const [isReady, setIsReady] = useState(false);

  const handleAuthSuccess = (_token: string, name: string, storedRole: string) => {
    setUsername(name);
    setRole(storedRole.toUpperCase());

    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions));
    setIsReady(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    router.push('/');
  };

  const getMenuItems = (userRole: string): MenuItem[] => {
    const roleUpper = userRole.toUpperCase();

    const items: MenuItem[] = [];
    if (roleUpper === 'TEACHER') {
      items.push({ id: 'Attendance', path: '/dashboard/teacher', icon: CheckCircle, label: 'Attendance' });
    } else {
      items.push({ id: 'Dashboard', path: roleUpper === 'ADMIN' ? '/admin/dashboard' : '/dashboard', icon: LayoutDashboard, label: 'Dashboard' });
    }
    items.push({ id: 'Courses', path: roleUpper === 'STUDENT' ? '/dashboard/register-course' : '/dashboard/courses', icon: BookOpen, label: 'Courses' });

    if (roleUpper === 'ADMIN') {
      items.splice(1, 0, { id: 'Students', path: '/dashboard/students', icon: User, label: 'Students' });
    }

    if (roleUpper === 'STUDENT') {
      items.push(
        { id: 'Assignments', path: '/dashboard/assignments', icon: BookOpen, label: 'Assignments' },
        { id: 'Settings', path: '/dashboard/settings', icon: Settings, label: 'Settings' },
      );
    } else if (roleUpper === 'TEACHER') {
      items.push(
        { id: 'Grading', path: '/dashboard/teacher/grading', icon: GraduationCap, label: 'Grading Portal' },
        { id: 'Assignments', path: '/dashboard/teacher/assignments', icon: BookOpen, label: 'Assignments' },
        { id: 'Settings', path: '/dashboard/settings', icon: Settings, label: 'Settings' },
      );
    } else if (roleUpper === 'ADMIN') {
      items.push(
        { id: 'ManageUsers', path: '/admin/dashboard', icon: Sparkles, label: 'Manage Users' },
        { id: 'Settings', path: '/dashboard/settings', icon: Settings, label: 'Settings' },
      );
    }

    return items;
  };

  const userInitials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const menuItems = getMenuItems(role);

  return (
    <AuthGuard onAuthSuccess={handleAuthSuccess}>
      {isReady ? (
        <DashboardShell
          menuItems={menuItems}
          username={username}
          role={role}
          userInitials={userInitials}
          currentDate={currentDate}
          pathname={pathname}
          onLogout={handleLogout}
        >
          {children}
        </DashboardShell>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen bg-sidebar">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary text-sm font-semibold mt-4">Loading workspace...</p>
        </div>
      )}
    </AuthGuard>
  );
}