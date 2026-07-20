package com.student.student_backend.service;

import com.student.student_backend.model.Course;
import com.student.student_backend.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // [PURPOSE]: Retrieves all course records from the database.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, via CourseController mapping)
    // Retrieve all courses from the database
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // [PURPOSE]: Saves a new course record to the database.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, ADMIN authority via CourseController mapping)
    // Save a new course to the database
    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }

    // [PURPOSE]: Retrieves a single course record by its ID.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, via CourseController mapping)
    // Retrieve a course by ID
    public java.util.Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    // [PURPOSE]: Deletes a course record by its ID from the database.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, ADMIN authority via CourseController mapping)
    // Delete a course from the database
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}