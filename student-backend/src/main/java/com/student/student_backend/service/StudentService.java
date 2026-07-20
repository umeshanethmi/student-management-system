package com.student.student_backend.service;

import com.student.student_backend.model.Student;
import com.student.student_backend.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // [PURPOSE]: Saves or registers a student's profile information.
    // [ROLE]: STUDENT, ADMIN
    // [SECURITY]: Protected (JWT, via StudentController mapping)
    // Insert data into the database (Create)
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // [PURPOSE]: Retrieves a list of all student profile records.
    // [ROLE]: ADMIN, TEACHER
    // [SECURITY]: Protected (JWT, via StudentController mapping)
    // Get all data (Read)
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    /**
     * Returns a paginated view of all students.
     *
     * @param page 1-based page number (e.g. 1, 2, 3...)
     * @param size number of records per page
     * @return a Spring Data {@link Page} of students
     */
    public Page<Student> getAllStudents(int page, int size) {
        // Spring's Pageable is 0-based, so we subtract 1 from the incoming page
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), size);
        return studentRepository.findAll(pageable);
    }

    // [PURPOSE]: Removes a student profile record by ID.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, via StudentController mapping)
    // Delete data by ID (Delete)
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    // [PURPOSE]: Retrieves a single student profile by their username.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, via StudentController mapping)
    // Get student by username (Read)
    public java.util.Optional<Student> getStudentByUsername(String username) {
        return studentRepository.findByUsername(username);
    }

    // [PURPOSE]: Updates existing student fields (name, email, age, phone, address).
    // [ROLE]: STUDENT, ADMIN
    // [SECURITY]: Protected (JWT, via StudentController/ProfileController mapping)
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