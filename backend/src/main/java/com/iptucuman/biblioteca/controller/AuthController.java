package com.iptucuman.biblioteca.controller;

import com.iptucuman.biblioteca.dto.AuthRequest;
import com.iptucuman.biblioteca.dto.AuthResponse;
import com.iptucuman.biblioteca.dto.UsuarioRegistroConPasswordDTO;
import com.iptucuman.biblioteca.dto.UsuarioDetalleDTO;
import com.iptucuman.biblioteca.service.JwtService;
import com.iptucuman.biblioteca.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final UsuarioService usuarioService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UserDetailsService userDetailsService,
                          UsuarioService usuarioService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            UserDetails user = userDetailsService.loadUserByUsername(request.email());

            // Obtener el usuario desde la base de datos
            var usuario = usuarioService.buscarPorEmail(request.email())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            Integer userId = usuario.getIdUsuario();
            Boolean primerLogin = usuario.getPrimerLogin();

            // Generar token incluyendo el userId
            String token = jwtService.generateTokenWithUserId(user, userId);

            return ResponseEntity.ok(new AuthResponse(token, primerLogin));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        } catch (Exception e) {
            throw e;
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid UsuarioRegistroConPasswordDTO dto) {
        try {
            // Verificar si el email ya existe
            if (usuarioService.existePorEmail(dto.email())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("El email ya está registrado.");
            }

            // Registrar el usuario con password encriptado
            UsuarioDetalleDTO nuevoUsuario = usuarioService.registrarUsuarioConPassword(dto);

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al registrar usuario: " + e.getMessage());
        }
    }

}
