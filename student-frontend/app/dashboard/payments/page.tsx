'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Download, 
  AlertCircle 
} from 'lucide-react';
import { apiFetch } from '@/app/utils/api';

interface Payment {
  id: number;
  receiptNo: string;
  date: string;
  amount: string;
  method: string;
  status: string;
  description: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('Student');

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);
    fetchPayments(user);
  }, []);

  const fetchPayments = (user: string) => {
    setLoading(true);
    apiFetch<Payment[]>(`/api/payments/student/${user}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setPayments(data);
        }
      })
      .catch((err) => console.error('Error loading billing ledger:', err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-7xl mx-auto p-4 relative">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-[#5c4fe5] shadow-sm">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Transaction History</h2>
            <p className="text-xs text-slate-400 mt-0.5">Track all registration and tuition settlements</p>
          </div>
        </div>
        <div className="text-[10px] font-black bg-[#0b0e1e] text-white px-4.5 py-2 rounded-full border border-slate-950 uppercase tracking-widest shrink-0 shadow-sm">
          {payments.length} Payments Mapped
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24 text-slate-400 font-semibold animate-pulse">Loading billing ledger...</div>
      ) : payments.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-[2rem] shadow-sm text-slate-400 font-bold text-xs uppercase tracking-wider">
          No transactions registered for your account.
        </div>
      ) : (
        /* Wide data table stretching across max-w-7xl */
        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 pb-4">Receipt No.</th>
                  <th className="py-3 pb-4">Course / Description</th>
                  <th className="py-3 pb-4">Date</th>
                  <th className="py-3 pb-4 font-bold text-slate-805 text-slate-800">Amount (LKR)</th>
                  <th className="py-3 pb-4">Payment Method</th>
                  <th className="py-3 pb-4 text-center">Status</th>
                  <th className="py-3 pb-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {payments.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 text-slate-850 font-bold">{item.receiptNo}</td>
                    <td className="py-4 text-slate-850 font-bold">{item.description}</td>
                    <td className="py-4 text-slate-400">{item.date}</td>
                    <td className="py-4 text-slate-850 font-black">{item.amount}</td>
                    <td className="py-4 text-slate-500 truncate max-w-[200px]" title={item.method}>{item.method}</td>
                    <td className="py-4 text-center">
                      {item.status === 'Paid' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                          Pending Verification
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-[#5c4fe5] hover:text-indigo-800 font-bold text-xs flex items-center justify-end uppercase tracking-wider transition-colors ml-auto gap-1">
                        <Download className="w-4 h-4 shrink-0" /> INVOICE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
