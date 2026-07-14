package com.student.student_backend.controller;

import com.student.student_backend.model.Student;
import com.student.student_backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private StudentService studentService;

    @PutMapping("/update")
    public ResponseEntity<Student> updateProfile(@RequestBody Student studentDetails) {
        if (studentDetails.getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            Student updated = studentService.updateStudent(studentDetails.getId(), studentDetails);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
