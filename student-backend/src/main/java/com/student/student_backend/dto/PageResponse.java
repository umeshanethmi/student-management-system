package com.student.student_backend.dto;

import org.springframework.data.domain.Page;
import java.util.List;

/**
 * A generic paginated response envelope that matches the
 * {@code PageResponse<T>} interface expected by the React
 * {@code useServerPagination} hook.
 *
 * <p>Usage in a controller:</p>
 * <pre>{@code
 *   @GetMapping
 *   public PageResponse<Student> getAllStudents(
 *       @RequestParam(defaultValue = "1") int page,
 *       @RequestParam(defaultValue = "10") int size
 *   ) {
 *       Page<Student> studentPage = studentService.getAllStudents(page, size);
 *       return PageResponse.of(studentPage);
 *   }
 * }</pre>
 *
 * @param <T> the type of items being paginated
 */
public class PageResponse<T> {

    /** The list of items for the current page */
    private List<T> content;

    /** Total number of items across all pages */
    private long totalElements;

    /** Total number of pages */
    private int totalPages;

    /** Current page number (1-based as expected by the frontend) */
    private int currentPage;

    /** Number of items per page */
    private int pageSize;

    /** Whether there is a next page */
    private boolean hasNext;

    /** Whether there is a previous page */
    private boolean hasPrevious;

    public PageResponse() {
    }

    public PageResponse(List<T> content, long totalElements, int totalPages,
                        int currentPage, int pageSize, boolean hasNext, boolean hasPrevious) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }

    /**
     * Converts a Spring Data {@link Page} into the frontend-friendly
     * {@code PageResponse} (1-based page index).
     */
    public static <T> PageResponse<T> of(Page<T> page) {
        return new PageResponse<>(
            page.getContent(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.getNumber() + 1,   // Spring Page is 0-based; frontend expects 1-based
            page.getSize(),
            page.hasNext(),
            page.hasPrevious()
        );
    }

    // ─── Getters & Setters ───────────────────────────────────────────

    public List<T> getContent() {
        return content;
    }

    public void setContent(List<T> content) {
        this.content = content;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public boolean getHasNext() {    // matches JSON key "hasNext"
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public boolean getHasPrevious() { // matches JSON key "hasPrevious"
        return hasPrevious;
    }

    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }
}