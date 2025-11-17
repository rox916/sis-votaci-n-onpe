package com.votos.sistemavotacion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Anotaciones de Lombok
@Data // Genera getters, setters, toString, equals y hashCode
@NoArgsConstructor // Genera un constructor sin argumentos
@AllArgsConstructor // Genera un constructor con todos los argumentos

// Anotaciones de JPA
@Entity // Indica que esta clase es una tabla en la base de datos
@Table(name = "administradores") // Mapea esta clase a la tabla 'administradores' en PostgreSQL

public class Administrador {
    @Id // Marca el campo como la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID autoincremental
    @Column(name = "id_admin")
    private Integer idAdmin; // Usamos camelCase

    @Column(name = "nombre", length = 100, nullable = false)
    private String nombre;

    @Column(name = "email", length = 150, unique = true)
    private String email;

    @Column(name = "contrasena", length = 255, nullable = false)
    private String contrasena; // NOTA: Almacenará el HASH (BCrypt)

    @Column(name = "rol", length = 50, nullable = false)
    private String rol; // Ejemplo: "Super Admin", "Admin Regional"

    @Column(name = "region_acceso", length = 255, nullable = false)
    private String regionAcceso; // Ejemplo: "Todos" o "Lima, Arequipa"
}
