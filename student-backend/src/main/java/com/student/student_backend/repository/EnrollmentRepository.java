package com.student.student_backend.repository;

import com.student.student_backend.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUsername(String username);
    Optional<Enrollment> findByUsernameAndCourseId(String username, Long courseId);
    List<Enrollment> findByCourseId(Long courseId);
}
