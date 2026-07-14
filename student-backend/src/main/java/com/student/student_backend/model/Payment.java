package com.student.student_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String receiptNo;
    private String date;
    private String amount;
    private String method;
    private String status; // Paid or Pending
    private String description;

    @Column(columnDefinition = "TEXT")
    private String slipImage;

    public Payment() {}

    public Payment(String username, String receiptNo, String date, String amount, String method, String status, String description) {
        this.username = username;
        this.receiptNo = receiptNo;
        this.date = date;
        this.amount = amount;
        this.method = method;
        this.status = status;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getReceiptNo() { return receiptNo; }
    public void setReceiptNo(String receiptNo) { this.receiptNo = receiptNo; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSlipImage() { return slipImage; }
    public void setSlipImage(String slipImage) { this.slipImage = slipImage; }
}
