package com.MoneyMate.demo.Security;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.MoneyMate.demo.Model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private final String secretKey = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    // Method to generate a JWT token
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours
                .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .compact();
    }

    // Method to extract username from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Authentication getAuthentication(String token) {
        String username = extractUsername(token);

        // In a real-world application, you would typically fetch the User details from the database
        User userDetails = new User(); // Replace with real user fetching logic
        userDetails.setEmail(username);

        // Creating a UsernamePasswordAuthenticationToken (Spring Security's Authentication object)
        return new UsernamePasswordAuthenticationToken(userDetails, null, new ArrayList<>());
    }
    // Validate the token
    public boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.ExpiredJwtException | io.jsonwebtoken.UnsupportedJwtException | 
                io.jsonwebtoken.MalformedJwtException | io.jsonwebtoken.security.SecurityException | 
                IllegalArgumentException e) {
            return false;
        }
    }

    // Helper method to extract claims
    private <T> T extractClaim(String token, java.util.function.Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Helper method to extract all claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
