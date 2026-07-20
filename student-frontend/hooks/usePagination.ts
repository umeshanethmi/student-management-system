'use client';

import { useMemo, useState } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}

export interface PaginationResult<T> {
  /** The sliced data for the current page */
  paginatedData: T[];
  /** Current page number (1-based) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items across all pages */
  totalItems: number;
  /** Current pagination state */
  pagination: PaginationState;
  /** Total number of pages */
  totalPages: number;
  /** Zero-based start index of the current page */
  startIndex: number;
  /** One-based end index of the current page */
  endIndex: number;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrevious: boolean;
  /** Navigate to a specific page (1-based) */
  goToPage: (page: number) => void;
  /** Navigate to the next page */
  goToNext: () => void;
  /** Navigate to the previous page */
  goToPrevious: () => void;
  /** Change the page size (resets to page 1) */
  setPageSize: (size: number) => void;
}

/**
 * Custom hook for client-side pagination.
 * Slices the full dataset locally — ideal when the entire result set
 * has already been fetched and you want instant page transitions.
 *
 * @param data      The full array of items
 * @param defaultPageSize  Number of rows per page (default: 10)
 * @param initialPage      Starting page (1-based, default: 1)
 */
export function usePagination<T>(
  data: T[],
  defaultPageSize: number = 10,
  initialPage: number = 1
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp current page when total pages shrink (e.g. after filtering)
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const paginatedData = useMemo(
    () => data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clamped);
  };

  const goToNext = () => {
    if (safePage < totalPages) setCurrentPage(safePage + 1);
  };

  const goToPrevious = () => {
    if (safePage > 1) setCurrentPage(safePage - 1);
  };

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  };

  return {
    paginatedData,
    currentPage: safePage,
    pageSize,
    totalItems,
    pagination: {
      currentPage: safePage,
      pageSize,
      totalItems,
    },
    totalPages,
    startIndex,
    endIndex,
    hasNext: safePage < totalPages,
    hasPrevious: safePage > 1,
    goToPage,
    goToNext,
    goToPrevious,
    setPageSize,
  };
}