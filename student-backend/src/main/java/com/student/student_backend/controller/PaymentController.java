package com.student.student_backend.controller;

import com.student.student_backend.model.Payment;
import com.student.student_backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    // [PURPOSE]: Retrieves payment history records for a specific student, auto-seeding defaults if empty.
    // [ROLE]: STUDENT, TEACHER, ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @GetMapping("/student/{username}")
    public List<Payment> getPaymentsByStudent(@PathVariable String username) {
        List<Payment> records = paymentRepository.findByUsername(username);

        // Auto-seed default payments history if none exist or if they are outdated (missing description)
        boolean hasOldRecords = records.stream().anyMatch(p -> p.getDescription() == null);
        if (records.isEmpty() || hasOldRecords) {
            paymentRepository.deleteAll(records);
            paymentRepository.save(new Payment(username, "RCP-10293", "Sep 01, 2026", "LKR 150,000.00", "Credit Card", "Paid", "Semester 1 Tuition Fees"));
            paymentRepository.save(new Payment(username, "RCP-09182", "Aug 15, 2026", "LKR 15,000.00", "Bank Transfer", "Paid", "Exam Registration Fee"));
            paymentRepository.save(new Payment(username, "RCP-08221", "Jan 12, 2026", "LKR 150,000.00", "Credit Card", "Paid", "Admission Fee"));
            
            records = paymentRepository.findByUsername(username);
        }

        return records;
    }

    // [PURPOSE]: Adds a new payment record (e.g. system or staff action).
    // [ROLE]: ADMIN, TEACHER
    // [SECURITY]: Protected (JWT, any authenticated user)
    @PostMapping
    public Payment addPayment(@RequestBody Payment payment) {
        if (payment.getReceiptNo() == null) {
            payment.setReceiptNo("RCP-" + (int)(Math.random() * 90000 + 10000));
        }
        if (payment.getDate() == null) {
            java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy");
            payment.setDate(java.time.LocalDate.now().format(dtf));
        }
        return paymentRepository.save(payment);
    }

    // [PURPOSE]: Submits a bank deposit slip for student tuition verification.
    // [ROLE]: STUDENT
    // [SECURITY]: Protected (JWT, any authenticated user)
    @PostMapping("/submit-slip")
    public org.springframework.http.ResponseEntity<?> submitBankSlip(@RequestBody Payment slipRequest) {
        Payment payment = new Payment();
        payment.setUsername(slipRequest.getUsername());
        payment.setReceiptNo("SLP-" + (int)(Math.random() * 90000 + 10000));
        
        // Parse raw date string "yyyy-MM-dd" to "MMM dd, yyyy" if needed
        String formattedDate = slipRequest.getDate();
        try {
            if (formattedDate.contains("-")) {
                java.time.LocalDate localDate = java.time.LocalDate.parse(formattedDate);
                formattedDate = localDate.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy"));
            }
        } catch (Exception e) {
            // fallback to raw string
        }
        
        payment.setDate(formattedDate);
        payment.setAmount(slipRequest.getAmount());
        payment.setMethod("Bank Deposit Slip");
        payment.setStatus("Pending Verification");
        payment.setDescription("Tuition for " + slipRequest.getDescription()); // description holds course name
        payment.setSlipImage(slipRequest.getSlipImage());
        
        Payment saved = paymentRepository.save(payment);
        return org.springframework.http.ResponseEntity.ok(saved);
    }

    @Autowired
    private com.student.student_backend.repository.EnrollmentRepository enrollmentRepository;

    @Autowired
    private com.student.student_backend.repository.CourseRepository courseRepository;

    // [PURPOSE]: Retrieves all payments from the database for administrative review.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    // [PURPOSE]: Updates a payment's status and automatically creates a course enrollment if a pending registration is approved.
    // [ROLE]: ADMIN
    // [SECURITY]: Protected (JWT, any authenticated user)
    @PutMapping("/{id}/status")
    public org.springframework.http.ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        return paymentRepository.findById(id)
            .map(payment -> {
                String oldStatus = payment.getStatus();
                payment.setStatus(status);
                Payment saved = paymentRepository.save(payment);

                // If transition is to "Paid" from a pending bank slip / registration
                if ("Paid".equalsIgnoreCase(status) && !"Paid".equalsIgnoreCase(oldStatus)) {
                    String desc = payment.getDescription();
                    if (desc != null) {
                        String courseName = desc;
                        if (desc.startsWith("Tuition for ")) {
                            courseName = desc.substring("Tuition for ".length());
                        }
                        
                        final String finalCourseName = courseName;
                        // Look up course by name
                        java.util.Optional<com.student.student_backend.model.Course> courseOpt = 
                            courseRepository.findAll().stream()
                                .filter(c -> c.getCourseName().equalsIgnoreCase(finalCourseName) || 
                                             c.getCourseName().equalsIgnoreCase(desc))
                                .findFirst();
                                
                        if (courseOpt.isPresent()) {
                            com.student.student_backend.model.Course course = courseOpt.get();
                            // Check if enrollment already exists
                            boolean alreadyEnrolled = enrollmentRepository.findByUsernameAndCourseId(payment.getUsername(), course.getId()).isPresent();
                            if (!alreadyEnrolled) {
                                com.student.student_backend.model.Enrollment enrollment = new com.student.student_backend.model.Enrollment();
                                enrollment.setUsername(payment.getUsername());
                                enrollment.setCourseId(course.getId());
                                enrollment.setCourseCode(course.getCourseCode());
                                enrollment.setCourseName(course.getCourseName());
                                enrollment.setInstructor(course.getInstructor() != null ? course.getInstructor() : "Dr. Rajesh Kumar");
                                enrollment.setProgress(0);
                                enrollmentRepository.save(enrollment);
                            }
                        }
                    }
                }
                return org.springframework.http.ResponseEntity.ok(saved);
            })
            .orElseGet(() -> org.springframework.http.ResponseEntity.notFound().build());
    }
}
