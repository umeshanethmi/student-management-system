'use client';

import { useEffect, useState } from 'react';

// Define the Student interface matching the Spring Boot backend entity exactly
interface Student {
  id: number;
  name: string;
  email: string;
  age: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  
  // Form state for new student details
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputAge, setInputAge] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // Added error state

  // Fetch all students from the backend API
  async function fetchStudents() {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data || []);
      } else {
        console.error('Failed to fetch students:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  }

  // Fetch students initially when component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form submission to add a new student
  async function addStudent(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    
    if (!inputName.trim() || !inputEmail.trim() || !inputAge.trim()) {
      setErrorMessage('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // These JSON properties exactly match the backend Student.java variables: name, email, age
        body: JSON.stringify({ 
          name: inputName.trim(), 
          email: inputEmail.trim(), 
          age: parseInt(inputAge, 10) 
        }),
      });

      if (response.ok) {
        // Clear input fields
        setInputName('');
        setInputEmail('');
        setInputAge('');
        
        // Dynamically refresh the student list
        fetchStudents();
        
        // Show success message
        setSuccessMessage('Student added successfully! 🎉');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        // Handle server-side errors
        setErrorMessage(`Failed to add student. Server responded with status: ${response.status}`);
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error('Error adding student:', error);
      setErrorMessage('A network error occurred while adding the student.');
    }
  }

  // Handle deleting a student
  async function deleteStudent(id: number) {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    
    setErrorMessage('');
    
    try {
      const response = await fetch(`http://localhost:8080/api/students/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Dynamically refresh the student list table
        fetchStudents();
        
        // Show success message
        setSuccessMessage('Student deleted successfully! 🗑️');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage(`Failed to delete student. Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting student:', error);
      setErrorMessage('A network error occurred while deleting the student.');
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left side: Add New Student Form */}
      <div className="w-full lg:w-1/3 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 h-fit">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">🧑‍🎓 Add New Student</h2>
          <p className="text-sm text-slate-400 mt-1">Enter student details to add to the system.</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-emerald-900/40 text-emerald-400 border border-emerald-800 rounded-xl px-4 py-3 text-sm font-medium transition-all">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-900/40 text-red-400 border border-red-800 rounded-xl px-4 py-3 text-sm font-medium transition-all">
            {errorMessage}
          </div>
        )}

        <form onSubmit={addStudent} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
            <input
              type="number"
              placeholder="20"
              value={inputAge}
              onChange={(e) => setInputAge(e.target.value)}
              min="1"
              max="120"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl px-6 py-3 transition-all">
            Add Student
          </button>
        </form>
      </div>

      {/* Right side: Student List Table */}
      <div className="w-full lg:w-2/3 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">📋 Student List</h2>
          <p className="text-sm text-slate-400 mt-1">View and manage all registered students.</p>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-10 text-slate-400">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="text-center py-10 bg-slate-700/30 rounded-xl border border-dashed border-slate-600 text-slate-400">
              No students found.
            </div>
          ) : (
            <div className="bg-slate-700/40 rounded-xl border border-slate-700 overflow-x-auto">
              {/* Clean, modern dark-mode table */}
              <table className="w-full text-left border-collapse min-w-max">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="py-4 px-5 text-sm font-semibold text-slate-300">ID</th>
                    <th className="py-4 px-5 text-sm font-semibold text-slate-300">Name</th>
                    <th className="py-4 px-5 text-sm font-semibold text-slate-300">Email</th>
                    <th className="py-4 px-5 text-sm font-semibold text-slate-300">Age</th>
                    <th className="py-4 px-5 text-sm font-semibold text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-slate-700 last:border-none hover:bg-slate-700/50 transition-colors">
                      <td className="py-3 px-5 text-sm text-slate-400 font-mono">#{student.id}</td>
                      <td className="py-3 px-5 text-sm font-medium text-slate-200">{student.name}</td>
                      <td className="py-3 px-5 text-sm text-slate-400">{student.email}</td>
                      <td className="py-3 px-5 text-sm text-slate-400">{student.age}</td>
                      <td className="py-3 px-5 text-sm text-slate-400">
                        <button 
                          onClick={() => deleteStudent(student.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-2 rounded-lg transition-colors flex items-center justify-center"
                          title="Delete Student"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
  );
}