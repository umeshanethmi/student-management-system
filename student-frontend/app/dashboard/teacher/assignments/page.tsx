'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  AlertCircle,
  Loader2,
  Calendar,
  ClipboardList
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

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

  // Assignments & Submissions states
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Form states to create assignment
  const [newAssignCourse, setNewAssignCourse] = useState('');
  const [newAssignTitle, setNewAssignTitle] = useState('');
  const [newAssignDeadline, setNewAssignDeadline] = useState('');
  const [newAssignMaxMarks, setNewAssignMaxMarks] = useState(100);
  const [assignSuccess, setAssignSuccess] = useState('');

  // Selected assignment to view submissions
  const [selectedAssignId, setSelectedAssignId] = useState<number>(0);

  // States to grade a specific submission
  const [gradingSubId, setGradingSubId] = useState<number | null>(null);
  const [subMarks, setSubMarks] = useState(0);
  const [subFeedback, setSubFeedback] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
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

      if (coursesData && coursesData.length > 0) {
        setNewAssignCourse(coursesData[0].courseName);
      }

      if (assignmentsData && assignmentsData.length > 0) {
        setSelectedAssignId(assignmentsData[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching assignments details:', err);
      setError(err.message || 'Failed to retrieve registry records.');
    } finally {
      setLoading(false);
    }
  };

  // Filter out Administrators and Teachers from the student list
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
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Create a new assignment
  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignCourse || !newAssignTitle || !newAssignDeadline) {
      alert("Please fill out all fields.");
      return;
    }

    const formattedDate = formatBackendDate(newAssignDeadline);

    const newAssignment = {
      courseName: newAssignCourse,
      title: newAssignTitle,
      deadline: formattedDate,
      maxMarks: Number(newAssignMaxMarks) || 100
    };

    try {
      const savedAssignment = await apiFetch<Assignment>('/api/assignments', {
        method: 'POST',
        body: newAssignment
      });

      // Update state
      setAssignments(prev => [...prev, savedAssignment]);
      if (selectedAssignId === 0) {
        setSelectedAssignId(savedAssignment.id);
      }

      // Auto-seed a mock pending student submission for the newly created assignment
      const randomStudent = filteredStudents.length > 0 ? filteredStudents[0] : { name: "Nethmi", username: "nethmi" };
      const mockSubmission = {
        assignmentId: savedAssignment.id,
        studentName: randomStudent.name,
        studentUsername: randomStudent.username,
        fileUrl: `https://auraedu-storage.s3.amazonaws.com/submissions/${randomStudent.username}_assignment_${savedAssignment.id}.pdf`,
        marks: 0,
        feedback: "",
        submittedAt: formattedDate
      };

      const savedSubmission = await apiFetch<Submission>('/api/submissions', {
        method: 'POST',
        body: mockSubmission
      });

      setSubmissions(prev => [...prev, savedSubmission]);

      setNewAssignTitle('');
      setNewAssignDeadline('');
      setAssignSuccess('Assignment created successfully! 📝');
      setTimeout(() => setAssignSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || "Failed to create assignment");
    }
  };

  // Grade/update student submission marks
  const handleUpdateSubmissionGrade = async (submissionId: number) => {
    try {
      const updated = await apiFetch<Submission>(`/api/submissions/${submissionId}/grade?marks=${Number(subMarks)}&feedback=${encodeURIComponent(subFeedback)}`, {
        method: 'PUT'
      });

      setSubmissions(prev => prev.map(s => s.id === submissionId ? updated : s));
      setGradingSubId(null);
      alert("Submission grade and feedback updated successfully! 🎓");
    } catch (err: any) {
      alert(err.message || "Failed to save submission grade");
    }
  };

  // Pre-fill grading inputs when editing submission
  const startGradingSubmission = (sub: Submission) => {
    setGradingSubId(sub.id);
    setSubMarks(sub.marks);
    setSubFeedback(sub.feedback || '');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-650 animate-spin" />
        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Loading assignments portal...</p>
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
      
      {/* Welcome / Header */}
      <div className="p-8 rounded-[2rem] bg-gradient-to-r from-[#0d1538] via-[#090e24] to-[#0c1c4d] border border-[#1e2756]/40 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-indigo-505/10 to-transparent pointer-events-none" />
        <div className="flex items-start gap-5 relative z-10">
          <div className="w-14 h-14 bg-[#141b3e] border border-[#232f65] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/15">
            <BookOpen className="text-indigo-400 w-8 h-8" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-[#1b2554]/40 border border-[#2d3a77]/50 text-[10px] font-bold text-indigo-400 tracking-wider mb-2.5 uppercase">
              Instructor Hub
            </span>
            <h1 className="text-3xl font-black text-white leading-tight">
              Assignments &amp; Submissions
            </h1>
            <p className="text-slate-455 text-sm mt-1 max-w-2xl">
              Publish structured course assignments, review student file uploads, and evaluate submissions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Create Assignment), Right Column (View Submissions) */}
      <div id="assignments-portal" className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Create Assignment Card (2/5 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <ClipboardList className="w-5 h-5 text-indigo-650" />
              <h2 className="text-xl font-bold text-slate-800">Create Assignment</h2>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Course</label>
                <select 
                  value={newAssignCourse} 
                  onChange={e => setNewAssignCourse(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.courseName}>{course.courseName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assignment Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Midterm Lab Report"
                  value={newAssignTitle}
                  onChange={e => setNewAssignTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Deadline Date</label>
                  <input 
                    type="date" 
                    value={newAssignDeadline}
                    onChange={e => setNewAssignDeadline(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Max Marks</label>
                  <input 
                    type="number" 
                    value={newAssignMaxMarks}
                    onChange={e => setNewAssignMaxMarks(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                    required
                  />
                </div>
              </div>

              {assignSuccess && (
                <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider animate-pulse">
                  {assignSuccess}
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-blue-100 uppercase text-xs tracking-wider"
              >
                Create Assignment
              </button>
            </form>

            {/* Active Assignments List */}
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Active Assignments</h3>
              {assignments.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium">No assignments published yet.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                  {assignments.map(assign => (
                    <div key={assign.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between hover:bg-white hover:shadow-md transition-all">
                      <div className="min-w-0 pr-2">
                        <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-[9px] font-black text-indigo-600 uppercase tracking-wider mb-1">
                          {assign.courseName}
                        </span>
                        <p className="text-xs font-extrabold text-slate-800 truncate">{assign.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">Deadline: {assign.deadline}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-black text-slate-700 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                          {assign.maxMarks} Pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* View Submissions Card (3/5 width) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-6 w-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-650" />
                <h2 className="text-xl font-bold text-slate-800">Student Submissions</h2>
              </div>
              
              {/* Filter submissions by assignment */}
              <select 
                value={selectedAssignId}
                onChange={e => setSelectedAssignId(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
              >
                {assignments.map(a => (
                  <option key={a.id} value={a.id}>{a.title} ({a.courseName})</option>
                ))}
              </select>
            </div>

            {/* Submissions table/rows */}
            <div className="space-y-4">
              {submissions.filter(s => s.assignmentId === selectedAssignId).length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-semibold text-sm">
                  No submissions recorded for this assignment yet.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-inner max-h-[30rem] overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                  {submissions.filter(s => s.assignmentId === selectedAssignId).map(sub => {
                    const isGradingThis = gradingSubId === sub.id;
                    return (
                      <div key={sub.id} className="p-5 bg-white hover:bg-slate-50/50 transition-colors space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{sub.studentName} ({sub.studentUsername})</p>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Submitted: {sub.submittedAt}</p>
                          </div>
                          
                          <div className="text-right">
                            {sub.marks > 0 ? (
                              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 tracking-wider">
                                Graded: {sub.marks} Marks
                              </span>
                            ) : (
                              <span className="inline-block px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-black text-amber-600 tracking-wider">
                                Pending Grading
                              </span>
                            )}
                          </div>
                        </div>

                        {/* File preview representations */}
                        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-150 p-3 rounded-xl">
                          <BookOpen className="w-5 h-5 text-slate-400" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-700 truncate">assignment_file_submission.pdf</p>
                            <a 
                              href="#" 
                              onClick={(e) => { e.preventDefault(); alert(`Downloading submission from: ${sub.fileUrl}`); }}
                              className="text-[10px] font-bold text-indigo-650 hover:underline mt-0.5 block"
                            >
                              Download File Attachment
                            </a>
                          </div>
                        </div>

                        {/* Feedback preview */}
                        {sub.feedback && !isGradingThis && (
                          <div className="text-xs bg-slate-50 border border-slate-100 p-3 rounded-xl text-slate-500 font-medium italic">
                            &ldquo;{sub.feedback}&rdquo;
                          </div>
                        )}

                        {/* Edit grades toggle block */}
                        {isGradingThis ? (
                          <div className="space-y-4 pt-3 border-t border-slate-100 animate-in slide-in-from-top-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="sm:col-span-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Enter Marks</label>
                                <input 
                                  type="number" 
                                  value={subMarks}
                                  onChange={e => setSubMarks(Number(e.target.value))}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                                  required
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Feedback/Comments</label>
                                <input 
                                  type="text" 
                                  placeholder="Provide student feedback..."
                                  value={subFeedback}
                                  onChange={e => setSubFeedback(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 justify-end">
                              <button 
                                type="button"
                                onClick={() => setGradingSubId(null)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all"
                              >
                                Cancel
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleUpdateSubmissionGrade(sub.id)}
                                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-emerald-100"
                              >
                                Save Grade
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => startGradingSubmission(sub)}
                              className="text-xs font-bold text-indigo-650 hover:text-indigo-700 flex items-center gap-1"
                            >
                              Grade / Edit Submission
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
