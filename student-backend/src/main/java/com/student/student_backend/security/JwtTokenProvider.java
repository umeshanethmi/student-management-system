package com.student.student_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // Secret key used to encode and sign the JWT token (persistent across restarts to prevent 403 token invalidation)
    private final Key key = Keys.hmacShaKeyFor("yourSecureSecretKeyMustBeVeryLongToSatisfyHS512RequirementsForSigningTokensProperly1234567890".getBytes());
    
    // Token validity duration (in milliseconds - 24 hours)
    private final long jwtExpirationInMs = 86400000;

    // 1. Method to generate a token when a user logs in
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    // 2. Method to read the username from the token
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // 3. Method to check if the token is valid
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            System.out.println("Invalid JWT Token: " + ex.getMessage());
        }
        return false;
    }
}