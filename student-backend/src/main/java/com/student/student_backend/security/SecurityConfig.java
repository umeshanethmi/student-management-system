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
                .requestMatchers("/api/auth/login", "/api/auth/register", "/api/auth/**").permitAll()
                .requestMatchers("/api/admin", "/api/admin/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/students/profile", "/api/students/profile/**").hasAnyAuthority("STUDENT", "TEACHER", "ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/students", "/api/students/**").hasAnyAuthority("ADMIN", "TEACHER")
                .requestMatchers(HttpMethod.POST, "/api/students", "/api/students/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/students", "/api/students/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/students", "/api/students/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/courses", "/api/courses/**").hasAnyAuthority("ADMIN", "TEACHER", "STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/courses", "/api/courses/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/courses", "/api/courses/**").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/courses", "/api/courses/**").hasAuthority("ADMIN")
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