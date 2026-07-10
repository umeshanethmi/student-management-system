package com.student.student_backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    // Token එක Encode කරන්න ගන්න රහස් Key එකක් (Secret Key)
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    
    // Token එක වලංගු කාලය (මිලි තත්පර වලින් - පැය 24ක්)
    private final long jwtExpirationInMs = 86400000;

    // 1. User කෙනෙක් Login වුණාම Token එකක් හදන මෙතඩ් එක
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

    // 2. Token එකෙන් Username එක කියවන මෙතඩ් එක
    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // 3. Token එක වලංගු එකක්ද (Valid) කියලා චෙක් කරන මෙතඩ් එක
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