package com.student.student_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.student.student_backend")
public class StudentBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentBackendApplication.class, args);
    }
}