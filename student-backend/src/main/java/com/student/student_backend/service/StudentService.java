package com.student.student_backend.service;

import com.student.student_backend.model.Student;
import com.student.student_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Insert data into the database (Create)
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // Get all data (Read)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Delete data by ID (Delete)
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
}