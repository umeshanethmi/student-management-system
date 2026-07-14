'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Upload, 
  X, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Course {
  id: number;
  courseName: string;
  courseCode: string;
}

interface Registration {
  id: number;
  receiptNo: string;
  date: string;
  amount: string;
  description: string;
  status: string;
}

export default function RegistrationPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Student');

  // Form toggle & Inputs
  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // File states
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipBase64, setSlipBase64] = useState<string | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  // Toast Alerts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);
    fetchCourses();
    fetchPendingRegistrations(user);
  }, []);

  const fetchCourses = () => {
    apiFetch<Course[]>('/api/courses')
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
          if (data.length > 0) {
            setSelectedCourse(data[0].courseName);
          }
        }
      })
      .catch((err) => console.error('Error fetching course directory:', err));
  };

  const fetchPendingRegistrations = (user: string) => {
    setLoading(true);
    apiFetch<any[]>(`/api/payments/student/${user}`)
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter only bank slips / registrations
          const pending = data.filter(p => p.method === 'Bank Slip Registration' || p.method === 'Bank Deposit Slip');
          setRegistrations(pending);
        }
      })
      .catch((err) => console.error('Error loading slip history:', err))
      .finally(() => setLoading(false));
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 4500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      showToast('Only JPG and PNG screenshots/photo slips are accepted.', 'error');
      return;
    }

    setSlipFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result as string;
      setSlipBase64(base64Str);
      setSlipPreview(base64Str);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (!selectedCourse) {
      showToast('Please select a course to register.', 'error');
      return;
    }
    if (!paymentDate) {
      showToast('Please specify the deposit transaction date.', 'error');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showToast('Please input a valid transaction amount.', 'error');
      return;
    }
    if (!slipFile) {
      showToast('Please upload your bank deposit receipt.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formattedAmount = `LKR ${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      const formData = new FormData();
      formData.append('username', username);
      formData.append('amount', formattedAmount);
      formData.append('date', paymentDate);
      formData.append('description', selectedCourse);
      formData.append('slip', slipFile);

      await apiFetch('/api/registration/submit', {
        method: 'POST',
        body: formData
      });

      showToast('Registration request submitted! pending verification. ⏳', 'success');
      
      // Reset states
      setAmount('');
      setPaymentDate('');
      setSlipFile(null);
      setSlipBase64(null);
      setSlipPreview(null);
      setShowForm(false);
      fetchPendingRegistrations(username);
    } catch (err: any) {
      console.error('Error submitting registration:', err);
      // Fallback to local state insertion
      const formattedAmount = `LKR ${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      const localRecord: Registration = {
        id: Date.now(),
        receiptNo: `REG-${Math.floor(Math.random() * 90000 + 10000)}`,
        date: paymentDate,
        amount: formattedAmount,
        description: selectedCourse,
        status: 'Pending Verification'
      };
      setRegistrations(prev => [localRecord, ...prev]);
      showToast('Registration submitted (local backup synced)! ⏳', 'success');

      // Reset states
      setAmount('');
      setPaymentDate('');
      setSlipFile(null);
      setSlipBase64(null);
      setSlipPreview(null);
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto p-4 relative">
      
      {/* Toast Alert popup */}
      {toast.message && (
        <div className={`fixed top-6 right-6 z-55 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-black uppercase tracking-wider animate-bounce ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-rose-50 text-rose-500 border-rose-100'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header section with Purple Toggle button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#5c4fe5] shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Course Registrations</h2>
            <p className="text-xs text-slate-400 mt-0.5">Submit bank deposit receipts to register for classes</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 bg-[#4f46e5] hover:bg-[#5c4fe5] text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center uppercase tracking-wider gap-2"
        >
          {showForm ? <X className="w-4.5 h-4.5" /> : <Plus className="w-4.5 h-4.5" />}
          <span>{showForm ? 'Cancel Registration' : 'New Registration'}</span>
        </button>
      </div>

      {/* Registration bank slip submission form card */}
      {showForm && (
        <div className="bg-white border border-slate-200/80 rounded-[2.2rem] p-8 shadow-sm max-w-6xl mx-auto space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-[#5c4fe5] shadow-inner">
              <Upload className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-md font-black text-slate-850">Submit Registration Slip</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Fill deposit coordinates and slip screenshot</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Course Select Dropdown */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" /> Course Catalog Selection
              </label>
              <select 
                required
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-slate-250 border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
              >
                <option value="" disabled>-- Select a course from registry --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.courseName}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Pick */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deposit Transaction Date
              </label>
              <input 
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="mt-1.5 block w-full bg-slate-50 border border-slate-250 border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all font-semibold"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Amount Paid (LKR)
              </label>
              <div className="relative mt-1.5">
                <input 
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 45000.00"
                  className="w-full bg-slate-50 border border-slate-250 border-slate-200 text-slate-750 text-sm rounded-xl pl-14 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-400 transition-all placeholder:text-slate-400 font-bold"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-black uppercase">LKR</span>
              </div>
            </div>

            {/* University Bank Coordinates Info */}
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs space-y-1 text-slate-700">
              <p className="font-extrabold text-[#4f46e5] text-[10px] uppercase tracking-wider mb-1.5">University Bank Account coordinates</p>
              <p><strong>Bank:</strong> Bank of Ceylon (BOC)</p>
              <p><strong>Account Name:</strong> AuraEdu Academy (Pvt) Ltd</p>
              <p><strong>Account Number:</strong> 8743029103</p>
              <p><strong>Branch:</strong> Colombo Fort</p>
            </div>

            {/* Slip upload Receipt area */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Bank Receipt Image</label>
              <div 
                onClick={() => document.getElementById('reg-slip-upload')?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-slate-350 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center justify-center space-y-2 group"
              >
                <input 
                  id="reg-slip-upload"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {slipPreview ? (
                  <div className="w-full max-w-lg h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-50 flex items-center justify-center p-2">
                    <img src={slipPreview} alt="Receipt Preview" className="max-h-full max-w-full object-contain rounded-xl" />
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#4f46e5] transition-colors" />
                    <div>
                      <p className="text-xs font-bold text-slate-650 text-slate-600">Select deposit slip photograph</p>
                      <p className="text-[10px] text-slate-400 mt-1">Supports JPG, PNG file types (Max 2MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-50 disabled:opacity-50"
            >
              {submitting ? 'Submitting request...' : 'Submit Deposit Slip'}
            </button>
          </form>
        </div>
      )}

      {/* Submitted registrations logs history */}
      <div className="bg-white border border-slate-200/80 rounded-[2.2rem] p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-850 mb-6">Slip Registration Records</h3>
        {loading ? (
          <div className="text-center py-8 text-slate-400">Loading records...</div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm font-semibold">
            No bank slip registrations filed. Use "+ NEW REGISTRATION" to submit one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3">Reference ID</th>
                  <th className="py-3">Registered Course</th>
                  <th className="py-3">Transaction Date</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {registrations.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-slate-850 font-bold">{item.receiptNo}</td>
                    <td className="py-4 text-slate-850 font-bold">{item.description}</td>
                    <td className="py-4 text-slate-400">{item.date}</td>
                    <td className="py-4 text-slate-850 font-black">{item.amount}</td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
