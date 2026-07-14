package com.student.student_backend.controller;

import com.student.student_backend.model.ExamResult;
import com.student.student_backend.repository.ExamResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamResultController {

    @Autowired
    private ExamResultRepository examResultRepository;

    @GetMapping("/student/{username}")
    public List<ExamResult> getExamsByStudent(@PathVariable String username) {
        List<ExamResult> records = examResultRepository.findByUsername(username);

        // Auto-seed default exam results if none exist
        if (records.isEmpty()) {
            examResultRepository.save(new ExamResult(username, "PHY301", "Advanced Physics", "A", 4, 4.0));
            examResultRepository.save(new ExamResult(username, "CS204", "Data Structures", "A-", 3, 3.7));
            examResultRepository.save(new ExamResult(username, "MTH201", "Linear Algebra", "B+", 3, 3.3));
            examResultRepository.save(new ExamResult(username, "ENG105", "World Literature", "A", 2, 4.0));
            
            records = examResultRepository.findByUsername(username);
        }

        return records;
    }

    @PostMapping
    public ExamResult saveExamResult(@RequestBody ExamResult examResult) {
        return examResultRepository.save(examResult);
    }
}
