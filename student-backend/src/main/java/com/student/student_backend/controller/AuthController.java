package com.student.student_backend.controller;

import com.student.student_backend.dto.ApiResponse;
import com.student.student_backend.dto.LoginResponseData;
import com.student.student_backend.dto.UserResponseDTO;
import com.student.student_backend.model.User;
import com.student.student_backend.security.JwtTokenProvider;
import com.student.student_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponseDTO>> register(@RequestBody User user) {
        // Force role to STUDENT for public registrations
        user.setRole("STUDENT");
        User savedUser = userService.registerUser(user);
        
        UserResponseDTO responseData = new UserResponseDTO(
            savedUser.getUsername(),
            savedUser.getEmail(),
            savedUser.getRole()
        );
        
        ApiResponse<UserResponseDTO> response = new ApiResponse<>(
            true,
            "User created successfully",
            responseData
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Optional<User> userOpt = userService.loginUser(username, password);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String jwt = jwtTokenProvider.generateToken(user.getUsername());

            LoginResponseData responseData = new LoginResponseData(
                user.getEmail(),
                user.getRole(),
                jwt,
                user.getUsername()
            );

            ApiResponse<LoginResponseData> response = new ApiResponse<>(
                true,
                "Login successful",
                responseData
            );
            
            return ResponseEntity.ok(response);
        } else {
            ApiResponse<Void> response = new ApiResponse<>(
                false,
                "Invalid username or password",
                null
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/debug")
    public ResponseEntity<?> debugAuth() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            return ResponseEntity.ok(java.util.Map.of("message", "No authentication found"));
        }
        return ResponseEntity.ok(java.util.Map.of(
            "name", auth.getName(),
            "authorities", auth.getAuthorities().stream().map(Object::toString).toList(),
            "authenticated", auth.isAuthenticated()
        ));
    }
}