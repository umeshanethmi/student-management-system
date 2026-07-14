package com.student.student_backend.dto;

public class LoginResponseData {
    private String email;
    private String role;
    private String token;
    private String username;

    public LoginResponseData() {
    }

    public LoginResponseData(String email, String role, String token, String username) {
        this.email = email;
        this.role = role;
        this.token = token;
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
