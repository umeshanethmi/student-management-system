'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '@/app/utils/api';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ServerPaginationResult<T> {
  data: T[];
  loading: boolean;
  error: string;
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  goToPage: (page: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  setPageSize: (size: number) => void;
  refresh: () => void;
}

interface UseServerPaginationOptions {
  /** Initial page size (default 10) */
  defaultPageSize?: number;
  /** Initial page (1-based, default 1) */
  initialPage?: number;
  /** Additional query params appended to the URL */
  queryParams?: Record<string, string>;
  /** Whether to fetch on mount */
  fetchOnMount?: boolean;
}

/**
 * Hook for **server-side** pagination.
 *
 * Calls an API endpoint that returns a PageResponse<T> JSON structure.
 * The backend is responsible for slicing & returning the correct page.
 *
 * The endpoint should accept `?page=X&size=Y` query parameters.
 *
 * @param endpoint  - API path, e.g. '/api/students'
 * @param options   - pagination & fetch options
 */
export function useServerPagination<T>(
  endpoint: string,
  options: UseServerPaginationOptions = {}
): ServerPaginationResult<T> {
  const {
    defaultPageSize = 10,
    initialPage = 1,
    queryParams = {},
    fetchOnMount = true,
  } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(defaultPageSize);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const buildUrl = useCallback(
    (page: number, size: number): string => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('size', String(size));

      Object.entries(queryParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const queryString = params.toString();
      return `${endpoint}${endpoint.includes('?') ? '&' : '?'}${queryString}`;
    },
    [endpoint, queryParams]
  );

  const fetchPage = useCallback(
    async (page: number, size: number) => {
      setLoading(true);
      setError('');

      try {
        const url = buildUrl(page, size);
        const response = await apiFetch<PageResponse<T>>(url);

        if (!mountedRef.current) return;

        setData(response.content ?? []);
        setTotalItems(response.totalElements ?? 0);
        setTotalPages(response.totalPages ?? 1);
        setHasNext(response.hasNext ?? false);
        setHasPrevious(response.hasPrevious ?? false);
        setCurrentPage(response.currentPage ?? page);
        setPageSizeState(response.pageSize ?? size);
      } catch (err: unknown) {
        if (!mountedRef.current) return;
        const message =
          err instanceof Error ? err.message : 'Failed to fetch page data.';
        setError(message);
        setData([]);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [buildUrl]
  );

  // Initial fetch
  useEffect(() => {
    if (fetchOnMount) {
      fetchPage(initialPage, defaultPageSize);
    }
    // Only run on mount / when these actually change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, fetchOnMount]);

  const goToPage = (page: number) => {
    const clamped = Math.max(1, Math.min(page, totalPages));
    fetchPage(clamped, pageSize);
  };

  const goToNext = () => {
    if (hasNext) fetchPage(currentPage + 1, pageSize);
  };

  const goToPrevious = () => {
    if (hasPrevious) fetchPage(currentPage - 1, pageSize);
  };

  const setPageSize = (size: number) => {
    setPageSizeState(size);
    fetchPage(1, size);
  };

  const refresh = () => {
    fetchPage(currentPage, pageSize);
  };

  return {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasNext,
    hasPrevious,
    goToPage,
    goToNext,
    goToPrevious,
    setPageSize,
    refresh,
  };
}