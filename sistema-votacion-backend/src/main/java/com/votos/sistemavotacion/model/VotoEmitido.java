package com.votos.sistemavotacion.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "votos_emitidos")
public class VotoEmitido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_voto")
    private Integer idVoto;

    @Column(name = "dni_votante", length = 8, nullable = false)
    private String dniVotante;

    @Column(name = "id_candidato", nullable = true)
    private Integer idCandidato;

    @Column(name = "candidato_nombre", length = 150, nullable = true)
    private String candidatoNombre;

    @Column(name = "cargo_votado", length = 50, nullable = true)
    private String cargoVotado;

    @Column(name = "partido_nombre", length = 100, nullable = true)
    private String partidoNombre;

    @Column(name = "departamento", length = 100)
    private String departamento;

    @Column(name = "provincia", length = 100)
    private String provincia;

    @Column(name = "distrito", length = 100)
    private String distrito;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro = LocalDateTime.now();
}