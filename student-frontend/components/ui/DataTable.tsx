'use client';

import React from 'react';

export interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps {
  columns: Column<any>[];
  rows: any[];
  emptyMessage?: string;
  keyField?: string;
}

export default function DataTable({
  columns,
  rows,
  emptyMessage = 'No records found.',
  keyField = 'id',
}: DataTableProps) {
  if (rows.length === 0) {
    return (
      <div className="py-12 text-center text-slate-400 font-semibold text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
      <table className="w-full text-left border-collapse min-w-max">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 text-xs font-bold uppercase tracking-wider">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-4 px-6 ${
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm font-semibold text-slate-700">
          {rows.map((row, rowIndex) => (
            <tr
              key={String(row[keyField] ?? rowIndex)}
              className="border-b border-slate-100 last:border-none hover:bg-slate-50/40 transition-colors"
            >
              {columns.map((col) => {
                const cellValue = row[col.key];
                return (
                  <td
                    key={`${String(row[keyField] ?? rowIndex)}-${col.key}`}
                    className={`py-3.5 px-6 ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {col.render ? col.render(cellValue, row, rowIndex) : String(cellValue ?? '')}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}