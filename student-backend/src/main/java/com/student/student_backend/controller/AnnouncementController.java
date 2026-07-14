package com.student.student_backend.controller;

import com.student.student_backend.model.Announcement;
import com.student.student_backend.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @GetMapping
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    @PostMapping
    public Announcement createAnnouncement(@RequestBody Announcement announcement) {
        if (announcement.getTimestamp() == null) {
            announcement.setTimestamp(new java.util.Date().toString());
        }
        return announcementRepository.save(announcement);
    }
}
