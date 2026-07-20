'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  CheckCircle,
  UploadCloud,
  FileText,
  Calendar,
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import PageHeader from '@/components/ui/PageHeader';
import StatusBadge from '@/components/ui/StatusBadge';
import Toast from '@/components/ui/Toast';
import { useTheme } from '@/contexts/ThemeContext';

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

  const [submittingAssignId, setSubmittingAssignId] = useState<number | null>(null);
  const [fileName, setFileName] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const theme = useTheme();

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
        apiFetch<Submission[]>(`/api/submissions/student/${username}`),
      ]);

      setAssignments(assignmentsData || []);
      setSubmissions(submissionsData || []);
    } catch (err: unknown) {
      console.error('Error fetching student assignments:', err);
      setError(err instanceof Error ? err.message : 'Failed to retrieve assignment data from registry.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent, assignmentId: number) => {
    e.preventDefault();
    if (!fileName) {
      alert('Please enter a submission file name.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const newSubmission = {
      assignmentId: assignmentId,
      studentName: studentName,
      studentUsername: studentUsername,
      fileUrl: `https://auraedu-storage.s3.amazonaws.com/submissions/${studentUsername}_${fileName.toLowerCase().replace(/\s+/g, '_')}`,
      marks: 0,
      feedback: '',
      submittedAt: todayStr,
    };

    try {
      const savedSubmission = await apiFetch<Submission>('/api/submissions', {
        method: 'POST',
        body: newSubmission,
      });

      setSubmissions((prev) => [...prev, savedSubmission]);
      setFileName('');
      setSubmittingAssignId(null);
      setSubmitSuccess('Assignment submitted successfully! 🚀');
      setTimeout(() => setSubmitSuccess(''), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to submit assignment solution');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your assignments..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={fetchData} retryLabel="Retry Load" />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {submitSuccess && (
        <Toast message={submitSuccess} type="success" onDismiss={() => setSubmitSuccess('')} />
      )}

      {/* Page Header */}
      <PageHeader
        icon={<BookOpen className="text-primary w-8 h-8" />}
        tag="Student Workspace"
        title="My Assignments"
        description="Track course assignments, submit your deliverables, and review grading evaluations and feedback."
      />

      {/* Assignments List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {assignments.length === 0 ? (
          <div className="md:col-span-2 py-16 text-center bg-card border border-muted-border/80 rounded-[2rem] text-slate-400 font-semibold">
            No assignments have been assigned to your courses yet.
          </div>
        ) : (
          assignments.map((assign) => {
            const studentSub = submissions.find(
              (s) =>
                s.assignmentId === assign.id &&
                (s.studentUsername || '').toLowerCase() === (studentUsername || '').toLowerCase()
            );
            const hasSubmitted = !!studentSub;
            const isGraded = hasSubmitted && studentSub.marks > 0;
            const isSubmitFormOpen = submittingAssignId === assign.id;

            return (
              <div
                key={assign.id}
                className="bg-card border border-muted-border/80 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-3 py-1 rounded-lg bg-primary-light border border-primary/20 text-sm font-semibold text-primary-hover tracking-wider uppercase">
                      {assign.courseName}
                    </span>
                    <span className="text-sm font-semibold text-slate-700 bg-muted border border-muted-border px-3 py-1 rounded-lg">
                      Max Marks: {assign.maxMarks}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-lg">{assign.title}</h3>

                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 bg-muted p-3 rounded-xl border border-muted-border w-fit">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Deadline: {assign.deadline}</span>
                  </div>
                </div>

                <div className="pt-5 border-t border-muted-border space-y-4">
                  {isGraded ? (
                    <div className="space-y-3 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between">
                        <StatusBadge status="Graded" />
                        <span className="text-sm font-bold text-primary">
                          Score: {studentSub.marks} / {assign.maxMarks} Marks
                        </span>
                      </div>

                      {studentSub.feedback && (
                        <div className="text-sm bg-muted border border-muted-border p-4 rounded-2xl text-slate-500 font-medium italic">
                          &ldquo;{studentSub.feedback}&rdquo;
                        </div>
                      )}
                    </div>
                  ) : hasSubmitted ? (
                    <div className="flex items-center justify-between animate-in fade-in duration-300">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-slate-700">Submitted solution file</span>
                      </div>
                      <StatusBadge status="PendingEvaluation" />
                    </div>
                  ) : isSubmitFormOpen ? (
                    <form onSubmit={(e) => handleUploadSubmit(e, assign.id)} className="space-y-4 pt-2 animate-in slide-in-from-top-3 duration-300">
                      <div>
                        <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Enter Submission File Name</label>
                        <input
                          type="text"
                          placeholder="e.g. java_midterm_project.pdf"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                          className="w-full bg-card border border-muted-border rounded-xl px-4 py-2.5 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setSubmittingAssignId(null)}
                          className="px-4 py-2 bg-muted hover:bg-muted-border text-slate-600 rounded-xl text-sm font-semibold transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="text-white font-semibold px-6 py-2 rounded-lg text-sm uppercase tracking-wider transition-all"
                          style={{ backgroundColor: theme.primary }}
                        >
                          Submit Solution
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSubmittingAssignId(assign.id)}
                      className="w-full flex items-center justify-center gap-2 text-white font-semibold px-6 py-2 rounded-lg text-sm uppercase tracking-wider transition-all"
                      style={{ backgroundColor: theme.primary }}
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