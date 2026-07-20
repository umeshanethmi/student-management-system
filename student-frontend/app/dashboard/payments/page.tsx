'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Download } from 'lucide-react';
import { apiFetch } from '@/app/utils/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable, { Column } from '@/components/ui/DataTable';

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

  // ── Strict client-side pagination ─────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const user = localStorage.getItem('username') || 'Student';
    setUsername(user);

    setLoading(true);
    apiFetch<Payment[]>(`/api/payments/student/${user}`)
      .then((data) => {
        if (Array.isArray(data)) {
          setPayments(data);
        }
      })
      .catch((err) => console.error('Error loading billing ledger:', err))
      .finally(() => setLoading(false));
  }, []);

  // ── Slicing logic ──────────────────────────────────────────────
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = payments.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(payments.length / rowsPerPage);

  const columns: Column<Payment>[] = [
    { key: 'receiptNo', label: 'Receipt No.', render: (val) => <span className="text-slate-850 font-bold">{String(val)}</span> },
    { key: 'description', label: 'Course / Description', render: (val) => <span className="text-slate-850 font-bold">{String(val)}</span> },
    { key: 'date', label: 'Date', render: (val) => <span className="text-slate-400">{String(val)}</span> },
    { key: 'amount', label: 'Amount (LKR)', render: (val) => <span className="text-slate-850 font-black">{String(val)}</span> },
    { key: 'method', label: 'Payment Method', render: (val) => <span className="text-slate-500 truncate max-w-[200px] block" title={String(val)}>{String(val)}</span> },
    { key: 'status', label: 'Status', align: 'center', render: (val) => <StatusBadge status={String(val) === 'Paid' ? 'Paid' : 'Pending'} /> },
    { key: 'receiptNo', label: 'Invoice', align: 'right', render: () => <button className="text-[#5c4fe5] hover:text-indigo-800 font-bold text-xs flex items-center justify-end uppercase tracking-wider transition-colors ml-auto gap-1"><Download className="w-4 h-4 shrink-0" /> INVOICE</button> },
  ];

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
        <div className="text-[10px] font-black bg-[#04241d] text-white px-4.5 py-2 rounded-full border border-slate-950 uppercase tracking-widest shrink-0 shadow-sm">
          {payments.length} Payments Mapped
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading billing ledger..." />
      ) : payments.length === 0 ? (
        <div className="text-center py-24 bg-white border border-slate-200 rounded-[2rem] shadow-sm text-slate-400 font-bold text-xs uppercase tracking-wider">
          No transactions registered for your account.
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-[2rem] p-8 shadow-sm">
          <DataTable columns={columns} rows={currentRows} emptyMessage="No transactions registered for your account." />

          <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-600">
            <div>Page {currentPage} of {totalPages}</div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}