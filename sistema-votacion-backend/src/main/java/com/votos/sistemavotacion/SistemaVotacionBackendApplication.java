package com.votos.sistemavotacion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@SpringBootApplication
public class SistemaVotacionBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(SistemaVotacionBackendApplication.class, args);
    }

    // Este método crea un objeto que podemos inyectar en cualquier parte
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        // BCrypt es el estándar para hashear contraseñas de forma segura
        return new BCryptPasswordEncoder();
    }
}
