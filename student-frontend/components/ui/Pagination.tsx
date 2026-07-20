'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  /** 1-based current page */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Number of items per page */
  pageSize: number;
  /** Zero-based index of first item on current page */
  startIndex: number;
  /** One-based index of last item on current page */
  endIndex: number;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Called with 1-based page number */
  onPageChange: (page: number) => void;
  /** Called with the new page size */
  onPageSizeChange?: (size: number) => void;
  /** Available page-size options (default [5, 10, 20, 50]) */
  pageSizeOptions?: number[];
}

/**
 * A reusable pagination bar that works both for client-side
 * (usePagination hook) and server-side pagination.
 *
 * Renders "Previous / Next" buttons, page-number pills, and an optional
 * rows-per-page selector.
 */
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  startIndex,
  endIndex,
  hasPrevious,
  hasNext,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) {
  if (totalPages <= 1 && totalItems <= pageSize) {
    // No need for pagination controls when everything fits on one page
    return null;
  }

  /**
   * Build an array of page numbers (and optionally ellipsis markers)
   * to display.  Always show first, last, and pages around current.
   */
  const getPageNumbers = (): (number | 'ellipsis-start' | 'ellipsis-end')[] => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    const siblingCount = 1; // pages to show on each side of current

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Always first page
    pages.push(1);

    const leftSibling = Math.max(2, currentPage - siblingCount);
    const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount);

    if (leftSibling > 2) pages.push('ellipsis-start');
    else if (leftSibling === 2) pages.push(2);

    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }

    if (rightSibling < totalPages - 1) pages.push('ellipsis-end');
    else if (rightSibling === totalPages - 1) pages.push(totalPages - 1);

    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl px-6 py-4 mt-6 shadow-sm">
      {/* Left: Row info & page-size selector */}
      <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <span>
          {startIndex + 1}–{endIndex} of {totalItems}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span>Rows</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all cursor-pointer"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Page navigation */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Prev
        </button>

        {/* Page number pills */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((item, idx) => {
            if (item === 'ellipsis-start' || item === 'ellipsis-end') {
              return (
                <span
                  key={item}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold"
                >
                  …
                </span>
              );
            }

            const isActive = item === currentPage;
            return (
              <button
                key={`page-${item}-${idx}`}
                type="button"
                onClick={() => onPageChange(item as number)}
                className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}