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

    // Retrieve all courses from the database
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Save a new course to the database
    public Course addCourse(Course course) {
        return courseRepository.save(course);
    }
}