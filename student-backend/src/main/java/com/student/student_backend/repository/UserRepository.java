package com.student.student_backend.repository;

import com.student.student_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// Repository interface for User entity
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Finds a user by their username
    Optional<User> findByUsername(String username);
}