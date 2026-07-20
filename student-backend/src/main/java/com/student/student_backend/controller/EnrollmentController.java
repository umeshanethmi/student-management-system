package com.student.student_backend.controller;

import com.student.student_backend.model.Course;
import com.student.student_backend.model.Enrollment;
import com.student.student_backend.repository.CourseRepository;
import com.student.student_backend.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    // [PURPOSE]: Retrieves all course enrollments.
    // [ROLE]: ADMIN, TEACHER
    // [SECURITY]: Protected (JWT, any authenticated user)
    // GET all enrollments
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    // [PURPOSE]: Retrieves enrollment list for a specific student, auto-seeding defaults if empty.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    // GET enrollments by username
    @GetMapping("/student/{username}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public List<Enrollment> getEnrollmentsByStudent(@PathVariable String username) {
        List<Enrollment> enrollments = enrollmentRepository.findByUsername(username);
        
        // Auto-seed default course enrollments if none exist, so the user sees data immediately
        if (enrollments.isEmpty()) {
            List<Course> courses = courseRepository.findAll();
            if (!courses.isEmpty()) {
                // Enroll the student in the first two courses by default with some progress
                for (int i = 0; i < Math.min(courses.size(), 3); i++) {
                    Course c = courses.get(i);
                    Enrollment e = new Enrollment();
                    e.setUsername(username);
                    e.setCourseId(c.getId());
                    e.setCourseCode(c.getCourseCode());
                    e.setCourseName(c.getCourseName());
                    // Use instructor from course if available
                    e.setInstructor(c.getInstructor() != null ? c.getInstructor() : "Dr. Rajesh Kumar");
                    if (i == 0) {
                        e.setProgress(75);
                    } else if (i == 1) {
                        e.setProgress(40);
                    } else {
                        e.setProgress(90);
                    }
                    enrollmentRepository.save(e);
                }
                enrollments = enrollmentRepository.findByUsername(username);
            }
        }
        return enrollments;
    }

    // [PURPOSE]: Enrolls a student in a specific course by ID.
    // [ROLE]: STUDENT
    // [SECURITY]: Protected (JWT, STUDENT authority required)
    // POST: Enroll a student in a course
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> enrollInCourse(@RequestBody Enrollment enrollmentRequest,
                                             java.security.Principal principal) {
        // Auto-fill username from JWT token if not provided in request body
        String username = enrollmentRequest.getUsername();
        if (username == null || username.isBlank()) {
            username = principal.getName();
            enrollmentRequest.setUsername(username);
        }
        Long courseId = enrollmentRequest.getCourseId();

        if (courseId == null) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "success", false,
                "message", "Course ID is required."
            ));
        }

        // Check if already enrolled
        Optional<Enrollment> existingOpt = enrollmentRepository.findByUsernameAndCourseId(username, courseId);
        if (existingOpt.isPresent()) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "success", false,
                "message", "Student is already enrolled in this course."
            ));
        }

        // Retrieve course details
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of(
                "success", false,
                "message", "Course not found with ID: " + courseId
            ));
        }

        Course course = courseOpt.get();
        Enrollment enrollment = new Enrollment();
        enrollment.setUsername(username);
        enrollment.setCourseId(course.getId());
        enrollment.setCourseCode(course.getCourseCode());
        enrollment.setCourseName(course.getCourseName());
        // Use instructor from catalog course
        enrollment.setInstructor(course.getInstructor() != null ? course.getInstructor() : "Dr. Rajesh Kumar");
        enrollment.setProgress(0); // Starts at 0% progress

        Enrollment saved = enrollmentRepository.save(enrollment);
        return ResponseEntity.ok(saved);
    }

    // [PURPOSE]: Retrieves all enrollment records for a specific course by its ID.
    // [ROLE]: TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    // GET enrollments by course ID
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<Enrollment> getEnrollmentsByCourse(@PathVariable Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
}
