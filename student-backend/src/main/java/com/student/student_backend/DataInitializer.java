package com.student.student_backend;

import com.student.student_backend.model.User;
import com.student.student_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.student.student_backend.repository.CourseRepository courseRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            userRepository.deleteDuplicateUsers();
            System.out.println("---- Successfully cleaned up duplicate users from database ----");
        } catch (Exception e) {
            System.err.println("Error cleaning up duplicate users: " + e.getMessage());
        }

        Optional<User> adminOpt = userRepository.findByUsername("admin");
        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@eduadmin.com");
            admin.setPassword(passwordEncoder.encode("admin1234"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("---- Admin user initialized in database ----");
        } else {
            System.out.println("---- Admin user already exists in database ----");
        }

        Optional<User> teacherOpt = userRepository.findByUsername("AURA26L01");
        if (teacherOpt.isEmpty()) {
            User teacher = new User();
            teacher.setUsername("AURA26L01");
            teacher.setEmail("teacher@auraedu.com");
            // Set the BCrypt hash dynamically by passing plain-text password to encode()
            teacher.setPassword(passwordEncoder.encode("123456"));
            teacher.setRole("TEACHER");
            userRepository.save(teacher);
            System.out.println("---- Teacher user AURA26L01 initialized in database ----");
        } else {
            System.out.println("---- Teacher user AURA26L01 already exists in database ----");
        }

        // Seed default catalog courses
        if (courseRepository.count() < 4) {
            courseRepository.deleteAll(); // Clean any duplicate/dirty states
            
            com.student.student_backend.model.Course c1 = new com.student.student_backend.model.Course();
            c1.setCourseName("Java Programming");
            c1.setCourseCode("SE-2020");
            c1.setInstructor("Dr. Rajesh Kumar");
            c1.setCredits(4);
            c1.setFee("LKR 45,000");
            courseRepository.save(c1);

            com.student.student_backend.model.Course c2 = new com.student.student_backend.model.Course();
            c2.setCourseName("Database Systems");
            c2.setCourseCode("CS-3010");
            c2.setInstructor("Dr. Sarah Jenkins");
            c2.setCredits(3);
            c2.setFee("LKR 55,000");
            courseRepository.save(c2);

            com.student.student_backend.model.Course c3 = new com.student.student_backend.model.Course();
            c3.setCourseName("Web Development");
            c3.setCourseCode("CS-4020");
            c3.setInstructor("Prof. Alan Turing");
            c3.setCredits(3);
            c3.setFee("LKR 40,000");
            courseRepository.save(c3);

            com.student.student_backend.model.Course c4 = new com.student.student_backend.model.Course();
            c4.setCourseName("Cloud Computing");
            c4.setCourseCode("SE-4050");
            c4.setInstructor("Dr. Ramanujan");
            c4.setCredits(4);
            c4.setFee("LKR 65,000");
            courseRepository.save(c4);
            
            System.out.println("---- Catalog courses seeded ----");
        }
    }
}
