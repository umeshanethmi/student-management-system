package com.student.student_backend.controller;

import com.student.student_backend.model.Course;
import com.student.student_backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // [PURPOSE]: Retrieves all available courses.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, ANY authorized user)
    // Endpoint to fetch all courses for the Next.js frontend
    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // [PURPOSE]: Creates a new course.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, ADMIN authority required)
    // Endpoint to add a new course
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Course addCourse(@RequestBody Course course) {
        return courseService.addCourse(course);
    }

    // [PURPOSE]: Retrieves a single course by its ID.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, ANY authorized user)
    // Endpoint to fetch a course by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public org.springframework.http.ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
                .map(org.springframework.http.ResponseEntity::ok)
                .orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }

    // [PURPOSE]: Deletes an existing course by its ID.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, ADMIN authority required)
    // Endpoint to delete a course
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public org.springframework.http.ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}