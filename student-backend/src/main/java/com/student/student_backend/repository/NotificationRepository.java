package com.student.student_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.student.student_backend.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByStudentUsernameOrderByCreatedAtDesc(String studentUsername);
    List<Notification> findByStudentUsernameAndIsReadFalseOrderByCreatedAtDesc(String studentUsername);
    long countByStudentUsernameAndIsReadFalse(String studentUsername);
}