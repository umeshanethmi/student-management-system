package com.student.student_backend.controller;

import com.student.student_backend.model.Attendance;
import com.student.student_backend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping("/student/{username}")
    public List<Attendance> getAttendanceByStudent(@PathVariable String username) {
        List<Attendance> records = attendanceRepository.findByUsername(username);

        // Auto-seed default attendance history if none exists
        if (records.isEmpty()) {
            attendanceRepository.save(new Attendance(username, "Advanced Physics", "Oct 12, 2026", "Present"));
            attendanceRepository.save(new Attendance(username, "Data Structures", "Oct 11, 2026", "Present"));
            attendanceRepository.save(new Attendance(username, "Linear Algebra", "Oct 10, 2026", "Absent"));
            attendanceRepository.save(new Attendance(username, "World Literature", "Oct 09, 2026", "Present"));
            attendanceRepository.save(new Attendance(username, "Data Structures", "Oct 08, 2026", "Present"));
            
            records = attendanceRepository.findByUsername(username);
        }

        return records;
    }

    @PostMapping
    public List<Attendance> saveAttendance(@RequestBody List<Attendance> records) {
        return attendanceRepository.saveAll(records);
    }
}
