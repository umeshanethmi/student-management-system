'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  AlertCircle,
  Loader2,
  Calendar,
  ClipboardList,
  X,
  Plus,
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import Button from '@/components/ui/Button';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import PageHeader from '@/components/ui/PageHeader';

interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  credits: number;
  fee?: number | string;
  instructor?: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
  username: string;
}

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

export default function AssignmentsPortalPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // ── Assignment form state ────────────────────────────────────
  const [newAssignCourse, setNewAssignCourse] = useState('');
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignDeadline, setNewAssignDeadline] = useState('');
  const [newAssignMaxMarks, setNewAssignMaxMarks] = useState(100);
  const [assignSuccess, setAssignSuccess] = useState('');

  // ── Modal state ───────────────────────────────────────────────
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  const [selectedAssignId, setSelectedAssignId] = useState<number>(0);

  const [gradingSubId, setGradingSubId] = useState<number | null>(null);
  const [subMarks, setSubMarks] = useState(0);
  const [subFeedback, setSubFeedback] = useState('');

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true); setError('');
    try {
      const [coursesData, studentsData, assignmentsData, submissionsData] = await Promise.all([
        apiFetch<Course[]>('/api/courses'),
        apiFetch<Student[]>('/api/students'),
        apiFetch<Assignment[]>('/api/assignments'),
        apiFetch<Submission[]>('/api/submissions')
      ]);
      setCourses(coursesData || []);
      setStudents(studentsData || []);
      setAssignments(assignmentsData || []);
      setSubmissions(submissionsData || []);
      if (coursesData && coursesData.length > 0) setNewAssignCourse(coursesData[0].courseName);
      if (assignmentsData && assignmentsData.length > 0) setSelectedAssignId(assignmentsData[0].id);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve registry records.');
    } finally { setLoading(false); }
  };

  const filteredStudents = students.filter((student) => {
    const username = (student.username || '').toLowerCase();
    const email = (student.email || '').toLowerCase();
    const name = (student.name || '').toLowerCase();
    const isAdmin = username.includes('admin') || email.includes('admin') || name.includes('admin');
    const isTeacher = username.includes('teacher') || email.includes('teacher') || name.includes('teacher') || username.startsWith('aura26l');
    return !isAdmin && !isTeacher;
  });

  const formatBackendDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignCourse || !newAssignTitle || !newAssignDeadline) {
      alert("Please fill out all fields.");
      return;
    }
    const formattedDate = formatBackendDate(newAssignDeadline);
    const newAssignment = { courseName: newAssignCourse, title: newAssignTitle, deadline: formattedDate, maxMarks: Number(newAssignMaxMarks) || 100 };
    try {
      const savedAssignment = await apiFetch<Assignment>('/api/assignments', { method: 'POST', body: newAssignment });
      setAssignments(prev => [...prev, savedAssignment]);
      if (selectedAssignId === 0) setSelectedAssignId(savedAssignment.id);
      
      // Try to create a mock submission (optional, silently ignore if it fails)
      try {
        const randomStudent = filteredStudents.length > 0 ? filteredStudents[0] : { name: "Nethmi", username: "nethmi" };
        const mockSubmission = { assignmentId: savedAssignment.id, studentName: randomStudent.name, studentUsername: randomStudent.username, fileUrl: `https://auraedu-storage.s3.amazonaws.com/submissions/${randomStudent.username}_assignment_${savedAssignment.id}.pdf`, marks: 0, feedback: "", submittedAt: formattedDate };
        const savedSubmission = await apiFetch<Submission>('/api/submissions', { method: 'POST', body: mockSubmission });
        setSubmissions(prev => [...prev, savedSubmission]);
      } catch (subErr) {
        console.warn('Mock submission skipped (non-critical):', subErr);
      }
      
      setNewAssignTitle('');
      setNewAssignDeadline('');
      setAssignSuccess('Assignment created successfully! 📝');
      setTimeout(() => setAssignSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to create assignment");
    }
  };

  const handleUpdateSubmissionGrade = async (submissionId: number) => {
    try {
      const updated = await apiFetch<Submission>(`/api/submissions/${submissionId}/grade?marks=${Number(subMarks)}&feedback=${encodeURIComponent(subFeedback)}`, { method: 'PUT' });
      setSubmissions(prev => prev.map(s => s.id === submissionId ? updated : s));
      setGradingSubId(null);
      alert("Submission grade and feedback updated successfully! 🎓");
    } catch (err: any) {
      alert(err.message || "Failed to save submission grade");
    }
  };

  const startGradingSubmission = (sub: Submission) => {
    setGradingSubId(sub.id);
    setSubMarks(sub.marks);
    setSubFeedback(sub.feedback || '');
  };

  if (loading) return <LoadingSpinner message="Loading assignments portal..." />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchData} retryLabel="Retry Load" />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        icon={<BookOpen className="text-primary w-8 h-8" />}
        tag="Instructor Hub"
        title="Assignments & Submissions"
        description="Publish structured course assignments, review student file uploads, and evaluate submissions."
      />

      {/* Header with Create button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Student Submissions</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Review and grade submitted assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedAssignId} onChange={e => setSelectedAssignId(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all">
            {assignments.length === 0 ? (
              <option value={0}>No assignments</option>
            ) : (
              assignments.map(a => (<option key={a.id} value={a.id}>{a.title} ({a.courseName})</option>))
            )}
          </select>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setAssignSuccess('');
              setIsAssignmentModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Active Assignments quick list */}
      {assignments.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-indigo-500" /> Active Assignments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map(assign => (
              <div key={assign.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-md transition-all">
                <div className="min-w-0 pr-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">{assign.courseName}</span>
                  <p className="text-xs font-extrabold text-slate-800 truncate">{assign.title}</p>
                  <p className="text-xs font-bold text-slate-400 mt-0.5">Deadline: {assign.deadline}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg">{assign.maxMarks} Pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submissions section — full width */}
      <div className="bg-card border border-muted-border/80 rounded-[2rem] p-8 shadow-sm space-y-6">
        {submissions.filter(s => s.assignmentId === selectedAssignId).length === 0 ? (
          <div className="py-12 text-center text-text-muted font-semibold text-sm">
            No submissions recorded for this assignment yet.
          </div>
        ) : (
          <div className="border border-muted-border rounded-2xl overflow-hidden shadow-inner max-h-[35rem] overflow-y-auto divide-y divide-muted-border custom-scrollbar">
            {submissions.filter(s => s.assignmentId === selectedAssignId).map(sub => {
              const isGradingThis = gradingSubId === sub.id;
              return (
                <div key={sub.id} className="p-5 bg-card hover:bg-muted/50 transition-colors space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-text-primary text-sm">{sub.studentName} ({sub.studentUsername})</p>
                      <p className="text-text-muted text-xs font-bold uppercase tracking-wider mt-0.5">Submitted: {sub.submittedAt}</p>
                    </div>
                    <div className="text-right">
                      {sub.marks > 0 ? (
                        <span className="inline-block px-2.5 py-1 rounded-full bg-success-light border border-success/20 text-xs font-bold text-success tracking-wider">Graded: {sub.marks} Marks</span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full bg-warning-light border border-warning/20 text-xs font-bold text-warning tracking-wider">Pending Grading</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 bg-muted border border-muted-border p-3 rounded-xl">
                    <BookOpen className="w-5 h-5 text-text-muted" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-text-primary truncate">assignment_file_submission.pdf</p>
                      <a href="#" onClick={(e) => { e.preventDefault(); alert(`Downloading submission from: ${sub.fileUrl}`); }}
                        className="text-xs font-bold text-primary hover:underline mt-0.5 block">Download File Attachment</a>
                    </div>
                  </div>

                  {sub.feedback && !isGradingThis && (
                    <div className="text-xs bg-muted border border-muted-border p-3 rounded-xl text-text-muted font-medium italic">
                      &ldquo;{sub.feedback}&rdquo;
                    </div>
                  )}

                  {isGradingThis ? (
                    <div className="space-y-4 pt-3 border-t border-muted-border animate-in slide-in-from-top-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Enter Marks</label>
                          <input type="number" value={subMarks} onChange={e => setSubMarks(Number(e.target.value))}
                            className="w-full bg-card border border-muted-border rounded-lg px-3 py-2 text-text-primary text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Feedback</label>
                          <input type="text" placeholder="Provide student feedback..." value={subFeedback} onChange={e => setSubFeedback(e.target.value)}
                            className="w-full bg-card border border-muted-border rounded-lg px-3 py-2 text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setGradingSubId(null)}>Cancel</Button>
                        <Button variant="primary" size="sm" onClick={() => handleUpdateSubmissionGrade(sub.id)}>Save Grade</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end pt-1">
                      <Button variant="primary" size="sm" onClick={() => startGradingSubmission(sub)}>Grade / Edit Submission</Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0 text-[#5c4fe5]">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">Create Assignment</h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Publish a new assignment for students</p>
                </div>
              </div>
              <button onClick={() => setIsAssignmentModalOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignSuccess && (
              <div className="mx-6 mt-5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider animate-pulse">
                {assignSuccess}
              </div>
            )}

            <form onSubmit={handleCreateAssignment} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Course</label>
                <select value={newAssignCourse} onChange={e => setNewAssignCourse(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold" required>
                  {courses.map(course => (<option key={course.id} value={course.courseName}>{course.courseName}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assignment Title</label>
                <input type="text" placeholder="e.g. Midterm Lab Report" value={newAssignTitle} onChange={e => setNewAssignTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deadline Date</label>
                  <input type="date" value={newAssignDeadline} onChange={e => setNewAssignDeadline(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Max Marks</label>
                  <input type="number" value={newAssignMaxMarks} onChange={e => setNewAssignMaxMarks(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all" required />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button type="button" onClick={() => setIsAssignmentModalOpen(false)} className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">Cancel</button>
                <Button type="submit" variant="primary" size="lg" className="flex-1">Create Assignment</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}