'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  UploadCloud, 
  AlertCircle,
  FileText,
  Loader2,
  Calendar
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Assignment {
  id: number;
  courseName: string;
  title: string;
  deadline: string;
  maxMarks: number;
}

interface Submission {
  id: number;
  assignmentId: number;
  studentName: string;
  studentUsername: string;
  fileUrl: string;
  marks: number;
  feedback: string;
  submittedAt: string;
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [studentUsername, setStudentUsername] = useState('student');
  const [studentName, setStudentName] = useState('Student');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Submission Form State
  const [submittingAssignId, setSubmittingAssignId] = useState<number | null>(null);
  const [fileName, setFileName] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username') || 'student';
      setStudentUsername(username);
      setStudentName(username.charAt(0).toUpperCase() + username.slice(1));
    }
    
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const username = typeof window !== 'undefined' ? (localStorage.getItem('username') || 'student') : 'student';
      const [assignmentsData, submissionsData] = await Promise.all([
        apiFetch<Assignment[]>('/api/assignments'),
        apiFetch<Submission[]>(`/api/submissions`) // Load all, filter in frontend or use endpoint
      ]);
      
      setAssignments(assignmentsData || []);
      setSubmissions(submissionsData || []);
    } catch (err: any) {
      console.error('Error fetching student assignments:', err);
      setError(err.message || 'Failed to retrieve assignment data from registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent, assignmentId: number) => {
    e.preventDefault();
    if (!fileName) {
      alert("Please enter a submission file name.");
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    const newSubmission = {
      assignmentId: assignmentId,
      studentName: studentName,
      studentUsername: studentUsername,
      fileUrl: `https://auraedu-storage.s3.amazonaws.com/submissions/${studentUsername}_${fileName.toLowerCase().replace(/\s+/g, '_')}`,
      marks: 0,
      feedback: '',
      submittedAt: todayStr
    };

    try {
      const savedSubmission = await apiFetch<Submission>('/api/submissions', {
        method: 'POST',
        body: newSubmission
      });

      setSubmissions(prev => [...prev, savedSubmission]);
      setFileName('');
      setSubmittingAssignId(null);
      setSubmitSuccess('Assignment submitted successfully! 🚀');
      setTimeout(() => setSubmitSuccess(''), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to submit assignment solution");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-650 animate-spin" />
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Loading your assignments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-[2rem] text-center max-w-2xl mx-auto space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
        <h3 className="text-lg font-black text-rose-800">Connection Error</h3>
        <p className="text-rose-700 text-sm">{error}</p>
        <button 
          onClick={fetchData} 
          className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors shadow-md shadow-rose-100"
        >
          Retry Load
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-r from-[#0d1538] via-[#090e24] to-[#0c1c4d] border border-[#1e2756]/40 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-indigo-505/10 to-transparent pointer-events-none" />
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-14 h-14 bg-[#141b3e] border border-[#232f65] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/15">
            <BookOpen className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1b2554]/40 border border-[#2d3a77]/50 text-[10px] font-bold text-indigo-400 tracking-wider mb-2.5 uppercase">
              Student Workspace
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              My Assignments
            </h1>
            <p className="text-slate-455 text-sm mt-1 max-w-2xl">
              Track course assignments, submit your deliverables, and review grading evaluations and feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {submitSuccess && (
        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3.5 text-xs font-bold uppercase tracking-wider animate-pulse max-w-2xl mx-auto text-center">
          {submitSuccess}
        </div>
      )}

      {/* Assignments List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assignments.length === 0 ? (
          <div className="md:col-span-2 py-16 text-center bg-white border border-slate-200/80 rounded-[2rem] text-slate-400 font-semibold">
            No assignments have been assigned to your courses yet.
          </div>
        ) : (
          assignments.map(assign => {
            // Find student's submission for this assignment
            const studentSub = submissions.find(s => 
              s.assignmentId === assign.id && 
              (s.studentUsername || '').toLowerCase() === (studentUsername || '').toLowerCase()
            );
            const hasSubmitted = !!studentSub;
            const isGraded = hasSubmitted && studentSub.marks > 0;
            const isSubmitFormOpen = submittingAssignId === assign.id;

            return (
              <div 
                key={assign.id}
                className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300"
              >
                {/* Course & Title Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-[10px] font-black text-indigo-600 tracking-wider uppercase">
                      {assign.courseName}
                    </span>
                    <span className="text-[11px] font-black text-slate-700 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
                      Max Marks: {assign.maxMarks}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-lg">
                    {assign.title}
                  </h3>

                  {/* Deadline info */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-455 bg-slate-50 p-3 rounded-xl border border-slate-100 w-fit">
                    <Calendar className="w-4 h-4 text-indigo-550" />
                    <span>Deadline: {assign.deadline}</span>
                  </div>
                </div>

                {/* Status Badges or Submit Actions */}
                <div className="pt-5 border-t border-slate-100 space-y-4">
                  {isGraded ? (
                    // GRADED STATE
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Graded</span>
                        </span>
                        <span className="text-sm font-black text-emerald-600">
                          Score: {studentSub.marks} / {assign.maxMarks} Marks
                        </span>
                      </div>
                      
                      {studentSub.feedback && (
                        <div className="text-xs bg-slate-50 border border-slate-150 p-4 rounded-2xl text-slate-500 font-medium italic">
                          &ldquo;{studentSub.feedback}&rdquo;
                        </div>
                      )}
                    </div>
                  ) : hasSubmitted ? (
                    // PENDING GRADING STATE
                    <div className="flex items-center justify-between animate-in fade-in duration-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-xs font-bold text-slate-700">Submitted solution file</span>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-600 tracking-wider">
                        Pending Evaluation
                      </span>
                    </div>
                  ) : isSubmitFormOpen ? (
                    // SUBMIT WORK FORM
                    <form 
                      onSubmit={(e) => handleUploadSubmit(e, assign.id)} 
                      className="space-y-4 pt-2 animate-in slide-in-from-top-3 duration-300"
                    >
                      <div>
                        <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1.5">Enter Submission File Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. java_midterm_project.pdf"
                          value={fileName}
                          onChange={e => setFileName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <button 
                          type="button" 
                          onClick={() => setSubmittingAssignId(null)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-100"
                        >
                          Submit Solution
                        </button>
                      </div>
                    </form>
                  ) : (
                    // INITIAL ACTION BUTTON
                    <button
                      type="button"
                      onClick={() => setSubmittingAssignId(assign.id)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-100 uppercase tracking-wider"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Submit Assignment</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
