package com.student.student_backend.controller;

import com.student.student_backend.model.Course;
import com.student.student_backend.model.Enrollment;
import com.student.student_backend.repository.CourseRepository;
import com.student.student_backend.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // GET all enrollments
    @GetMapping
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    // GET enrollments by username
    @GetMapping("/student/{username}")
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

    // POST: Enroll a student in a course
    @PostMapping
    public ResponseEntity<?> enrollInCourse(@RequestBody Enrollment enrollmentRequest) {
        String username = enrollmentRequest.getUsername();
        Long courseId = enrollmentRequest.getCourseId();

        if (username == null || courseId == null) {
            return ResponseEntity.badRequest().body("Username and Course ID are required.");
        }

        // Check if already enrolled
        Optional<Enrollment> existingOpt = enrollmentRepository.findByUsernameAndCourseId(username, courseId);
        if (existingOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Student is already enrolled in this course.");
        }

        // Retrieve course details
        Optional<Course> courseOpt = courseRepository.findById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
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

    // GET enrollments by course ID
    @GetMapping("/course/{courseId}")
    public List<Enrollment> getEnrollmentsByCourse(@PathVariable Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
}
