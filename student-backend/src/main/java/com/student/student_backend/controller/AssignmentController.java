package com.student.student_backend.controller;

import com.student.student_backend.model.Assignment;
import com.student.student_backend.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @GetMapping
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

    @PostMapping
    public Assignment createAssignment(@RequestBody Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    @GetMapping("/{id}")
    public Assignment getAssignmentById(@PathVariable Long id) {
        return assignmentRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteAssignment(@PathVariable Long id) {
        assignmentRepository.deleteById(id);
    }
}
