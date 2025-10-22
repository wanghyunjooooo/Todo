package backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.Date;

import javax.crypto.SecretKey;

@Component
public class JWToken {

    @Value("${jwt.secret}")
    private String secretKey;

    private final long validityInMs = 7 * 24 * 60 * 60 * 1000;

    public String createToken(Long userId, String userName) {
        Claims claims = Jwts.claims().setSubject(userId.toString());
        claims.put("user_name", userName);

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMs);

        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        SecretKey key = Keys.hmacShaKeyFor(keyBytes);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}
