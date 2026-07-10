package com.student.student_backend.controller;

import com.student.student_backend.model.User;
import com.student.student_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    // 1. Registration API endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Save the user to the database
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // 2. Login API endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        // Validate the username and password
        Optional<User> userOpt = userService.loginUser(username, password);

        if (userOpt.isPresent()) {
            // Upon successful login, return a mock JWT token string
            Map<String, String> response = new HashMap<>();
            response.put("token", "mock-jwt-token-xyz");
            response.put("username", username);
            response.put("role", userOpt.get().getRole());
            
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}