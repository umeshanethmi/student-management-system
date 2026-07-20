package com.student.student_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.student.student_backend.model.Notification;
import com.student.student_backend.model.NotificationType;
import com.student.student_backend.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /** Core method — call from grading, attendance, and assignment services */
    public Notification createAndSave(String studentUsername, NotificationType type,
                                       String title, String message) {
        Notification notification = new Notification(studentUsername, title, message, type);
        return notificationRepository.save(notification);
    }

    /** Grade submission trigger */
    public void notifyGrade(String studentUsername, String courseName, String grade) {
        createAndSave(studentUsername, NotificationType.GRADE,
            "New Grade Posted",
            String.format("You received a grade of '%s' in %s. Check your transcript.", grade, courseName));
    }

    /** Attendance marking trigger */
    public void notifyAttendance(String studentUsername, String courseName, String date, String status) {
        createAndSave(studentUsername, NotificationType.ATTENDANCE,
            "Attendance Updated",
            String.format("Your attendance for %s on %s has been marked as '%s'.", courseName, date, status));
    }

    /** Assignment posting trigger */
    public void notifyAssignment(String studentUsername, String courseName, String assignmentTitle, String deadline) {
        createAndSave(studentUsername, NotificationType.ASSIGNMENT,
            "New Assignment Posted",
            String.format("'%s' has been posted for %s. Due by %s.", assignmentTitle, courseName, deadline));
    }

    /** FETCH — for the API endpoint */
    public List<Notification> getNotificationsForStudent(String studentUsername) {
        return notificationRepository.findByStudentUsernameOrderByCreatedAtDesc(studentUsername);
    }

    /** MARK AS READ */
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }
}