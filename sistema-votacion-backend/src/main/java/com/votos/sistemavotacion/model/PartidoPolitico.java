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
@Table(name = "partidos_politicos") // Mapea esta clase a la tabla 'partidos_politicos' en PostgreSQL

public class PartidoPolitico {
    @Id // Marca el campo como la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID autoincremental (SERIAL en Postgres)
    @Column(name = "id_partido") // Mapea el campo a la columna 'id_partido'
    private Integer idPartido; // Usamos camelCase

    @Column(name = "nombre", length = 100, nullable = false, unique = true)
    private String nombre;

    @Column(name = "simbolo", length = 255) // URL o ruta del símbolo
    private String simbolo;
}
