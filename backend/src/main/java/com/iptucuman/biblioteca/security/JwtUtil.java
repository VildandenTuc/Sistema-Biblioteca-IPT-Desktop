package com.iptucuman.biblioteca.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    @Value("${biblioteca.jwt.secret}")
    private String secretKey;

    @Value("${biblioteca.jwt.expiration}")
    private long jwtExpirationInMs;

    // 🔑 Genera la clave segura para HS256
    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    // 📌 Generar un nuevo token JWT (método antiguo - mantener por compatibilidad)
    public String generateToken(String username) {
        return generateToken(username, new HashMap<>());
    }

    // 📌 Generar token con claims personalizados (incluye authorities/roles)
    public String generateToken(String username, Map<String, Object> extraClaims) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 📌 Generar token desde UserDetails (incluye authorities automáticamente)
    public String generateTokenFromUserDetails(org.springframework.security.core.userdetails.UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        // Extraer los roles/authorities del UserDetails
        List<String> authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        claims.put("authorities", authorities);

        return generateToken(userDetails.getUsername(), claims);
    }

    // 📌 Generar token desde UserDetails incluyendo el userId (NUEVO)
    public String generateTokenWithUserId(org.springframework.security.core.userdetails.UserDetails userDetails, Integer userId) {
        Map<String, Object> claims = new HashMap<>();

        // Extraer los roles/authorities del UserDetails
        List<String> authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        claims.put("authorities", authorities);
        claims.put("email", userDetails.getUsername()); // Guardar el email como claim

        // CAMBIO: Usar userId como subject en lugar del email
        return generateTokenFromUserId(userId.toString(), claims);
    }

    // 📌 Generar token usando userId como subject
    private String generateTokenFromUserId(String userId, Map<String, Object> extraClaims) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userId) // userId es el subject
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 📌 Extraer el username (subject) desde el token
    // NOTA: Ahora el subject es el userId, pero mantenemos el nombre para compatibilidad
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // 📌 Extraer el userId (subject) desde el token
    public Integer extractUserId(String token) {
        String userIdStr = extractClaim(token, Claims::getSubject);
        return Integer.parseInt(userIdStr);
    }

    // 📌 Extraer cualquier claim genérico
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // 📌 Extraer todos los claims
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 📌 Validar si el token pertenece a ese usuario y no está expirado
    public boolean isTokenValid(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    // 📌 Chequear expiración
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // 📌 Extraer fecha de expiración
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
