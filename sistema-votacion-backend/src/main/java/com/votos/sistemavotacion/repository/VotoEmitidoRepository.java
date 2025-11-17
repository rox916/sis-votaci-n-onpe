package com.votos.sistemavotacion.repository;

import com.votos.sistemavotacion.model.VotoEmitido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotoEmitidoRepository extends JpaRepository<VotoEmitido, Integer> {
    // Aquí podemos añadir métodos para contar votos o buscar por DNI, etc.
}