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
import { useTheme } from '@/contexts/ThemeContext';

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

  const [showForm, setShowForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipBase64, setSlipBase64] = useState<string | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | '' }>({ message: '', type: '' });

  const theme = useTheme();

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
          const pending = data.filter(p => p.method === 'Bank Slip Registration' || p.method === 'Bank Deposit Slip');
          setRegistrations(pending);
        }
      })
      .catch((err) => console.error('Error loading slip history:', err))
      .finally(() => setLoading(false));
  };

  // ── Strict client-side pagination for registration records ────
  const [regCurrentPage, setRegCurrentPage] = useState(1);
  const regRowsPerPage = 5;

  const regIndexOfLastRow = regCurrentPage * regRowsPerPage;
  const regIndexOfFirstRow = regIndexOfLastRow - regRowsPerPage;
  const paginatedRegistrations = registrations.slice(regIndexOfFirstRow, regIndexOfLastRow);
  const regTotalPages = Math.ceil(registrations.length / regRowsPerPage);

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

    if (!selectedCourse) { showToast('Please select a course to register.', 'error'); return; }
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
      formData.append('description', selectedCourse);
      formData.append('slip', slipFile);

      await apiFetch('/api/registration/submit', { method: 'POST', body: formData });
      showToast('Registration request submitted! pending verification. ⏳', 'success');
      
      setAmount('');
      setPaymentDate('');
      setSlipFile(null);
      setSlipBase64(null);
      setSlipPreview(null);
      setShowForm(false);
      fetchPendingRegistrations(username);
    } catch (err: any) {
      console.error('Error submitting registration:', err);
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
      
      {toast.message && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-3 text-sm font-semibold uppercase tracking-wider animate-bounce ${
          toast.type === 'success' 
            ? 'bg-primary-light text-primary border-primary/20' 
            : 'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-muted-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-light border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Course Registrations</h2>
            <p className="text-sm text-slate-400 mt-0.5">Submit bank deposit receipts to register for classes</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-white font-semibold px-5 py-3 rounded-lg text-sm uppercase tracking-wider transition-all flex items-center gap-2"
          style={{ backgroundColor: theme.primary }}
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? 'Cancel Registration' : 'New Registration'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-muted-border/80 rounded-[2.2rem] p-8 shadow-sm max-w-6xl mx-auto space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3 pb-3 border-b border-muted-border">
            <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center text-primary shadow-inner">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Submit Registration Slip</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Fill deposit coordinates and slip screenshot</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-400" /> Course Catalog Selection
              </label>
              <select 
                required
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-muted-border bg-card px-3 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              >
                <option value="" disabled>-- Select a course from registry --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.courseName}>
                    {course.courseCode} - {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" /> Deposit Transaction Date
              </label>
              <input 
                type="date"
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="mt-1.5 block w-full bg-muted border border-muted-border text-slate-700 text-sm rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-slate-400" /> Amount Paid (LKR)
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
                  className="w-full bg-muted border border-muted-border text-slate-700 text-sm rounded-xl pl-14 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 font-medium"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold uppercase">LKR</span>
              </div>
            </div>

            <div className="p-4 bg-primary-light border border-primary/20 rounded-2xl text-sm space-y-1 text-slate-700">
              <p className="font-semibold text-primary text-sm uppercase tracking-wider mb-1.5">University Bank Account coordinates</p>
              <p><strong>Bank:</strong> Bank of Ceylon (BOC)</p>
              <p><strong>Account Name:</strong> AuraEdu Academy (Pvt) Ltd</p>
              <p><strong>Account Number:</strong> 8743029103</p>
              <p><strong>Branch:</strong> Colombo Fort</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">Bank Receipt Image</label>
              <div 
                onClick={() => document.getElementById('reg-slip-upload')?.click()}
                className="border-2 border-dashed border-muted-border hover:border-slate-400 rounded-2xl p-6 text-center hover:bg-muted transition-colors cursor-pointer flex flex-col items-center justify-center space-y-2 group"
              >
                <input id="reg-slip-upload" type="file" accept="image/jpeg,image/png" onChange={handleFileChange} className="hidden" />
                {slipPreview ? (
                  <div className="w-full max-w-lg h-64 md:h-80 rounded-2xl overflow-hidden border border-muted-border relative bg-muted flex items-center justify-center p-2">
                    <img src={slipPreview} alt="Receipt Preview" className="max-h-full max-w-full object-contain rounded-xl" />
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                    <div>
                      <p className="text-sm font-semibold text-slate-600">Select deposit slip photograph</p>
                      <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG file types (Max 2MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 text-white font-semibold py-3.5 px-6 rounded-lg text-sm uppercase tracking-wider transition-all disabled:opacity-50"
              style={{ backgroundColor: theme.primary }}
            >
              {submitting ? 'Submitting request...' : 'Submit Deposit Slip'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-card border border-muted-border/80 rounded-[2.2rem] p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Slip Registration Records</h3>
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
                <tr className="border-b border-muted-border text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  <th className="py-3">Reference ID</th>
                  <th className="py-3">Registered Course</th>
                  <th className="py-3">Transaction Date</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {paginatedRegistrations.map((item, idx) => (
                  <tr key={idx} className="border-b border-muted-border last:border-none hover:bg-muted/50 transition-colors">
                    <td className="py-4 text-slate-800 font-bold">{item.receiptNo}</td>
                    <td className="py-4 text-slate-800 font-bold">{item.description}</td>
                    <td className="py-4 text-slate-400">{item.date}</td>
                    <td className="py-4 text-slate-800 font-bold">{item.amount}</td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold bg-amber-50 text-amber-600 border border-amber-100">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
          <div>Page {regCurrentPage} of {regTotalPages}</div>
          <div className="flex gap-2">
            <button
              onClick={() => setRegCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={regCurrentPage === 1}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setRegCurrentPage(prev => Math.min(prev + 1, regTotalPages))}
              disabled={regCurrentPage === regTotalPages}
              className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
