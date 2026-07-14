'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Key
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

  // Modal States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentModalMode, setStudentModalMode] = useState<'add' | 'edit'>('add');
  const [currentStudent, setCurrentStudent] = useState<Partial<Student>>({});

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course>>({});

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
      fetchTeachers(); // Refresh directory list
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

  const handleDeleteTeacher = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this teacher account?')) return;
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      setTeachers(teachers.filter((t) => t.id !== id));
    } catch (err: any) {
      console.error('Error deleting teacher:', err);
      alert(err.message || 'Failed to delete teacher.');
    }
  };

  // Student CRUD Handlers
  const openEditStudentModal = (student: Student) => {
    setStudentModalMode('edit');
    setCurrentStudent(student);
    setIsStudentModalOpen(true);
  };

  const saveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent.id || !currentStudent.name || !currentStudent.email) return;

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
      alert(err.message || 'Failed to update student.');
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    try {
      await apiFetch(`/api/students/${id}`, { method: 'DELETE' });
      fetchStudents();
    } catch (err: any) {
      console.error('Error deleting student:', err);
      alert(err.message || 'Failed to delete student.');
    }
  };

  // Course CRUD Handlers
  const saveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCourse.courseCode || !currentCourse.courseName || !currentCourse.instructor) return;

    try {
      await apiFetch('/api/courses', {
        method: 'POST',
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
      alert(err.message || 'Failed to save course.');
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await apiFetch(`/api/courses/${id}`, { method: 'DELETE' });
      fetchCourses();
    } catch (err: any) {
      console.error('Error deleting course:', err);
      alert(err.message || 'Failed to delete course.');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 mt-4 font-semibold">Verifying authorization credentials...</p>
      </div>
    );
  }

  const menuItems = [
    { id: 'Overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'Students', icon: Users, label: 'Manage Students' },
    { id: 'Courses', icon: BookOpen, label: 'Manage Courses' },
    { id: 'Teachers', icon: UserCheck, label: 'Add Teacher' },
  ];

  const adminInitials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'A';

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-850 overflow-hidden font-sans selection:bg-indigo-500/20">
      
      {/* SIDEBAR - DESKTOP */}
      <aside className="hidden md:flex w-72 bg-[#0b0e1e] flex-col justify-between relative z-20 border-r border-[#151a3a]">
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-[#151a3a]/40">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="text-white w-5 h-5 animate-pulse" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">AuraEdu</span>
          </div>

          <div className="py-6 px-4 space-y-1.5 overflow-y-auto dark-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
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
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-[#151a3a]/40">
          <div className="bg-[#121634] border border-[#212854]/40 p-4 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-sm shrink-0 border border-[#2b356d]">
                {adminInitials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate leading-tight">{adminName}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Admin Panel</span>
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

      {/* MOBILE SIDEBAR DRAWVER */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-sm transition-opacity">
          <aside className="w-72 bg-[#0b0e1e] h-full flex flex-col justify-between border-r border-[#151a3a] relative animate-in slide-in-from-left duration-300">
            <div>
              <div className="p-6 flex items-center justify-between border-b border-[#151a3a]/40">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">A</div>
                  <span className="text-xl font-bold text-white">AuraEdu</span>
                </div>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-[#151b3c] text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="py-6 px-4 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-[#5c4fe5] to-[#4c3ce0] text-white font-semibold' 
                          : 'text-slate-400 hover:bg-[#151b3c]/50 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-[#151a3a]/40">
              <div className="bg-[#121634] p-4 rounded-2xl flex items-center justify-between">
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
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 md:hidden"
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
                className="bg-white border border-slate-200 text-slate-750 text-sm rounded-full pl-11 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 w-64 shadow-sm transition-all"
              />
              <Search className="w-4 h-4 text-slate-450 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            <button className="bg-white border border-slate-200 p-2.5 rounded-full text-slate-550 hover:text-indigo-650 hover:bg-slate-50 shadow-sm transition-all relative">
              <MessageSquare className="w-4.5 h-4.5" />
            </button>
            
            <button className="bg-white border border-slate-200 p-2.5 rounded-full text-slate-550 hover:text-indigo-650 hover:bg-slate-50 shadow-sm transition-all relative">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-655 bg-indigo-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="bg-white border border-slate-200/80 shadow-sm p-1.5 pr-4 rounded-full flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#0b0e1e] border border-slate-850 flex items-center justify-center font-bold text-white text-xs">
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
              <div className="p-8 rounded-[2rem] bg-gradient-to-r from-[#0d1538] via-[#090e24] to-[#0c1c4d] border border-[#1e2756]/40 relative overflow-hidden shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none animate-pulse" />
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-14 h-14 bg-[#141b3e] border border-[#232f65] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg">
                    <UserCheck className="text-indigo-400 w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#1b2554]/40 border border-[#2d3a77]/50 text-[10px] font-bold text-indigo-400 tracking-wider mb-2.5 uppercase">
                      SYSTEM OPERATIONS
                    </span>
                    <h2 className="text-3xl font-black text-white leading-tight">
                      Support Hub
                    </h2>
                    <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                      Welcome Back Admin, {adminName}! Management console for AuraEdu facilities and resource maintenance logs.
                    </p>
                  </div>
                </div>
                <div className="relative z-10 shrink-0">
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:from-blue-500 hover:to-indigo-550 transition-all text-sm uppercase tracking-wider">
                    + NEW LOG REPORT
                  </button>
                </div>
              </div>

              {/* Stats Grid with Accent Stripes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatCard icon={<Users className="text-indigo-650 w-5 h-5" />} label="TOTAL STUDENTS" value={students.length.toString()} sub="Active Enrollment" color="indigo" />
                <AdminStatCard icon={<BookOpen className="text-purple-650 w-5 h-5" />} label="TOTAL COURSES" value={courses.length.toString()} sub="Active Catalog" color="purple" />
                <AdminStatCard icon={<Briefcase className="text-emerald-650 w-5 h-5" />} label="TOTAL FACULTY" value="28" sub="Full-time / Part-time" color="emerald" />
                <AdminStatCard icon={<DollarSign className="text-blue-650 w-5 h-5" />} label="MONTHLY REVENUE" value="$48,250" sub="+14% vs Last Month" color="blue" />
              </div>

              {/* Logs and Platform Security */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#5c4fe5]" /> Administrative Logs
                  </h3>
                  <div className="space-y-4 divide-y divide-slate-100">
                    <LogItem title="New Student Registered" desc="Liam Carter joined the B.Sc Computer Science degree path." time="10 mins ago" />
                    <LogItem title="New Course Published" desc="ENG105 'World Literature' course syllabus updated." time="1 hour ago" />
                    <LogItem title="Faculty Assignment" desc="Dr. Sarah Jenkins assigned to teach Advanced Physics (PHY301)." time="3 hours ago" />
                    <LogItem title="Payment Received" desc="Tuition receipt generated for Student Nethmi Umesha ($2,400)." time="Yesterday" />
                  </div>
                </div>

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
            </div>
          )}

          {/* TAB 2: MANAGE STUDENTS */}
          {activeTab === 'Students' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Student Roster</h2>
                  <p className="text-xs text-slate-400">View, modify, and delete student registrations.</p>
                </div>
              </div>

              {/* Modern Light-mode Table */}
              <div className="bg-white border border-slate-200/80 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
                        <th className="py-4 px-6">Student Name</th>
                        <th className="py-4 px-6">Email</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-semibold text-slate-700">
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-6 font-bold text-slate-850">{student.name}</td>
                          <td className="py-4 px-6 text-slate-500 font-medium">{student.email}</td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2 ml-auto">
                              <button 
                                onClick={() => openEditStudentModal(student)}
                                className="p-2 border border-slate-100 hover:bg-slate-50 rounded-xl text-indigo-600 hover:text-indigo-800 transition-all shadow-sm"
                                title="Edit Student"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteStudent(student.id)}
                                className="p-2 border border-slate-100 hover:bg-rose-50 rounded-xl text-rose-500 hover:text-rose-700 transition-all shadow-sm"
                                title="Delete Student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
                <button 
                  onClick={() => {
                    setCurrentCourse({ courseCode: '', courseName: '', instructor: '', credits: 3, fee: 'LKR 45,000' });
                    setIsCourseModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center uppercase tracking-wider self-start sm:self-center"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add New Course
                </button>
              </div>

              {/* Course Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md hover:border-slate-350 transition-all group flex flex-col relative">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black px-3 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-100">
                        {course.courseCode}
                      </span>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => deleteCourse(course.id.toString())}
                          className="p-1.5 border border-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg shadow-sm transition-all"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-base font-black text-slate-850 mb-2 group-hover:text-[#5c4fe5] transition-colors">{course.courseName}</h3>
                    
                    <div className="space-y-2 mb-6 flex-1 text-sm font-semibold text-slate-500">
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
            </div>
          )}

          {/* TAB 4: MANAGE TEACHERS */}
          {activeTab === 'Teachers' && (
            <div className="w-full flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
              {/* Left side: Add New Teacher Form */}
              <div className="w-full lg:w-1/3 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/80 h-fit">
                <div className="mb-6 flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-[#5c4fe5]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">Add Teacher</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Create a secure teacher credential record.</p>
                  </div>
                </div>

                {teacherSuccess && (
                  <div className="mb-6 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider animate-pulse">
                    {teacherSuccess}
                  </div>
                )}

                {teacherError && (
                  <div className="mb-6 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider animate-pulse">
                    {teacherError}
                  </div>
                )}

                <form onSubmit={handleAddTeacher} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="teacher_username"
                        value={teacherUsername}
                        onChange={(e) => setTeacherUsername(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                        required
                      />
                      <UserCheck className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
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
                        className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                        required
                      />
                      <Mail className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
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
                        className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                        required
                      />
                      <Key className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={teacherLoading}
                    className="mt-2 w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl px-6 py-3.5 shadow-md shadow-blue-100 transition-all uppercase text-xs tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {teacherLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Register Teacher'
                    )}
                  </button>
                </form>
              </div>

              {/* Right side: Teacher List Table */}
              <div className="w-full lg:w-2/3 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/80">
                <div className="mb-6 flex items-start gap-4 justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-[#5c4fe5]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800">Teacher Registry</h2>
                      <p className="text-xs text-slate-400 mt-0.5">View and manage all registered faculty members.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-3 py-1 bg-slate-50 text-slate-500 rounded-full border border-slate-200 uppercase tracking-wider shrink-0 animate-fade-in">
                    {teachers.length} Teachers
                  </span>
                </div>

                <div className="space-y-3">
                  {teachers.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-250 text-slate-400 text-sm font-bold uppercase tracking-wider">
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
                          {teachers.map((teacher) => (
                            <tr key={teacher.id} className="border-b border-slate-100 last:border-none hover:bg-slate-5/50 transition-colors">
                              <td className="py-3.5 px-6 text-slate-400 font-mono text-xs">#{teacher.id}</td>
                              <td className="py-3.5 px-6 text-slate-850 font-bold">{teacher.username}</td>
                              <td className="py-3.5 px-6 text-slate-500 font-medium">{teacher.email}</td>
                              <td className="py-3.5 px-6 text-right">
                                <button 
                                  onClick={() => handleDeleteTeacher(teacher.id)}
                                  className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-100 p-2 rounded-xl transition-all inline-flex items-center justify-center ml-auto"
                                  title="Delete Faculty Account"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
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
              <h3 className="text-lg font-black text-slate-850">
                {studentModalMode === 'add' ? 'Register Student' : 'Edit Registration'}
              </h3>
              <button 
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={saveStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Student Name</label>
                <input 
                  type="text" 
                  value={currentStudent.name || ''} 
                  onChange={e => setCurrentStudent({...currentStudent, name: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={currentStudent.email || ''} 
                  onChange={e => setCurrentStudent({...currentStudent, email: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                />
              </div>

              {/* Name & email fields matching registration details */}

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsStudentModalOpen(false)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-505 hover:to-indigo-550 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-100"
                >
                  Save Changes
                </button>
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
              <h3 className="text-lg font-black text-slate-850">Create New Course</h3>
              <button 
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={saveCourse} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Code</label>
                  <input 
                    type="text" 
                    placeholder="MTH202"
                    value={currentCourse.courseCode || ''} 
                    onChange={e => setCurrentCourse({...currentCourse, courseCode: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Course Name</label>
                  <input 
                    type="text" 
                    placeholder="Advanced Calculus"
                    value={currentCourse.courseName || ''} 
                    onChange={e => setCurrentCourse({...currentCourse, courseName: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Instructor</label>
                <input 
                  type="text" 
                  placeholder="Prof. Albert Einstein"
                  value={currentCourse.instructor || ''} 
                  onChange={e => setCurrentCourse({...currentCourse, instructor: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Credits</label>
                  <input 
                    type="number" 
                    min="1"
                    max="6"
                    value={currentCourse.credits || 3} 
                    onChange={e => setCurrentCourse({...currentCourse, credits: Number(e.target.value)})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fee</label>
                  <input 
                    type="text" 
                    placeholder="LKR 45,000"
                    value={currentCourse.fee || ''} 
                    onChange={e => setCurrentCourse({...currentCourse, fee: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
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
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-purple-100"
                >
                  Create Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents for cleaner code organization

function AdminStatCard({ icon, label, value, sub, color }: { icon: React.ReactNode, label: string, value: string, sub: string, color: string }) {
  const stripeColors: Record<string, string> = {
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
  };

  const iconBgs: Record<string, string> = {
    indigo: 'bg-indigo-50',
    purple: 'bg-purple-50',
    emerald: 'bg-emerald-50',
    blue: 'bg-blue-50',
  };

  return (
    <div className="bg-white shadow-sm border border-slate-200/80 rounded-3xl p-6 relative overflow-hidden flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer pb-8">
      <div className="flex justify-between items-center mb-5">
        <div className={`w-10 h-10 rounded-xl ${iconBgs[color] || 'bg-slate-50'} flex items-center justify-center shadow-inner`}>
          {icon}
        </div>
      </div>

      <div className="flex space-x-1.5 mb-4 opacity-30">
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

      <div className={`h-1.5 absolute bottom-0 left-0 right-0 w-full ${stripeColors[color] || 'bg-slate-200'} rounded-b-3xl`} />
    </div>
  );
}

function LogItem({ title, desc, time }: { title: string, desc: string, time: string }) {
  return (
    <div className="flex gap-4 group items-center py-3.5 first:pt-0 last:pb-0">
      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#5c4fe5] transition-colors truncate leading-tight">{title}</h4>
        <p className="text-xs text-slate-500 mt-1">{desc}</p>
      </div>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">{time}</span>
    </div>
  );
}
