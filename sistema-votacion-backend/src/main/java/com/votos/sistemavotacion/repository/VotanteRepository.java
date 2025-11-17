package com.votos.sistemavotacion.repository;

import com.votos.sistemavotacion.model.Votante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VotanteRepository extends JpaRepository<Votante, Integer> {

    // Método clave para el login: buscar un votante por su DNI.
    Optional<Votante> findByDni(String dni);
}