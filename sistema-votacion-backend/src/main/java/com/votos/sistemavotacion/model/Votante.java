package com.votos.sistemavotacion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "votantes")

public class Votante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_votante")
    private Integer idVotante;

    @Column(name = "dni", length = 8, nullable = false, unique = true)
    private String dni;

    @Column(name = "nombres", length = 100)
    private String nombres; // Separación del nombre

    @Column(name = "apellidos", length = 100)
    private String apellidos; // Separación del nombre

    @Column(name = "fecha_nac")
    private LocalDate fechaNac; // Usamos LocalDate para la fecha de nacimiento

    @Column(name = "sexo", length = 10)
    private String sexo;

    @Column(name = "departamento", length = 100, nullable = false)
    private String departamento;

    @Column(name = "provincia", length = 100)
    private String provincia;

    @Column(name = "distrito", length = 100)
    private String distrito;

    @Column(name = "estado", length = 20, nullable = false)
    private String estado = "No votó"; // Por defecto

    @Column(name = "fecha_acceso")
    private LocalDateTime fechaAcceso; // Usamos LocalDateTime para la marca de tiempo
}