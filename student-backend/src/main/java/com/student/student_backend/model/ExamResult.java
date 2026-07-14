package com.student.student_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "exam_results")
public class ExamResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String courseCode;
    private String courseName;
    private String grade;
    private int credits;
    private double points;

    public ExamResult() {}

    public ExamResult(String username, String courseCode, String courseName, String grade, int credits, double points) {
        this.username = username;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.grade = grade;
        this.credits = credits;
        this.points = points;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public int getCredits() { return credits; }
    public void setCredits(int credits) { this.credits = credits; }

    public double getPoints() { return points; }
    public void setPoints(double points) { this.points = points; }
}
