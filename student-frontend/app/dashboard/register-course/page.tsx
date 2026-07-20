'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  CheckCircle,
  ArrowLeft,
  User,
  Award,
  DollarSign,
  Upload,
  X,
  Calendar,
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CourseCard from '@/components/ui/CourseCard';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/contexts/ToastContext';
import { useTheme } from '@/contexts/ThemeContext';

interface Course {
  id: number;
  courseName: string;
  courseCode: string;
  instructor?: string;
  credits?: number;
  fee?: string | number;
}

interface Enrollment {
  id: number;
  courseId: number;
}

export default function RegisterCoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Student');

  const { showToast } = useToast();
  const theme = useTheme();

  const [selectedCourseForReg, setSelectedCourseForReg] = useState<Course | null>(null);
  const [paymentDate, setPaymentDate] = useState('');
  const [amount, setAmount] = useState('');
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);

    const fetchData = async () => {
      try {
        const coursesList = await apiFetch<Course[]>('/api/courses');
        setCourses(coursesList || []);
        const enrollData = await apiFetch<Enrollment[]>(`/api/enrollments/student/${user}`);
        setEnrollments(enrollData || []);
      } catch (err) {
        console.error('Error loading registration catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    const today = new Date().toISOString().split('T')[0];
    setPaymentDate(today);
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      showToast('Only JPG and PNG screenshots/photo slips are accepted.', 'error');
      return;
    }
    setSlipFile(file);
    const reader = new FileReader();
    reader.onload = () => setSlipPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForReg) return;
    const numericAmount = parseFloat(amount);
    if (!paymentDate) { showToast('Please specify the deposit transaction date.', 'error'); return; }
    if (isNaN(numericAmount) || numericAmount <= 0) { showToast('Please input a valid transaction amount.', 'error'); return; }
    if (!slipFile) { showToast('Please upload your bank deposit receipt.', 'error'); return; }

    setSubmitting(true);
    try {
      const formattedAmount = `LKR ${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const formData = new FormData();
      formData.append('username', username);
      formData.append('amount', formattedAmount);
      formData.append('date', paymentDate);
      formData.append('description', selectedCourseForReg.courseName);
      formData.append('slip', slipFile);

      await apiFetch('/api/registration/submit', { method: 'POST', body: formData });
      await apiFetch('/api/enrollments', { method: 'POST', body: { username: username, courseId: selectedCourseForReg.id } });

      showToast(`Successfully registered and enrolled for ${selectedCourseForReg.courseName}! 🎓`, 'success');
      setEnrollments([...enrollments, { id: Date.now(), courseId: selectedCourseForReg.id }]);
      setSelectedCourseForReg(null);
      setSlipFile(null);
      setSlipPreview(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error processing registration and enrollment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const isEnrolled = (courseId: number) => enrollments.some(e => e.courseId === courseId);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto p-4 relative">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-4 h-4" /><span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-muted-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-sm">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div><h2 className="text-2xl font-bold text-slate-800">Course Registration</h2><p className="text-sm text-slate-400 mt-0.5">Select and register for catalog courses this semester</p></div>
        </div>
        <div className="text-sm font-semibold bg-sidebar text-white px-4 py-2 rounded-full border border-sidebar-border uppercase tracking-wider shrink-0 shadow-sm">{courses.length} Catalog Items</div>
      </div>

      {loading ? <LoadingSpinner message="Loading course catalog directory..." /> : courses.length === 0 ? (
        <div className="text-center py-24 bg-card border border-muted-border rounded-[2rem] shadow-sm text-slate-500 font-semibold text-sm uppercase tracking-wider">No courses currently listed in catalog. Contact registry administration.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} isEnrolled={isEnrolled(course.id)} onRegister={(c) => { setSelectedCourseForReg(c as Course); const feeClean = c.fee ? String(c.fee).replace(/[^0-9.]/g, '') : ''; setAmount(feeClean); }} role="STUDENT" />
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedCourseForReg} onClose={() => { setSelectedCourseForReg(null); setSlipFile(null); setSlipPreview(null); }} title="Submit Course Registration" description="Upload deposit slip to complete enrollment">
        {selectedCourseForReg && (
          <div className="space-y-4">
            <div className="bg-muted border border-muted-border p-4 rounded-2xl">
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wider">Registering for:</p>
              <p className="text-base font-bold text-primary mt-1">{selectedCourseForReg.courseCode} - {selectedCourseForReg.courseName}</p>
              <p className="text-sm text-slate-500 font-medium mt-1">Instructor: {selectedCourseForReg.instructor}</p>
            </div>
            <form onSubmit={handleRegistrationSubmit} className="space-y-4">
              <div><label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Deposit Transaction Date</label><input type="date" required value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="mt-1.5 block w-full bg-muted border border-muted-border text-slate-700 text-sm rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" /></div>
              <div><label className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><DollarSign className="w-4 h-4 text-slate-400" /> Amount Paid (LKR)</label><div className="relative mt-1.5"><input type="number" step="0.01" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 45000.00" className="w-full bg-muted border border-muted-border text-slate-700 text-sm rounded-xl pl-14 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-medium" /><span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold uppercase">LKR</span></div></div>
              <div className="p-4 bg-primary-light border border-primary/20 rounded-2xl text-sm space-y-1 text-slate-700">
                <p className="font-semibold text-primary text-sm uppercase tracking-wider mb-1.5">University Bank Account coordinates</p>
                <p><strong>Bank:</strong> Bank of Ceylon (BOC)</p><p><strong>Account Name:</strong> AuraEdu Academy (Pvt) Ltd</p><p><strong>Account Number:</strong> 8743029103</p><p><strong>Branch:</strong> Colombo Fort</p>
              </div>
              <div><label className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Bank Receipt Image</label>
                <div onClick={() => document.getElementById('reg-slip-upload-modal')?.click()} className="border-2 border-dashed border-muted-border hover:border-slate-400 rounded-2xl p-6 text-center hover:bg-muted transition-colors cursor-pointer flex flex-col items-center justify-center space-y-2 group">
                  <input id="reg-slip-upload-modal" type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
                  {slipPreview ? <div className="w-full h-40 rounded-xl overflow-hidden border border-muted-border relative bg-muted flex items-center justify-center p-2"><img src={slipPreview} alt="Receipt Preview" className="max-h-full max-w-full object-contain rounded-lg" /></div> : <><Upload className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" /><div><p className="text-sm font-semibold text-slate-600">Select deposit slip photograph</p><p className="text-xs text-slate-400 mt-1">Supports JPG, PNG file types (Max 2MB)</p></div></>}
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => { setSelectedCourseForReg(null); setSlipFile(null); setSlipPreview(null); }} className="flex-1 bg-muted hover:bg-muted-border text-slate-600 font-semibold py-3.5 px-6 rounded-lg text-sm uppercase tracking-wider transition-all" style={{ backgroundColor: theme.muted }}>Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 text-white font-semibold py-3.5 px-6 rounded-lg text-sm uppercase tracking-wider transition-all disabled:opacity-50" style={{ backgroundColor: theme.primary }}>{submitting ? 'Registering...' : 'Register & Enroll'}</button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}