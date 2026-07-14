package com.student.student_backend.controller;

import com.student.student_backend.model.Submission;
import com.student.student_backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @GetMapping
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

    @PostMapping
    public Submission createSubmission(@RequestBody Submission submission) {
        return submissionRepository.save(submission);
    }

    @GetMapping("/student/{studentUsername}")
    public List<Submission> getSubmissionsByStudent(@PathVariable String studentUsername) {
        return submissionRepository.findByStudentUsername(studentUsername);
    }

    @GetMapping("/{id}")
    public Submission getSubmissionById(@PathVariable Long id) {
        return submissionRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}/grade")
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
