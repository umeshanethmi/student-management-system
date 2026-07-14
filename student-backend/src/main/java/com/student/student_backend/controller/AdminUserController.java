package com.student.student_backend.controller;

import com.student.student_backend.dto.ApiResponse;
import com.student.student_backend.dto.UserResponseDTO;
import com.student.student_backend.model.User;
import com.student.student_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminUserController {

    @Autowired
    private UserService userService;

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<?>> createUserByAdmin(@RequestBody User user) {
        String role = user.getRole();
        if (role == null || (!role.equalsIgnoreCase("STUDENT") && !role.equalsIgnoreCase("TEACHER"))) {
            ApiResponse<Void> response = new ApiResponse<>(false, "Role must be either STUDENT or TEACHER", null);
            return ResponseEntity.badRequest().body(response);
        }
        
        user.setRole(role.toUpperCase());
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

    @GetMapping("/users/role/{role}")
    public java.util.List<User> getUsersByRole(@PathVariable String role) {
        return userService.getUsersByRole(role);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
