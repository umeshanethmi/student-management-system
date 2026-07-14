package com.student.student_backend.controller;

import com.student.student_backend.model.Course;
import com.student.student_backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
public class CourseController {

    @Autowired
    private CourseService courseService;

    // Endpoint to fetch all courses for the Next.js frontend
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // Endpoint to add a new course
    @PostMapping
    public Course addCourse(@RequestBody Course course) {
        return courseService.addCourse(course);
    }

    // Endpoint to fetch a course by ID
    @GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return courseService.getCourseById(id)
            .map(org.springframework.http.ResponseEntity::ok)
            .orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }

    // Endpoint to delete a course
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }
}