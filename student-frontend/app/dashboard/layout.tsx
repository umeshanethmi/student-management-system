'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  User, 
  BookOpen, 
  CheckCircle, 
  GraduationCap, 
  CreditCard, 
  LogOut,
  Bell,
  Search,
  Calendar,
  ChevronRight,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Plus,
  Settings
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('User');
  const [role, setRole] = useState('STUDENT');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Client-side initialization
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username') || 'User';
    const storedRole = localStorage.getItem('role') || 'STUDENT';
    
    // Require valid authentication token
    if (!token) {
      router.push('/login');
      return;
    }

    setUsername(name);
    setRole(storedRole.toUpperCase());
    setIsAuthorized(true);
    
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    router.push('/'); // Redirect to landing page (/) as per Tech Lead requirements
  };

  const getMenuItems = (userRole: string) => {
    const roleUpper = userRole.toUpperCase();
    
    // Core navigation items required for all roles
    const items = [];
    if (roleUpper === 'TEACHER') {
      items.push(
        { id: 'Attendance', path: '/dashboard/teacher', icon: CheckCircle, label: 'Attendance' }
      );
    } else {
      items.push(
        { id: 'Dashboard', path: roleUpper === 'ADMIN' ? '/admin/dashboard' : '/dashboard', icon: LayoutDashboard, label: 'Dashboard' }
      );
    }
    items.push(
      { id: 'Courses', path: '/dashboard/courses', icon: BookOpen, label: 'Courses' }
    );

    // Conditionally show Students link for ADMIN and TEACHER only
    if (roleUpper === 'ADMIN' || roleUpper === 'TEACHER') {
      items.splice(1, 0, { id: 'Students', path: '/dashboard/students', icon: User, label: 'Students' });
    }

    // Role-based conditional menus
    if (roleUpper === 'STUDENT') {
      items.push(
        { id: 'Assignments', path: '/dashboard/assignments', icon: BookOpen, label: 'Assignments' },
        { id: 'Notifications', path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
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

  const menuItems = getMenuItems(role);

  const userInitials = username
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const getPortalLabel = (userRole: string) => {
    switch (userRole.toUpperCase()) {
      case 'ADMIN': return 'Admin Portal';
      case 'TEACHER': return 'Teacher Portal';
      default: return 'Student Portal';
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0e1e]">
        <div className="w-10 h-10 border-4 border-[#5c4fe5] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-semibold mt-4">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-850 overflow-hidden font-sans selection:bg-indigo-500/20">
      
      {/* SHARED SIDEBAR */}
      <aside className="w-72 bg-[#0b0e1e] flex flex-col justify-between transition-all duration-300 relative z-20 border-r border-[#151a3a] shrink-0">
        
        {/* Top Branding Section */}
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-[#151a3a]/40">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white w-5 h-5 animate-pulse" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">AuraEdu</span>
          </div>

          {/* Menu Items with Link routing */}
          <div className="py-6 px-4 space-y-1.5 overflow-y-auto dark-scrollbar" style={{ maxHeight: 'calc(100vh - 180px)' }}>
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
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#5c4fe5] to-[#4c3ce0] text-white font-semibold shadow-lg shadow-indigo-500/30' 
                      : 'text-slate-400 hover:bg-[#151b3c]/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 opacity-0 transition-all ${isActive ? 'opacity-100 translate-x-0.5' : 'group-hover:opacity-60'}`} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Bottom Profile/Logout Block */}
        <div className="p-4 border-t border-[#151a3a]/40">
          <div className="bg-[#121634] border border-[#212854]/40 p-4 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-sm shrink-0 border border-[#2b356d]">
                {userInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate leading-tight">{username}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{getPortalLabel(role)}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 bg-[#1b2149] hover:bg-[#eb4b4b]/20 hover:text-[#ff6b6b] text-slate-400 rounded-xl transition-colors shrink-0 group"
              title="Logout"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* SHARED HEADER */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-md relative z-10">
          <div className="flex items-center text-slate-500 text-sm font-medium">
             <Calendar className="w-4.5 h-4.5 mr-2.5 text-[#5c4fe5]" />
             <span>{currentDate}</span>
          </div>
          
          <div className="flex items-center space-x-5">
            {/* Search Pill */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search classes, events, payments..." 
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-full pl-11 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 w-72 shadow-sm transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {/* Message Action Icon */}
            <button className="bg-white border border-slate-200 p-2.5 rounded-full text-slate-550 hover:text-indigo-650 hover:bg-slate-50 shadow-sm transition-all relative">
              <MessageSquare className="w-4.5 h-4.5" />
            </button>

            {/* Notification Action Icon */}
            <button className="bg-white border border-slate-200 p-2.5 rounded-full text-slate-550 hover:text-indigo-650 hover:bg-slate-50 shadow-sm transition-all relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </button>

            {/* Profile Capsule */}
            <div className="bg-white border border-slate-200/80 shadow-sm p-1.5 pr-4 rounded-full flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0b0e1e] border border-slate-850 flex items-center justify-center font-black text-white text-xs shadow-inner">
                {userInitials}
              </div>
              <div className="flex flex-col text-left shrink-0">
                <span className="text-xs font-bold text-slate-800 leading-none">{username}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">User Portal</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </div>
          </div>
        </header>

        {/* Dynamic Inner Scrollable Content Canvas */}
        <div className="flex-1 overflow-y-auto p-8 relative z-10 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}