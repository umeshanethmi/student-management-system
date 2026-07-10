package com.student.student_backend.service;

import com.student.student_backend.model.User;
import com.student.student_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Inject the BCryptPasswordEncoder from SecurityConfig
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // 1. Method to register a new user with a hashed password
    public User registerUser(User user) {
        // Securely hash the plain text password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole("STUDENT");
        }
        return userRepository.save(user);
    }

    // 2. Method to authenticate user during login
    public Optional<User> loginUser(String username, String rawPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Compare the raw password with the hashed password stored in DB
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }
}