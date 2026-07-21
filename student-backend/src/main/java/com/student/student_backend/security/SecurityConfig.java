package com.student.student_backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Enable CORS
            .csrf(csrf -> csrf.disable()) // Disable CSRF
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/**").permitAll()
                
                // Admin specific paths
                .requestMatchers("/api/admin", "/api/admin/**").hasRole("ADMIN")
                
                // Student Profile paths
                .requestMatchers(HttpMethod.GET, "/api/students/profile", "/api/students/profile/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/students", "/api/students/**").hasAnyRole("ADMIN", "TEACHER")
                .requestMatchers(HttpMethod.POST, "/api/students", "/api/students/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/students", "/api/students/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/students", "/api/students/**").hasRole("ADMIN")
                
                // Course paths
                .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/**").hasAnyRole("ADMIN", "TEACHER", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/courses", "/api/courses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/courses", "/api/courses/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/courses", "/api/courses/**").hasRole("ADMIN")
                
                // Attendance Controller Rules
                .requestMatchers(HttpMethod.GET, "/api/attendance/student/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/attendance", "/api/attendance/**").hasAnyRole("TEACHER", "ADMIN")
                
                // Assignment Controller Rules
                .requestMatchers(HttpMethod.GET, "/api/assignments", "/api/assignments/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/assignments", "/api/assignments/**").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/assignments/**").hasAnyRole("TEACHER", "ADMIN")
                
                // Submission Controller Rules
                .requestMatchers(HttpMethod.GET, "/api/submissions").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/submissions").hasAnyRole("STUDENT", "TEACHER")
                .requestMatchers(HttpMethod.GET, "/api/submissions/student/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/submissions/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/submissions/*/grade").hasRole("TEACHER")
                
                // ExamResult Controller Rules
                .requestMatchers(HttpMethod.GET, "/api/exams/student/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/exams", "/api/exams/**").hasRole("TEACHER")

                // Enrollment Controller Rules
                .requestMatchers(HttpMethod.GET, "/api/enrollments").hasAnyRole("TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/enrollments/student/**").hasAnyRole("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/enrollments").hasRole("STUDENT")
                .requestMatchers(HttpMethod.GET, "/api/enrollments/course/**").hasAnyRole("TEACHER", "ADMIN")
                
                .anyRequest().authenticated()
            );
        
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000")); // Allow Next.js frontend
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // Bean used to hash and encrypt user passwords
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}