'use client';

import { useEffect, useState } from 'react';

interface Course {
  id?: number;
  courseName: string; // Matches Spring Boot entity variable
  courseCode: string; // Matches Spring Boot entity variable
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Method to fetch all available courses from the backend
  const fetchCourses = () => {
    fetch('http://localhost:8080/api/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        }
      })
      .catch((err) => console.error('Error fetching courses:', err));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 2. Method to handle the submission of a new course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName || !newCourseCode) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Sending exactly what the backend expects
        body: JSON.stringify({ courseName: newCourseName, courseCode: newCourseCode }),
      });

      if (response.ok) {
        setMessage('Course added successfully! 🎉');
        setNewCourseName('');
        setNewCourseCode('');
        fetchCourses(); // Dynamic list refresh
      } else {
        setMessage('Failed to add course.');
      }
    } catch (err) {
      setMessage('Error connecting to the backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title Header */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
        <h2 className="text-2xl font-bold text-white">📚 Course Management</h2>
        <p className="text-sm text-slate-400 mt-1">Manage and view institutional courses dynamically</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form to Add a New Course */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl h-fit">
          <h3 className="text-lg font-semibold text-white mb-4">✨ Add New Course</h3>
          <form onSubmit={handleAddCourse} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-300">Course Name</label>
              <input
                type="text"
                required
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="e.g. Software Engineering"
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-300">Course Code</label>
              <input
                type="text"
                required
                value={newCourseCode}
                onChange={(e) => setNewCourseCode(e.target.value)}
                placeholder="e.g. SE-3010"
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors disabled:bg-teal-800"
            >
              {loading ? 'Adding...' : 'Add Course'}
            </button>
            {message && <p className="text-xs text-center text-teal-400 mt-2">{message}</p>}
          </form>
        </div>

        {/* Dynamic Course List Display */}
        <div className="md:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4">📜 Available Courses</h3>
          
          {courses.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No courses available. Add one to start!</p>
          ) : (
            <div className="bg-slate-700/40 rounded-xl border border-slate-700 overflow-hidden">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between px-5 py-4 border-b border-slate-700 last:border-none text-slate-200"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{course.courseName}</span>
                    <span className="text-xs text-slate-400 mt-0.5">Code: {course.courseCode}</span>
                  </div>
                  <span className="text-xs bg-teal-500/10 text-teal-400 px-2.5 py-1 rounded-full font-medium border border-teal-500/20">
                    Active
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}