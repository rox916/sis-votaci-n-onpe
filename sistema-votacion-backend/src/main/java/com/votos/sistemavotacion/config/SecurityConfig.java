package com.votos.sistemavotacion.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS PRIMERO
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Deshabilitar CSRF
                .csrf(csrf -> csrf.disable())

                // Sesión STATELESS
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Autorización
                .authorizeHttpRequests(authorize -> authorize
                        .anyRequest().permitAll()  // PERMITIR TODO POR AHORA
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Obtener origen permitido desde variable de entorno o usar localhost por defecto
        String allowedOrigin = System.getenv("FRONTEND_URL");
        if (allowedOrigin != null && !allowedOrigin.isEmpty()) {
            config.setAllowedOrigins(Arrays.asList(
                    allowedOrigin,
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:3000"
            ));
        } else {
            config.setAllowedOrigins(Arrays.asList(
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "http://127.0.0.1:5173",
                    "http://127.0.0.1:3000",
                    "*" // Permitir todos en desarrollo/producción si no se especifica
            ));
        }

        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Content-Type", "Authorization", "X-Requested-With", "Accept"));
        config.setAllowCredentials(false);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
