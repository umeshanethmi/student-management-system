package com.student.student_backend.controller;

import com.student.student_backend.model.Student;
import com.student.student_backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*") 
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private com.student.student_backend.repository.UserRepository userRepository;

    @Autowired
    private com.student.student_backend.repository.EnrollmentRepository enrollmentRepository;

    @Autowired
    private com.student.student_backend.repository.AttendanceRepository attendanceRepository;

    @Autowired
    private com.student.student_backend.repository.AnnouncementRepository announcementRepository;

    // API to add student data (POST)
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    // API to get all student data (GET)
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // API to delete a student by ID (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // API to get profile by username (GET)
    @GetMapping("/profile/{username}")
    public ResponseEntity<Student> getProfile(@PathVariable String username) {
        java.util.Optional<Student> studentOpt = studentService.getStudentByUsername(username);
        if (studentOpt.isPresent()) {
            return ResponseEntity.ok(studentOpt.get());
        }
        
        // If not found, let's create a profile using the user's registration details, leaving other fields blank for them to fill.
        Student defaultStudent = new Student();
        defaultStudent.setUsername(username);
        
        // Retrieve real name and email from registration credentials
        java.util.Optional<com.student.student_backend.model.User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            defaultStudent.setName(username);
            defaultStudent.setEmail(userOpt.get().getEmail());
        } else {
            defaultStudent.setName(username);
            defaultStudent.setEmail("");
        }
        
        // Leave dynamic info fields blank
        defaultStudent.setAge(0);
        defaultStudent.setPhone("");
        defaultStudent.setAddress("");
        
        Student saved = studentService.saveStudent(defaultStudent);
        return ResponseEntity.ok(saved);
    }

    // API to update student data (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudentProfile(@PathVariable Long id, @RequestBody Student studentDetails) {
        try {
            Student updated = studentService.updateStudent(id, studentDetails);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // API to get dashboard summary (GET)
    @GetMapping("/profile/{username}/dashboard-summary")
    public ResponseEntity<?> getDashboardSummary(@PathVariable String username) {
        long enrolledCount = enrollmentRepository.findByUsername(username).size();
        
        java.util.List<com.student.student_backend.model.Attendance> attendanceRecords = 
            attendanceRepository.findByUsername(username);
        String attendanceRate = "88%";
        if (!attendanceRecords.isEmpty()) {
            long presentCount = attendanceRecords.stream()
                .filter(a -> "Present".equalsIgnoreCase(a.getStatus()))
                .count();
            attendanceRate = Math.round(((double) presentCount / attendanceRecords.size()) * 100) + "%";
        }
        
        java.util.Map<String, Object> summary = new java.util.HashMap<>();
        summary.put("attendanceRate", attendanceRate);
        summary.put("enrolledCoursesCount", enrolledCount);
        summary.put("pendingAssignmentsCount", 2);
        summary.put("nextClassTime", "10:30 AM");
        summary.put("nextClassName", "Advanced Physics");
        summary.put("semesterDescription", "Fall 2026");
        
        return ResponseEntity.ok(summary);
    }

    // API to get profile updates/notifications (GET)
    @GetMapping("/profile/{username}/updates")
    public ResponseEntity<?> getProfileUpdates(@PathVariable String username) {
        java.util.List<java.util.Map<String, String>> updates = new java.util.ArrayList<>();
        
        try {
            List<com.student.student_backend.model.Announcement> list = announcementRepository.findAll();
            for (com.student.student_backend.model.Announcement a : list) {
                java.util.Map<String, String> u = new java.util.HashMap<>();
                u.put("title", a.getTitle());
                u.put("desc", a.getDescription());
                u.put("time", a.getTimestamp() != null ? a.getTimestamp() : "Just now");
                u.put("type", "info");
                updates.add(0, u); // Prepend so new announcements show up first
            }
        } catch (Exception e) {
            // Ignore database error, proceed with seed list
        }

        if (updates.isEmpty()) {
            java.util.Map<String, String> u1 = new java.util.HashMap<>();
            u1.put("title", "Assignment Marks Released");
            u1.put("desc", "Physics Lab Report 3 graded: A-");
            u1.put("time", "2 hours ago");
            u1.put("type", "success");
            updates.add(u1);
            
            java.util.Map<String, String> u2 = new java.util.HashMap<>();
            u2.put("title", "Upcoming Exam Notice");
            u2.put("desc", "Midterm for Data Structures on Oct 15th");
            u2.put("time", "Yesterday");
            u2.put("type", "warning");
            updates.add(u2);
            
            java.util.Map<String, String> u3 = new java.util.HashMap<>();
            u3.put("title", "Library Book Due");
            u3.put("desc", "'Introduction to Algorithms' due tomorrow");
            u3.put("time", "2 days ago");
            u3.put("type", "danger");
            updates.add(u3);
            
            java.util.Map<String, String> u4 = new java.util.HashMap<>();
            u4.put("title", "System Maintenance");
            u4.put("desc", "Portal down from 2AM to 4AM this Sunday");
            u4.put("time", "3 days ago");
            u4.put("type", "info");
            updates.add(u4);
        }
        
        return ResponseEntity.ok(updates);
    }
}