package com.votos.sistemavotacion.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

// Anotaciones de Lombok
@Data // Genera getters, setters, toString, equals y hashCode
@NoArgsConstructor // Genera un constructor sin argumentos
@AllArgsConstructor // Genera un constructor con todos los argumentos

// Anotaciones de JPA
@Entity // Indica que esta clase es una tabla en la base de datos
@Table(name = "candidatos") // Mapea esta clase a la tabla 'candidatos' en PostgreSQL

public class Candidato {
    @Id // Marca el campo como la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Indica que el ID es autoincremental (SERIAL en Postgres)
    @Column(name = "id_candidato") // Mapea el campo a la columna 'id_candidato'
    private Integer idCandidato;

    @Column(name = "id_partido", nullable = false)
    private Integer idPartido; // Clave foránea a partidos_politicos

    @Column(name = "nombre_completo", length = 150, nullable = false)
    private String nombreCompleto;

    @Column(name = "biografia")
    private String biografia;

    @Column(name = "propuestas")
    private List<String> propuestas;

    @Column(name = "cargo", length = 50, nullable = false)
    // Valores: 'Presidente', 'Vicepresidente', 'Congresista', 'Parlamentario Andino'
    private String cargo;

    @Column(name = "distrito", length = 100)
    private String distrito; // Puede ser null

    @Column(name = "foto", length = 255)
    private String foto;

    @Column(name = "estado", length = 20)
    private String estado;
}
