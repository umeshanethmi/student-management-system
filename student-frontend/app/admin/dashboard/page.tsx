'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  DollarSign,
  LogOut,
  Bell,
  Search,
  Plus,
  Edit2,
  Trash2,
  Menu,
  X,
  UserCheck,
  Briefcase,
  TrendingUp,
  FileText,
  AlertCircle,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Mail,
  Key,
  Loader2
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  username: string;
  phone: string;
  address: string;
  role?: string;
}

interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  credits: number;
  fee: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  const [activeTab, setActiveTab] = useState('Overview');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentModalMode, setStudentModalMode] = useState<'add' | 'edit'>('add');
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});
  const [studentModalError, setStudentModalError] = useState('');

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<'add' | 'edit'>('add');
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});
  const [courseModalError, setCourseModalError] = useState('');

  // Delete Confirmation Modal States
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);
  const [deleteStudentError, setDeleteStudentError] = useState('');

  const [teacherToDelete, setTeacherToDelete] = useState<any | null>(null);
  const [isDeleteTeacherOpen, setIsDeleteTeacherOpen] = useState(false);
  const [isDeletingTeacher, setIsDeletingTeacher] = useState(false);
  const [deleteTeacherError, setDeleteTeacherError] = useState('');

  // Add Teacher modal state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  // Edit Teacher modal state
  const [isEditTeacherModalOpen, setIsEditTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any | null>(null);
  const [editTeacherUsername, setEditTeacherUsername] = useState('');
  const [editTeacherEmail, setEditTeacherEmail] = useState('');
  const [editTeacherPassword, setEditTeacherPassword] = useState('');
  const [editTeacherLoading, setEditTeacherLoading] = useState(false);
  const [editTeacherSuccess, setEditTeacherSuccess] = useState('');
  const [editTeacherError, setEditTeacherError] = useState('');

  // ── Strict pagination for Admin tables ────────────────────────
  const [studPage, setStudPage] = useState(1);
  const [teachPage, setTeachPage] = useState(1);
  const [payPage, setPayPage] = useState(1);
  const adminRowsPerPage = 5;

  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false);
  const [isDeletingCourse, setIsDeletingCourse] = useState(false);
  const [deleteCourseError, setDeleteCourseError] = useState('');

  // Add Teacher form states
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [teacherSuccess, setTeacherSuccess] = useState('');
  const [teacherError, setTeacherError] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);

  // Database States
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedSlipImage, setSelectedSlipImage] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<'All' | 'Pending Verification' | 'Paid' | 'Rejected'>('All');

  const fetchStudents = async () => {
    try {
      const data = await apiFetch<any[]>('/api/students');
      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const [courses, setCourses] = useState<Course[]>([]);

  const fetchCourses = async () => {
    try {
      const data = await apiFetch<any[]>('/api/courses');
      setCourses(data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const data = await apiFetch<any[]>('/api/payments');
      setPayments(data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  const handleApprovePayment = async (paymentId: number) => {
    try {
      await apiFetch(`/api/payments/${paymentId}/status?status=Paid`, {
        method: 'PUT'
      });
      fetchPayments();
      fetchStudents(); // Refresh enrollments and student registry counts
    } catch (err) {
      console.error('Error approving payment:', err);
    }
  };

  const handleRejectPayment = async (paymentId: number) => {
    try {
      await apiFetch(`/api/payments/${paymentId}/status?status=Rejected`, {
        method: 'PUT'
      });
      fetchPayments();
    } catch (err) {
      console.error('Error rejecting payment:', err);
    }
  };

  // Auth Protection Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const storedUsername = localStorage.getItem('username');

    if (!token || !role || role.toUpperCase() !== 'ADMIN') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      if (storedUsername) {
        setAdminName(storedUsername);
      }
      fetchTeachers();
      fetchCourses();
      fetchStudents();
      fetchPayments();
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    router.push('/');
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherSuccess('');
    setTeacherError('');
    setTeacherLoading(true);

    try {
      await apiFetch('/api/admin/users', {
        method: 'POST',
        body: {
          username: teacherUsername.trim(),
          email: teacherEmail.trim(),
          password: teacherPassword,
          role: 'TEACHER',
        },
      });

      setTeacherUsername('');
      setTeacherEmail('');
      setTeacherPassword('');
      setTeacherSuccess('Teacher account created successfully! 🎉');
      fetchTeachers();
      setTimeout(() => setTeacherSuccess(''), 5050);
    } catch (err: any) {
      console.error('Error creating teacher:', err);
      setTeacherError(err.message || 'Failed to create teacher account.');
    } finally {
      setTeacherLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const data = await apiFetch<any[]>('/api/admin/users/role/TEACHER');
      setTeachers(data || []);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    }
  };

  const confirmDeleteTeacher = async () => {
    if (!teacherToDelete) return;
    setIsDeletingTeacher(true);
    setDeleteTeacherError('');
    try {
      await apiFetch(`/api/admin/users/${teacherToDelete.id}`, { method: 'DELETE' });
      setTeachers(teachers.filter((t) => t.id !== teacherToDelete.id));
      setIsDeleteTeacherOpen(false);
      setTeacherToDelete(null);
    } catch (err: any) {
      console.error('Error deleting teacher:', err);
      setDeleteTeacherError(err.message || 'Failed to delete teacher.');
    } finally {
      setIsDeletingTeacher(false);
    }
  };

  const handleEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;
    setEditTeacherSuccess('');
    setEditTeacherError('');
    setEditTeacherLoading(true);

    try {
      const body: any = {
        username: editTeacherUsername.trim(),
        email: editTeacherEmail.trim(),
        role: 'TEACHER',
      };
      if (editTeacherPassword.trim()) {
        body.password = editTeacherPassword.trim();
      }
      await apiFetch(`/api/admin/users/${editingTeacher.id}`, {
        method: 'PUT',
        body,
      });
      setEditTeacherSuccess('Teacher account updated successfully! 🎉');
      fetchTeachers();
      setTimeout(() => {
        setIsEditTeacherModalOpen(false);
        setEditingTeacher(null);
        setEditTeacherSuccess('');
      }, 1500);
    } catch (err: any) {
      console.error('Error updating teacher:', err);
      setEditTeacherError(err.message || 'Failed to update teacher account.');
    } finally {
      setEditTeacherLoading(false);
    }
  };

  // Student CRUD Handlers
  const openEditStudentModal = (student: Student) => {
    setStudentModalError('');
    setStudentModalMode('edit');
    setCurrentStudent(student);
    setIsStudentModalOpen(true);
  };

  const saveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent.id || !currentStudent.name || !currentStudent.email) return;
    setStudentModalError('');

    try {
      await apiFetch(`/api/students/${currentStudent.id}`, {
        method: 'PUT',
        body: {
          name: currentStudent.name,
          email: currentStudent.email,
          age: Number(currentStudent.age) || 20,
          phone: currentStudent.phone || '',
          address: currentStudent.address || '',
          username: currentStudent.username || ''
        }
      });
      setIsStudentModalOpen(false);
      fetchStudents();
    } catch (err: any) {
      console.error('Error saving student:', err);
      setStudentModalError(err.message || 'Failed to update student.');
    }
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsDeletingStudent(true);
    setDeleteStudentError('');
    try {
      await apiFetch(`/api/students/${studentToDelete.id}`, { method: 'DELETE' });
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    } catch (err: any) {
      console.error('Error deleting student:', err);
      setDeleteStudentError(err.message || 'Failed to delete student.');
    } finally {
      setIsDeletingStudent(false);
    }
  };

  // Course CRUD Handlers
  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse.courseCode || !currentCourse.courseName || !currentCourse.instructor) return;
    setCourseModalError('');

    try {
      const url = courseModalMode === 'edit' ? `/api/courses/${currentCourse.id}` : '/api/courses';
      const method = courseModalMode === 'edit' ? 'PUT' : 'POST';
      await apiFetch(url, {
        method,
        body: {
          courseCode: currentCourse.courseCode.toUpperCase(),
          courseName: currentCourse.courseName,
          instructor: currentCourse.instructor,
          credits: Number(currentCourse.credits) || 3,
          fee: currentCourse.fee || 'LKR 45,000'
        }
      });
      setIsCourseModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      console.error('Error saving course:', err);
      setCourseModalError(err.message || 'Failed to save course.');
    }
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    setIsDeletingCourse(true);
    setDeleteCourseError('');
    try {
      await apiFetch(`/api/courses/${courseToDelete.id}`, { method: 'DELETE' });
      setIsDeleteCourseOpen(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (err: any) {
      console.error('Error deleting course:', err);
      setDeleteCourseError(err.message || 'Failed to delete course.');
    } finally {
      setIsDeletingCourse(false);
    }
  };

  // Helper to get first initial for avatar
  const getFirstInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'S';
  };

  // Admin Initials Helper
  const adminInitials = adminName ? adminName.substring(0, 2).toUpperCase() : 'AD';

  if (!isAuthorized) {
    return null;
  }

  // Filter students based on search and roles (excludes admins and teachers)
  const studentRosterData = students.filter((student) => {
    const role = (student.role || 'STUDENT').toLowerCase();
    const username = (student.username || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const name = (student.name || '').toLowerCase();

    // First, filter out administrators and teachers
    const isAdmin = role.includes('admin') || username.includes('admin') || email.includes('admin') || name.includes('admin');
    const isTeacher = role.includes('teacher') || username.includes('teacher') || email.includes('teacher') || name.includes('teacher') || username.startsWith('aura26l');

    if (isAdmin || isTeacher) return false;

    // Second, search query filter
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return name.includes(term) || email.includes(term);
  });

  // Filter courses based on search query
  const filteredCourses = courses.filter((course) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      (course.courseName || '').toLowerCase().includes(term) ||
      (course.courseCode || '').toLowerCase().includes(term) ||
      (course.instructor || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex h-screen bg-[#f8fafc] bg-radial-gradient-glow text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex md:flex-col w-64 bg-[#04241d]/95 backdrop-blur-xl border-r border-[#0e483b]/30 shrink-0 relative overflow-hidden">
        {/* Background Glow inside Sidebar */}
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] rounded-full bg-emerald-650/10 blur-[80px] pointer-events-none" />
        
        {/* Logo container */}
        <div className="h-20 px-6 flex items-center gap-3 relative z-10 border-b border-[#0b3b30]/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <span className="text-lg font-black tracking-tight text-white">AuraEdu</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 relative z-10 overflow-y-auto custom-scrollbar">
          <button 
            onClick={() => { setActiveTab('Overview'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
              activeTab === 'Overview' 
                ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-[#0c3e32]/40'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button 
            onClick={() => { setActiveTab('Students'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
              activeTab === 'Students' 
                ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-[#0c3e32]/40'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Students</span>
          </button>

          <button 
            onClick={() => { setActiveTab('Courses'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
              activeTab === 'Courses' 
                ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-[#0c3e32]/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage Courses</span>
          </button>

          <button 
            onClick={() => { setActiveTab('Teachers'); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
              activeTab === 'Teachers' 
                ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg shadow-emerald-500/20' 
                : 'text-slate-400 hover:text-white hover:bg-[#0c3e32]/40'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Add Teacher</span>
          </button>


        </nav>

        {/* User profile section at the bottom */}
        <div className="p-4 border-t border-[#0b3b30]/40 relative z-10">
          <div className="bg-[#072d25] p-4 rounded-2xl flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-sm">
                {adminInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white truncate leading-tight">{adminName}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admin</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-[#ff6b6b] transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE SIDEBAR MODAL BACKDROP */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)} />
          
          <aside className="relative flex flex-col w-64 bg-[#04241d]/95 backdrop-blur-xl border-r border-[#0e483b]/30 h-full z-10 animate-in slide-in-from-left duration-300">
            <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] rounded-full bg-emerald-650/10 blur-[80px] pointer-events-none" />
            
            <div className="h-20 px-6 flex items-center justify-between border-b border-[#0b3b30]/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-black tracking-tight text-white">AuraEdu</span>
              </div>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <button 
                onClick={() => { setActiveTab('Overview'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
                  activeTab === 'Overview' 
                    ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-[#0c3e32]/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview</span>
              </button>

              <button 
                onClick={() => { setActiveTab('Students'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
                  activeTab === 'Students' 
                    ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-[#0c3e32]/40'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Manage Students</span>
              </button>

              <button 
                onClick={() => { setActiveTab('Courses'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
                  activeTab === 'Courses' 
                    ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-[#0c3e32]/40'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Manage Courses</span>
              </button>

              <button 
                onClick={() => { setActiveTab('Teachers'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all ${
                  activeTab === 'Teachers' 
                    ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-lg' 
                    : 'text-slate-400 hover:text-white hover:bg-[#0c3e32]/40'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Add Teacher</span>
              </button>
            </nav>

            <div className="p-4 border-t border-[#0b3b30]/40">
              <div className="bg-[#072d25] p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-sm">
                    {adminInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white truncate leading-tight">{adminName}</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Admin</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-[#ff6b6b]"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 px-6 md:px-8 flex items-center justify-between border-b border-slate-200/60 bg-white/70 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-505 md:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-black text-slate-800 uppercase tracking-widest">{activeTab}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:relative md:block">
              <input 
                type="text" 
                placeholder="Search portal records..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-slate-200 text-slate-750 text-sm rounded-full pl-11 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 w-64 shadow-sm transition-all"
              />
              <Search className="w-4 h-4 text-slate-455 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <button className="bg-white border border-slate-200 p-2.5 rounded-full text-slate-550 hover:text-indigo-650 hover:bg-slate-55 hover:bg-slate-50 shadow-sm transition-all relative">
              <MessageSquare className="w-4.5 h-4.5" />
            </button>
            
            <button className="bg-white border border-slate-200 p-2.5 rounded-full text-slate-550 hover:text-indigo-655 hover:bg-slate-50 shadow-sm transition-all relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="bg-white border border-slate-200/80 shadow-sm p-1.5 pr-4 rounded-full flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#04241d] border border-slate-850 flex items-center justify-center font-bold text-white text-xs">
                {adminInitials}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-slate-800">{adminName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 hidden sm:inline" />
            </div>
          </div>
        </header>

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 relative z-10 custom-scrollbar">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Banner exactly styled like user's reference image */}
              <div className="p-8 rounded-[2rem] bg-gradient-to-r from-[#04241d] via-[#051d18] to-[#072d25] border border-[#0b3b30]/40 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none animate-pulse" />
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-14 h-14 bg-[#063026] border border-[#0d4d3e] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/15 animate-pulse">
                    <UserCheck className="text-[#10b981] w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#0c3e32]/40 border border-[#0d4d3e]/50 text-[10px] font-bold text-[#10b981] tracking-wider mb-2.5 uppercase">
                      SYSTEM OPERATIONS
                    </span>
                    <h2 className="text-3xl font-black text-[#10b981] leading-tight">
                      Support Hub
                    </h2>
                    <p className="text-white text-sm mt-1 max-w-2xl">
                      Welcome Back Admin, {adminName}! Management console for AuraEdu facilities and resource maintenance logs.
                    </p>
                  </div>
                </div>

              </div>

              {/* Stats Grid with Accent Stripes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard icon={<Users className="text-indigo-600 w-5 h-5" />} label="TOTAL STUDENTS" value={students.length.toString()} sub="Active Enrollment" color="indigo" />
                <AdminStatCard icon={<BookOpen className="text-purple-650 w-5 h-5" />} label="TOTAL COURSES" value={courses.length.toString()} sub="Active Catalog" color="purple" />
                <AdminStatCard icon={<Briefcase className="text-emerald-600 w-5 h-5" />} label="TOTAL FACULTY" value={teachers.length.toString()} sub="Full-time / Part-time" color="emerald" />
                <AdminStatCard 
                  icon={<DollarSign className="text-blue-600 w-5 h-5" />} 
                  label="MONTHLY REVENUE" 
                  value={(() => {
                    let total = 0;
                    payments.forEach(p => {
                      if (p.status?.toLowerCase() === 'paid') {
                        const amtStr = p.amount || '';
                        const numericVal = parseFloat(amtStr.replace(/[^0-9.]/g, '')) || 0;
                        total += numericVal;
                      }
                    });
                    return `LKR ${total.toLocaleString()}`;
                  })()} 
                  sub="Accrued Tuition Fee" 
                  color="blue" 
                />
              </div>

              {/* Performance Analytics & Activity Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* SVG Analytics Graph */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">DATA ANALYSIS</span>
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-indigo-500" /> Revenue & Registration Insights
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase">LKR</span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase">REAL-TIME</span>
                      </div>
                    </div>

                    {/* SVG Line Chart representing data trends */}
                    <div className="h-44 w-full relative">
                      <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2"/>
                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path 
                          d="M0,130 Q100,70 200,90 T400,40 T500,20 L500,150 L0,150 Z" 
                          fill="url(#chartGrad)"
                        />
                        <path 
                          d="M0,130 Q100,70 200,90 T400,40 T500,20" 
                          fill="none" 
                          stroke="#4f46e5" 
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                        
                        {/* Dynamic Dots */}
                        <circle cx="200" cy="90" r="4.5" fill="#4f46e5" stroke="white" strokeWidth="2" />
                        <circle cx="400" cy="40" r="4.5" fill="#4f46e5" stroke="white" strokeWidth="2" />
                        <circle cx="500" cy="20" r="4.5" fill="#4f46e5" stroke="white" strokeWidth="2" />
                      </svg>
                      {/* X Axis labels */}
                      <div className="absolute left-0 bottom-0 right-0 flex justify-between px-1 text-[9px] font-bold text-slate-400 tracking-wider">
                        <span>MAY</span>
                        <span>JUN</span>
                        <span>JUL (CURRENT)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500">
                    <span>Enrollment growth: <strong className="text-slate-800 font-extrabold">+24.5%</strong></span>
                    <span>System state: <strong className="text-emerald-600 font-extrabold">Active</strong></span>
                  </div>
                </div>

                {/* Platform Security Tips */}
                <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-purple-500" /> Platform Security
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                      Administrative roles have root permissions on courses and students. Always safeguard credentials and log out after sessions.
                    </p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                    <div className="text-xs text-amber-800 font-medium">
                      <span className="font-extrabold">Tip:</span> Ensure database connections are active via port 8081 before editing registers.
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Activities / Logs table */}
              <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" /> Administrative Logs & Activities
                </h3>
                <div className="space-y-4 divide-y divide-slate-100">
                  {/* Generate dynamic lists */}
                  {(() => {
                    const list: React.ReactNode[] = [];
                    students.slice(-2).reverse().forEach(s => {
                      list.push(
                        <LogItem 
                          key={`log-student-${s.id}`}
                          title="New Student Registered" 
                          desc={`${s.name} (${s.email}) was added to the student registry.`} 
                          time="Active" 
                        />
                      );
                    });

                    courses.slice(-2).reverse().forEach(c => {
                      list.push(
                        <LogItem 
                          key={`log-course-${c.id}`}
                          title="New Course Published" 
                          desc={`${c.courseCode} - ${c.courseName} added to the syllabus catalog.`} 
                          time="Active" 
                        />
                      );
                    });

                    payments.slice(-2).reverse().forEach(p => {
                      list.push(
                        <LogItem 
                          key={`log-payment-${p.id}`}
                          title={p.status === 'Paid' ? "Payment Slip Verified" : "Payment Slip Uploaded"} 
                          desc={`Student ${p.username} submitted ${p.amount} via ${p.method}.`} 
                          time={p.status} 
                        />
                      );
                    });

                    if (list.length === 0) {
                      return (
                        <div className="text-center py-8 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          No recent logs recorded.
                        </div>
                      );
                    }
                    return list.slice(0, 4);
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE STUDENTS */}
          {activeTab === 'Students' && (
            <div className="w-full px-8 py-8 space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Student Profiles</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage student authentication and profile listings</p>
                </div>
              </div>

              {/* Modern Light-mode Table Card */}
              <div className="bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-[2.5rem] overflow-hidden shadow-xl w-full p-2">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200/40 bg-slate-50/50 text-slate-450 text-[10px] font-extrabold uppercase tracking-widest">
                        <th className="py-5 px-6">Student Name</th>
                        <th className="py-5 px-6">Email Address</th>
                        <th className="py-5 px-6">Account Status</th>
                        <th className="py-5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700">
                      {studentRosterData.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-16 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-150">
                                <Search className="w-5 h-5 text-slate-400" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-750">No students found</p>
                                <p className="text-xs text-slate-400 font-medium">
                                  No students found matching &ldquo;<span className="font-semibold text-slate-600">{searchQuery}</span>&rdquo;
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        studentRosterData.slice((studPage - 1) * adminRowsPerPage, studPage * adminRowsPerPage).map((student) => (
                          <tr 
                            key={student.id} 
                            className="hover:bg-slate-50/50 border-b border-slate-100 last:border-none transition-all duration-250 group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                {/* Circular initial Avatar */}
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-100/50 text-[#5c4fe5] flex items-center justify-center font-extrabold text-sm mr-4.5 shrink-0 shadow-inner">
                                  {getFirstInitial(student.name)}
                                </div>
                                <span className="font-extrabold text-slate-800 group-hover:text-indigo-650 transition-colors">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-semibold">{student.email}</td>
                            <td className="px-6 py-4">
                              {/* Modern Status Badge */}
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => openEditStudentModal(student)}
                                  className="p-2.5 rounded-xl text-indigo-600 bg-indigo-50/70 border border-indigo-100/50 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 cursor-pointer inline-flex items-center justify-center shadow-sm hover:shadow"
                                  title="Edit Student"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setStudentToDelete(student);
                                    setDeleteStudentError('');
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="p-2.5 rounded-xl text-rose-600 bg-rose-50/70 border border-rose-100/50 hover:bg-rose-100 hover:text-rose-700 transition-all duration-200 cursor-pointer inline-flex items-center justify-center shadow-sm hover:shadow"
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-4.5 h-4.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {studentRosterData.length > adminRowsPerPage && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600 w-full px-4">
                    <div>Page <span className="font-semibold">{studPage}</span> of <span className="font-semibold">{Math.ceil(studentRosterData.length / adminRowsPerPage)}</span></div>
                    <div className="flex gap-2">
                      <button onClick={() => setStudPage(prev => Math.max(prev - 1, 1))} disabled={studPage === 1} className="px-3 py-1.5 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 bg-white transition">Previous</button>
                      <button onClick={() => setStudPage(prev => Math.min(prev + 1, Math.ceil(studentRosterData.length / adminRowsPerPage)))} disabled={studPage >= Math.ceil(studentRosterData.length / adminRowsPerPage)} className="px-3 py-1.5 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 bg-white transition">Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE COURSES */}
          {activeTab === 'Courses' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Course Directory</h2>
                  <p className="text-xs text-slate-400">Manage available courses, credits, and teaching assignments.</p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    setCurrentCourse({ courseCode: '', courseName: '', instructor: '', credits: 3, fee: 'LKR 45,000' });
                    setCourseModalMode('add');
                    setCourseModalError('');
                    setIsCourseModalOpen(true);
                  }}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add New Course
                </Button>
              </div>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 font-bold text-xs uppercase tracking-wider w-full">
                  No courses found matching &ldquo;<span className="font-semibold text-slate-600">{searchQuery}</span>&rdquo;
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div key={course.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-slate-350 transition-all group flex flex-col justify-between relative">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-[10px] font-black px-3 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100 uppercase tracking-wider">
                            {course.courseCode}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setCurrentCourse(course);
                                setCourseModalMode('edit');
                                setCourseModalError('');
                                setIsCourseModalOpen(true);
                              }}
                              className="p-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <button 
                              onClick={() => {
                                setCourseToDelete(course);
                                setDeleteCourseError('');
                                setIsDeleteCourseOpen(true);
                              }}
                              className="text-red-500 hover:bg-red-50 hover:text-red-700 p-2 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                              title="Delete Course"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-base font-black text-slate-850 mb-4 group-hover:text-[#5c4fe5] transition-colors leading-snug">{course.courseName}</h3>
                      </div>
                      
                      <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-bold text-slate-400">
                        <p className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2 text-slate-400 opacity-80" /> {course.instructor || 'TBD'}
                        </p>
                        <p className="flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-slate-400 opacity-80" /> {course.credits || 3} Credits
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MANAGE TEACHERS */}
          {activeTab === 'Teachers' && (
            <div className="w-full space-y-6 animate-in fade-in duration-300">
              {/* Header with Add Teacher button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Teacher Registry</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">View and manage all registered faculty members.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-200 uppercase tracking-wider shrink-0">
                    {teachers.length} Teachers
                  </span>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setTeacherUsername('');
                      setTeacherEmail('');
                      setTeacherPassword('');
                      setTeacherSuccess('');
                      setTeacherError('');
                      setIsTeacherModalOpen(true);
                    }}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Add Teacher
                  </Button>
                </div>
              </div>

              {/* Full-width Teacher Table */}
              <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
                {teacherSuccess && (
                  <div className="mb-6 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider animate-pulse">
                    {teacherSuccess}
                  </div>
                )}

                {teachers.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-bold uppercase tracking-wider">
                    No teachers registered yet.
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                    <table className="w-full text-left border-collapse min-w-max">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                          <th className="py-4 px-6">ID</th>
                          <th className="py-4 px-6">Username</th>
                          <th className="py-4 px-6">Email</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-semibold text-slate-700">
                        {teachers.slice((teachPage - 1) * adminRowsPerPage, teachPage * adminRowsPerPage).map((teacher) => (
                          <tr key={teacher.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                            <td className="py-3.5 px-6 text-slate-400 font-mono text-xs">#{teacher.id}</td>
                            <td className="py-3.5 px-6 text-slate-800 font-bold">{teacher.username}</td>
                            <td className="py-3.5 px-6 text-slate-500 font-medium">{teacher.email}</td>
                            <td className="py-3.5 px-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button 
                                  onClick={() => {
                                    setEditingTeacher(teacher);
                                    setEditTeacherUsername(teacher.username || '');
                                    setEditTeacherEmail(teacher.email || '');
                                    setEditTeacherPassword('');
                                    setEditTeacherSuccess('');
                                    setEditTeacherError('');
                                    setIsEditTeacherModalOpen(true);
                                  }}
                                  className="p-2 rounded-xl text-indigo-600 bg-indigo-50/70 border border-indigo-100/50 hover:bg-indigo-100 hover:text-indigo-700 transition-all duration-200 cursor-pointer inline-flex items-center justify-center shadow-sm hover:shadow"
                                  title="Edit Teacher"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => {
                                    setTeacherToDelete(teacher);
                                    setDeleteTeacherError('');
                                    setIsDeleteTeacherOpen(true);
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-rose-50 border border-transparent p-2 rounded-xl transition-all inline-flex items-center justify-center"
                                  title="Delete Faculty Account"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {teachers.length > adminRowsPerPage && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600 w-full px-4">
                    <div>Page <span className="font-semibold">{teachPage}</span> of <span className="font-semibold">{Math.ceil(teachers.length / adminRowsPerPage)}</span></div>
                    <div className="flex gap-2">
                      <button onClick={() => setTeachPage(prev => Math.max(prev - 1, 1))} disabled={teachPage === 1} className="px-3 py-1.5 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 bg-white transition">Previous</button>
                      <button onClick={() => setTeachPage(prev => Math.min(prev + 1, Math.ceil(teachers.length / adminRowsPerPage)))} disabled={teachPage >= Math.ceil(teachers.length / adminRowsPerPage)} className="px-3 py-1.5 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 bg-white transition">Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: VERIFY PAYMENTS */}
          {activeTab === 'Payments' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Verify Payments</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Review, verify, and approve bank deposit slips uploaded by students.</p>
                </div>
                
                {/* Filter Badges */}
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                  {(['All', 'Pending Verification', 'Paid', 'Rejected'] as const).map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setPaymentFilter(filter)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        paymentFilter === filter
                          ? 'bg-white text-indigo-650 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payments Table */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-full">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                        <th className="py-4 px-6 border-b border-slate-200">Username</th>
                        <th className="py-4 px-6 border-b border-slate-200">Description</th>
                        <th className="py-4 px-6 border-b border-slate-200">Amount</th>
                        <th className="py-4 px-6 border-b border-slate-200">Date</th>
                        <th className="py-4 px-6 border-b border-slate-200">Method</th>
                        <th className="py-4 px-6 border-b border-slate-200">Status</th>
                        <th className="py-4 px-6 border-b border-slate-200 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-700">
                      {(() => {
                        const filtered = payments.filter((p) => {
                          if (paymentFilter === 'All') return true;
                          return p.status === paymentFilter;
                        });

                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={7} className="py-16 text-center">
                                <div className="flex flex-col items-center justify-center space-y-3">
                                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-150">
                                    <Search className="w-5 h-5 text-slate-400" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-750">No payments found</p>
                                    <p className="text-xs text-slate-400 font-medium">No payments match the current filter.</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        }

                        return filtered.slice((payPage - 1) * adminRowsPerPage, payPage * adminRowsPerPage).map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 border-b border-slate-100 last:border-none transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{p.username}</td>
                            <td className="px-6 py-4 text-slate-500 font-semibold">{p.description || 'Tuition Fee Payment'}</td>
                            <td className="px-6 py-4 font-bold text-indigo-650">{p.amount}</td>
                            <td className="px-6 py-4 text-slate-450 font-mono text-xs">{p.date}</td>
                            <td className="px-6 py-4 text-slate-500 font-semibold">{p.method}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                p.status === 'Paid'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : p.status === 'Rejected'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {p.status || 'Pending Verification'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {p.slipImage && (
                                  <button
                                    type="button"
                                    onClick={() => setSelectedSlipImage(p.slipImage)}
                                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl transition-all"
                                    title="View Uploaded Bank Slip"
                                  >
                                    View Slip
                                  </button>
                                )}
                                {p.status !== 'Paid' && p.status !== 'Rejected' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleApprovePayment(p.id)}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md"
                                      title="Approve and Enroll Student"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRejectPayment(p.id)}
                                      className="px-3 py-1.5 bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 text-xs font-bold rounded-xl transition-all"
                                      title="Reject Payment"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
                {(() => { const f = payments.filter((p: any) => paymentFilter === 'All' || p.status === paymentFilter); return f.length > adminRowsPerPage; })() && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600 w-full px-4">
                    <div>Page <span className="font-semibold">{payPage}</span> of <span className="font-semibold">{(() => { const f = payments.filter((p: any) => paymentFilter === 'All' || p.status === paymentFilter); return Math.ceil(f.length / adminRowsPerPage); })()}</span></div>
                    <div className="flex gap-2">
                      <button onClick={() => setPayPage(prev => Math.max(prev - 1, 1))} disabled={payPage === 1} className="px-3 py-1.5 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 bg-white transition">Previous</button>
                      <button onClick={() => setPayPage(prev => { const f = payments.filter((p: any) => paymentFilter === 'All' || p.status === paymentFilter); return Math.min(prev + 1, Math.ceil(f.length / adminRowsPerPage)); })} disabled={payPage >= (() => { const f = payments.filter((p: any) => paymentFilter === 'All' || p.status === paymentFilter); return Math.ceil(f.length / adminRowsPerPage); })()} className="px-3 py-1.5 border rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 bg-white transition">Next</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* STUDENT ADD/EDIT MODAL */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-855">
                {studentModalMode === 'add' ? 'Register Student' : 'Edit Registration'}
              </h3>
              <button 
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-450 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={saveStudent} className="p-6 space-y-4">
              {studentModalError && (
                <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in">
                  {studentModalError}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">Student Name</label>
                <input 
                  type="text" 
                  value={currentStudent.name || ''} 
                  onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={currentStudent.email || ''} 
                  onChange={e => setCurrentStudent({...currentStudent, email: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-505/10 focus:border-indigo-400 transition-all font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">Phone</label>
                  <input 
                    type="text" 
                    value={currentStudent.phone || ''} 
                    onChange={e => setCurrentStudent({...currentStudent, phone: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">Age</label>
                  <input 
                    type="number" 
                    value={currentStudent.age || ''} 
                    onChange={e => setCurrentStudent({...currentStudent, age: Number(e.target.value)})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1.5">Address</label>
                <input 
                  type="text" 
                  value={currentStudent.address || ''} 
                  onChange={e => setCurrentStudent({...currentStudent, address: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsStudentModalOpen(false)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" size="lg" className="flex-1">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COURSE ADD MODAL */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-850">
                {courseModalMode === 'edit' ? 'Edit Course' : 'Create New Course'}
              </h3>
              <button 
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-450 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={saveCourse} className="p-6 space-y-4">
              {courseModalError && (
                <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in">
                  {courseModalError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">Code</label>
                  <input 
                    type="text" 
                    placeholder="MTH202"
                    value={currentCourse.courseCode || ''} 
                    onChange={e => setCurrentCourse({...currentCourse, courseCode: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1.5">Course Name</label>
                  <input 
                    type="text" 
                    placeholder="Advanced Calculus"
                    value={currentCourse.courseName || ''} 
                    onChange={e => setCurrentCourse({...currentCourse, courseName: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">Instructor</label>
                <input 
                  type="text" 
                  placeholder="Prof. Albert Einstein"
                  value={currentCourse.instructor || ''} 
                  onChange={e => setCurrentCourse({...currentCourse, instructor: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-1.5">Credits</label>
                  <input 
                    type="number" 
                    min="1"
                    max="6"
                    value={currentCourse.credits || 3} 
                    onChange={e => setCurrentCourse({...currentCourse, credits: Number(e.target.value)})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-455 uppercase tracking-wider mb-1.5">Fee</label>
                  <input 
                    type="text" 
                    placeholder="LKR 45,000"
                    value={currentCourse.fee || ''} 
                    onChange={e => setCurrentCourse({...currentCourse, fee: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsCourseModalOpen(false)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" size="lg" className="flex-1">
                  {courseModalMode === 'edit' ? 'Save Changes' : 'Create Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT DELETE MODAL */}
      {isDeleteDialogOpen && studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-slate-100 flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 text-left">Delete Student?</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed text-left">
                  Are you sure you want to remove <span className="font-semibold text-slate-800">{studentToDelete.name}</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            {deleteStudentError && (
              <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in">
                {deleteStudentError}
              </div>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteDialogOpen(false);
                  setStudentToDelete(null);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-xs uppercase tracking-wider"
                disabled={isDeletingStudent}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-red-100"
                disabled={isDeletingStudent}
              >
                {isDeletingStudent ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEACHER DELETE MODAL */}
      {isDeleteTeacherOpen && teacherToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-slate-100 flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 text-left">Delete Faculty Account?</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed text-left">
                  Are you sure you want to remove <span className="font-semibold text-slate-800">{teacherToDelete.username}</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            {deleteTeacherError && (
              <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in">
                {deleteTeacherError}
              </div>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteTeacherOpen(false);
                  setTeacherToDelete(null);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-xs uppercase tracking-wider"
                disabled={isDeletingTeacher}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTeacher}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-red-100"
                disabled={isDeletingTeacher}
              >
                {isDeletingTeacher ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COURSE DELETE MODAL */}
      {isDeleteCourseOpen && courseToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md border border-slate-100 flex flex-col space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 text-left">Delete Course?</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed text-left">
                  Are you sure you want to remove <span className="font-semibold text-slate-800">{courseToDelete.courseName}</span>? This action cannot be undone.
                </p>
              </div>
            </div>
            {deleteCourseError && (
              <div className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in">
                {deleteCourseError}
              </div>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteCourseOpen(false);
                  setCourseToDelete(null);
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors text-xs uppercase tracking-wider"
                disabled={isDeletingCourse}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCourse}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-red-100"
                disabled={isDeletingCourse}
              >
                {isDeletingCourse ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD TEACHER MODAL */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-[#5c4fe5]">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Add Teacher</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Create a secure teacher credential</p>
                </div>
              </div>
              <button 
                onClick={() => setIsTeacherModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success / Error Messages */}
            {(teacherSuccess || teacherError) && (
              <div className={`mx-6 mt-5 text-xs font-bold uppercase tracking-wider p-3 rounded-xl border animate-in fade-in ${
                teacherSuccess 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {teacherSuccess || teacherError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAddTeacher} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="teacher_username"
                    value={teacherUsername}
                    onChange={(e) => setTeacherUsername(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                    required
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="teacher@auraedu.com"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Temporary Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                    required
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  loading={teacherLoading}
                >
                  {teacherLoading ? 'Creating...' : 'Register Teacher'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TEACHER MODAL */}
      {isEditTeacherModalOpen && editingTeacher && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-[#5c4fe5]">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Edit Teacher</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Update faculty credentials</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsEditTeacherModalOpen(false);
                  setEditingTeacher(null);
                  setEditTeacherSuccess('');
                }}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(editTeacherSuccess || editTeacherError) && (
              <div className={`mx-6 mt-5 text-xs font-bold uppercase tracking-wider p-3 rounded-xl border animate-in fade-in ${
                editTeacherSuccess 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                  : 'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {editTeacherSuccess || editTeacherError}
              </div>
            )}

            <form onSubmit={handleEditTeacher} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="teacher_username"
                    value={editTeacherUsername}
                    onChange={(e) => setEditTeacherUsername(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                    required
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="teacher@auraedu.com"
                    value={editTeacherEmail}
                    onChange={(e) => setEditTeacherEmail(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password (leave blank to keep current)</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter new password if needed"
                    value={editTeacherPassword}
                    onChange={(e) => setEditTeacherPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditTeacherModalOpen(false);
                    setEditingTeacher(null);
                    setEditTeacherSuccess('');
                  }}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  loading={editTeacherLoading}
                >
                  {editTeacherLoading ? 'Updating...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPOSIT SLIP LIGHTBOX MODAL */}
      {selectedSlipImage && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedSlipImage(null)}
        >
          <div 
            className="relative bg-white rounded-[2.5rem] p-6 shadow-2xl max-w-2xl w-full flex flex-col space-y-4 animate-in zoom-in-95 duration-200 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-150 pb-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Bank Deposit Slip Photograph</span>
              <button 
                type="button"
                onClick={() => setSelectedSlipImage(null)} 
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-[55vh] bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-100 p-2">
              <img 
                src={selectedSlipImage} 
                alt="Deposit Slip Document" 
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button 
                type="button"
                onClick={() => setSelectedSlipImage(null)} 
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-850 uppercase tracking-wider transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents for cleaner code organization

function AdminStatCard({ icon, label, value, sub, color }: { icon: React.ReactNode, label: string, value: string, sub: string, color: string }) {
  const stripeColors: Record<string, string> = {
    indigo: 'from-indigo-500 to-indigo-650',
    purple: 'from-purple-500 to-purple-600',
    emerald: 'from-emerald-500 to-emerald-600',
    blue: 'from-blue-500 to-blue-600',
  };

  const glowColors: Record<string, string> = {
    indigo: 'shadow-indigo-550/5 group-hover:shadow-indigo-550/15',
    purple: 'shadow-purple-500/5 group-hover:shadow-purple-500/15',
    emerald: 'shadow-emerald-500/5 group-hover:shadow-emerald-500/15',
    blue: 'shadow-blue-500/5 group-hover:shadow-blue-500/15',
  };

  const iconBgs: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
    purple: 'bg-purple-50 text-purple-600 border-purple-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    blue: 'bg-blue-50 text-blue-600 border-blue-100/50',
  };

  return (
    <div className={`group bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-[2rem] p-6 relative overflow-hidden flex flex-col shadow-xl ${glowColors[color]} hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer pb-8`}>
      <div className="flex justify-between items-center mb-5">
        <div className={`w-11 h-11 rounded-2xl ${iconBgs[color] || 'bg-slate-50'} flex items-center justify-center border shadow-inner transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
      </div>

      <div className="flex space-x-1.5 mb-4 opacity-25">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
      </div>

      <div>
        <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
        {sub}
      </div>

      <div className={`h-1.5 absolute bottom-0 left-0 right-0 w-full bg-gradient-to-r ${stripeColors[color] || 'from-slate-200 to-slate-300'} rounded-b-3xl`} />
    </div>
  );
}

function LogItem({ title, desc, time }: { title: string, desc: string, time: string }) {
  return (
    <div className="flex gap-4 group items-center py-3.5 first:pt-0 last:pb-0">
      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#5c4fe5] transition-colors truncate leading-tight">{title}</h4>
        <p className="text-xs text-slate-505 mt-1">{desc}</p>
      </div>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">{time}</span>
    </div>
  );
}
