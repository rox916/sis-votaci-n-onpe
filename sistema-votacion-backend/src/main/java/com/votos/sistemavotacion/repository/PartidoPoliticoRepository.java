package com.votos.sistemavotacion.repository;

import com.votos.sistemavotacion.model.PartidoPolitico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// La interfaz JpaRepository proporciona todos los métodos CRUD básicos
// <Tipo de Entidad, Tipo de la Clave Primaria>
@Repository
public interface PartidoPoliticoRepository extends JpaRepository<PartidoPolitico, Integer> {
    // Aquí no necesitamos agregar código, JpaRepository hace el trabajo por nosotros.
}