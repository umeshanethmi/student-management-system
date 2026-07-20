package com.student.student_backend.controller;

import com.student.student_backend.model.Assignment;
import com.student.student_backend.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    // [PURPOSE]: Retrieves all assignments, auto-seeding defaults if none exist.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public List<Assignment> getAllAssignments() {
        List<Assignment> list = assignmentRepository.findAll();
        
        // Auto-seed default assignments if database is empty
        if (list.isEmpty()) {
            assignmentRepository.save(new Assignment("Java Programming", "Midterm Programming Assignment", "Oct 20, 2026", 100));
            assignmentRepository.save(new Assignment("Database Systems", "SQL Queries & Schema Design", "Oct 25, 2026", 100));
            list = assignmentRepository.findAll();
        }
        
        return list;
    }

    // [PURPOSE]: Creates a new assignment.
    // [ROLE]: TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    // [PURPOSE]: Retrieves a single assignment by its ID.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public Assignment getAssignmentById(@PathVariable Long id) {
        return assignmentRepository.findById(id).orElse(null);
    }

    // [PURPOSE]: Deletes an assignment by its ID.
    // [ROLE]: TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public void deleteAssignment(@PathVariable Long id) {
        assignmentRepository.deleteById(id);
    }
}
