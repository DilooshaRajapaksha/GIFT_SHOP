package com.example.GiftCraft_BackEnd.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Date;

/*
 * After the admin types the right password we give back a signed token (JWT).
 * The browser sends this token instead of the password, and it stops working
 * after a few hours. So the real password is only sent once, at login.
 *
 * JWT_SECRET in .env signs the tokens. If it is empty we make a random one
 * when the server starts (then the admin just has to log in again after a restart).
 */
@Service
public class AdminTokenService {

    private static final long VALID_FOR_MS = 8L * 60 * 60 * 1000;   // 8 hours

    private final SecretKey key;

    public AdminTokenService(@Value("${app.jwt-secret:}") String secret) {
        byte[] bytes;
        if (secret == null || secret.length() < 32) {
            bytes = new byte[48];
            new SecureRandom().nextBytes(bytes);
        } else {
            bytes = secret.getBytes(StandardCharsets.UTF_8);
        }
        this.key = Keys.hmacShaKeyFor(bytes);
    }

    public String createToken() {
        Date now = new Date();
        return Jwts.builder()
                .subject("admin")
                .issuedAt(now)
                .expiration(new Date(now.getTime() + VALID_FOR_MS))
                .signWith(key)
                .compact();
    }

    public long validForMs() {
        return VALID_FOR_MS;
    }

    // true only if the token was signed by us, is not expired and is an admin token
    public boolean isValid(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            return "admin".equals(claims.getSubject());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
