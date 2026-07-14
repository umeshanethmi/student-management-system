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

    // Get student by username (Read)
    public java.util.Optional<Student> getStudentByUsername(String username) {
        return studentRepository.findByUsername(username);
    }

    // Update student details (Update)
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        
        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setAge(studentDetails.getAge());
        student.setPhone(studentDetails.getPhone());
        student.setAddress(studentDetails.getAddress());
        if (studentDetails.getUsername() != null) {
            student.setUsername(studentDetails.getUsername());
        }
        
        return studentRepository.save(student);
    }
}