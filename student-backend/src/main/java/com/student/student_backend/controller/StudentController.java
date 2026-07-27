package com.student.student_backend.controller;

import com.student.student_backend.dto.PageResponse;
import com.student.student_backend.model.Student;
import com.student.student_backend.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
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


    // [PURPOSE]: Creates a new student profile.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, ADMIN authority required)
    // API to add student data (POST)
    @PostMapping
    public Student addStudent(@RequestBody Student student) {
        return studentService.saveStudent(student);
    }

    // [PURPOSE]: Retrieves all student profiles.
    // [ROLE]: ADMIN, TEACHER
    // [SECURITY]: Protected (JWT, ADMIN or TEACHER authority required)
    // API to get all student data (GET)
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    /**
     * [PURPOSE]: Paginated variant of getAllStudents.
     * [ROLE]: ADMIN, TEACHER
     * [SECURITY]: Protected (JWT, ADMIN or TEACHER authority required)
     *
     * <p>Query parameters:</p>
     * <ul>
     *   <li>{@code page}  – 1-based page number (default 1)</li>
     *   <li>{@code size}  – records per page (default 10)</li>
     * </ul>
     *
     * <p>Returns a {@link PageResponse} that mirrors the shape expected by
     * the React {@code useServerPagination} hook.</p>
     *
     * <p>If the client sends the legacy params (no {@code page}/{@code size}),
     * the regular {@link #getAllStudents()} method handles it instead.</p>
     */
    @GetMapping(params = {"page", "size"})
    public PageResponse<Student> getAllStudentsPaginated(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Student> studentPage = studentService.getAllStudents(page, size);
        return PageResponse.of(studentPage);
    }

    // [PURPOSE]: Deletes a student profile by ID.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, ADMIN authority required)
    // API to delete a student by ID (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    // [PURPOSE]: Retrieves a student's profile details by username, auto-generating a draft profile if none exists.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated role matches /api/students/profile/**)
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

    // [PURPOSE]: Updates an existing student profile by ID.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, ADMIN authority required via /api/students/** PUT rule)
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

     // [PURPOSE]: Computes stats (course count, etc.) for the student dashboard.
     // [ROLE]: STUDENT, TEACHER, ADMIN
     // [SECURITY]: Protected (JWT, any authenticated role matches /api/students/profile/**)
     // API to get dashboard summary (GET)
     @GetMapping("/profile/{username}/dashboard-summary")
     public ResponseEntity<?> getDashboardSummary(@PathVariable String username) {
         long enrolledCount = enrollmentRepository.findByUsername(username).size();
         
         java.util.Map<String, Object> summary = new java.util.HashMap<>();
         summary.put("enrolledCoursesCount", enrolledCount);
         summary.put("nextClassTime", "10:30 AM");
         summary.put("nextClassName", "Advanced Physics");
         summary.put("semesterDescription", "Fall 2026");
         
         return ResponseEntity.ok(summary);
     }

    // [PURPOSE]: Retrieves a chronological feed of updates for the student dashboard.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated role matches /api/students/profile/**)
    // API to get profile updates/notifications (GET)
    @GetMapping("/profile/{username}/updates")
    public ResponseEntity<?> getProfileUpdates(@PathVariable String username) {
        java.util.List<java.util.Map<String, String>> updates = new java.util.ArrayList<>();
        
        java.util.Map<String, String> u1 = new java.util.HashMap<>();
        u1.put("title", "Upcoming Exam Notice");
        u1.put("desc", "Midterm for Data Structures on Oct 15th");
        u1.put("time", "Yesterday");
        u1.put("type", "warning");
        updates.add(u1);
        
        java.util.Map<String, String> u2 = new java.util.HashMap<>();
        u2.put("title", "Library Book Due");
        u2.put("desc", "'Introduction to Algorithms' due tomorrow");
        u2.put("time", "2 days ago");
        u2.put("type", "danger");
        updates.add(u2);
        
        java.util.Map<String, String> u3 = new java.util.HashMap<>();
        u3.put("title", "System Maintenance");
        u3.put("desc", "Portal down from 2AM to 4AM this Sunday");
        u3.put("time", "3 days ago");
        u3.put("type", "info");
        updates.add(u3);
        
        return ResponseEntity.ok(updates);
    }
}