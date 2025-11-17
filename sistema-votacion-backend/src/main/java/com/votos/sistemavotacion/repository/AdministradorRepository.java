package com.votos.sistemavotacion.repository;

import com.votos.sistemavotacion.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {

    // Método personalizado para buscar un administrador por su email.
    // Spring Data JPA genera automáticamente la implementación de este método
    // basado en su nombre. Es crucial para el proceso de Login.
    Optional<Administrador> findByEmail(String email);
}
