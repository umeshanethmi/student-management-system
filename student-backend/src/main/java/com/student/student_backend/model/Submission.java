package com.student.student_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long assignmentId;
    private String studentName;
    private String studentUsername;
    private String fileUrl;
    private int marks;

    @Column(columnDefinition = "TEXT")
    private String feedback;
    private String submittedAt;

    public Submission() {}

    public Submission(Long assignmentId, String studentName, String studentUsername, String fileUrl, int marks, String feedback, String submittedAt) {
        this.assignmentId = assignmentId;
        this.studentName = studentName;
        this.studentUsername = studentUsername;
        this.fileUrl = fileUrl;
        this.marks = marks;
        this.feedback = feedback;
        this.submittedAt = submittedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentUsername() { return studentUsername; }
    public void setStudentUsername(String studentUsername) { this.studentUsername = studentUsername; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public int getMarks() { return marks; }
    public void setMarks(int marks) { this.marks = marks; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }
}
