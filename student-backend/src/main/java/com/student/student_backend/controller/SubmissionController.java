package com.student.student_backend.controller;

import com.student.student_backend.model.Submission;
import com.student.student_backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    // [PURPOSE]: Retrieves all submissions, auto-seeding default records if empty.
    // [ROLE]: TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @GetMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public List<Submission> getAllSubmissions() {
        List<Submission> list = submissionRepository.findAll();
        
        // Auto-seed default submissions if empty
        if (list.isEmpty()) {
            submissionRepository.save(new Submission(1L, "Nethmi", "nethmi", "https://auraedu-storage.s3.amazonaws.com/submissions/nethmi_java_assignment1.pdf", 92, "Excellent structural design and object-oriented principles applied.", "Oct 18, 2026"));
            submissionRepository.save(new Submission(1L, "sunil", "sunil", "https://auraedu-storage.s3.amazonaws.com/submissions/sunil_java_assignment1.pdf", 85, "Good implementation, but miss handling edge-cases.", "Oct 19, 2026"));
            submissionRepository.save(new Submission(2L, "Kavi", "kavi", "https://auraedu-storage.s3.amazonaws.com/submissions/kavi_db_assignment1.pdf", 0, "", "Oct 22, 2026"));
            list = submissionRepository.findAll();
        }
        
        return list;
    }

    // [PURPOSE]: Submits a new assignment submission from a student.
    // [ROLE]: STUDENT
    // [SECURITY]: Protected (JWT, any authenticated user)
    @PostMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public Submission createSubmission(@RequestBody Submission submission) {
        return submissionRepository.save(submission);
    }

    // [PURPOSE]: Retrieves all submissions made by a specific student username.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @GetMapping("/student/{studentUsername}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public List<Submission> getSubmissionsByStudent(@PathVariable String studentUsername) {
        return submissionRepository.findByStudentUsername(studentUsername);
    }

    // [PURPOSE]: Retrieves a single submission by its ID.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'ADMIN')")
    public Submission getSubmissionById(@PathVariable Long id) {
        return submissionRepository.findById(id).orElse(null);
    }

    // [PURPOSE]: Grades a student's submission (updates marks and feedback).
    // [ROLE]: TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @PutMapping("/{id}/grade")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public Submission gradeSubmission(@PathVariable Long id, @RequestParam int marks, @RequestParam String feedback) {
        Submission sub = submissionRepository.findById(id).orElse(null);
        if (sub != null) {
            sub.setMarks(marks);
            sub.setFeedback(feedback);
            return submissionRepository.save(sub);
        }
        return null;
    }
}
