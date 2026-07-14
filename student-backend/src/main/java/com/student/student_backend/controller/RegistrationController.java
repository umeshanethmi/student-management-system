package com.student.student_backend.controller;

import com.student.student_backend.model.Payment;
import com.student.student_backend.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/registration")
@CrossOrigin(origins = "*")
public class RegistrationController {

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping(value = "/submit", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitRegistration(
            @RequestParam("username") String username,
            @RequestParam("amount") String amount,
            @RequestParam("date") String date,
            @RequestParam("description") String description,
            @RequestParam("slip") MultipartFile slipFile) {
        
        try {
            Payment payment = new Payment();
            payment.setUsername(username);
            payment.setReceiptNo("REG-" + (int)(Math.random() * 90000 + 10000));
            
            // Parse date string
            String formattedDate = date;
            try {
                if (formattedDate.contains("-")) {
                    java.time.LocalDate localDate = java.time.LocalDate.parse(formattedDate);
                    formattedDate = localDate.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy"));
                }
            } catch (Exception e) {
                // fallback
            }
            
            payment.setDate(formattedDate);
            payment.setAmount(amount);
            payment.setMethod("Bank Slip Registration");
            payment.setStatus("Pending Verification");
            payment.setDescription(description); // Selected Course Name
            
            // Convert file to base64 text for DB storage
            if (slipFile != null && !slipFile.isEmpty()) {
                byte[] bytes = slipFile.getBytes();
                String base64Image = "data:" + slipFile.getContentType() + ";base64," + 
                                     java.util.Base64.getEncoder().encodeToString(bytes);
                payment.setSlipImage(base64Image);
            }
            
            Payment saved = paymentRepository.save(payment);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error processing slip registration: " + e.getMessage());
        }
    }
}
