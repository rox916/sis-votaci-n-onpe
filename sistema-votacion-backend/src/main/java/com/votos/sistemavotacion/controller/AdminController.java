package com.votos.sistemavotacion.controller;

import com.votos.sistemavotacion.model.Administrador;
import com.votos.sistemavotacion.repository.AdministradorRepository;
import lombok.Data; // Importamos Lombok Data
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Importamos BCrypt
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/administradores")

public class AdminController {
    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // Inyectamos el componente para verificar contraseñas

    // Clase interna (DTO) para manejar la entrada de login
    @Data // Lombok para getters/setters/constructores del DTO
    public static class LoginRequest {
        private String email;
        private String contrasena;
    }

    // Método para Iniciar Sesión (Validación de Credenciales)
    // URL: POST /api/administradores/login
    @PostMapping("/login")
    public ResponseEntity<String> iniciarSesion(@RequestBody LoginRequest loginRequest) {
        // 1. Buscar al administrador por email
        return administradorRepository.findByEmail(loginRequest.getEmail())
                .map(admin -> {
                    // 2. Verificar la contraseña hasheada
                    // rawPassword (texto plano) vs encodedPassword (hash almacenado en DB)
                    if (passwordEncoder.matches(loginRequest.getContrasena(), admin.getContrasena())) {
                        // ¡Contraseña correcta!
                        // NOTA: Aquí se podría generar un token JWT o iniciar una sesión real (flujo avanzado)
                        return ResponseEntity.ok("Inicio de sesión exitoso. Bienvenido(a), " + admin.getNombre());
                    } else {
                        // Contraseña incorrecta
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas.");
                    }
                })
                // 3. Si el email no se encuentra
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas."));
    }

    // Método para Obtener Datos de un Administrador Específico (Mostrar Perfil)
    // URL: GET /api/administradores/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Administrador> obtenerPerfil(@PathVariable Integer id) {
        // Usamos findById para obtener los datos por ID
        return administradorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Método de utilidad para crear un Admin de prueba con contraseña hasheada
    // Se puede usar una única vez o en el testing para generar el primer usuario.
    @PostMapping("/setup-admin")
    public ResponseEntity<Administrador> setupAdmin(@RequestBody Administrador admin) {
        // La contraseña de entrada es hasheada antes de guardarse.
        String hashedPassword = passwordEncoder.encode(admin.getContrasena());
        admin.setContrasena(hashedPassword);

        Administrador nuevoAdmin = administradorRepository.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoAdmin);
    }
}
