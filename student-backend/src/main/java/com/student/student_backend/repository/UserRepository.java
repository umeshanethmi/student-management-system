package com.student.student_backend.repository;

import com.student.student_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

// Repository interface for User entity
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Finds a user by their username
    Optional<User> findByUsername(String username);

    // Finds users by their role
    List<User> findByRole(String role);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Query(value = "DELETE FROM users WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY username)", nativeQuery = true)
    void deleteDuplicateUsers();
}