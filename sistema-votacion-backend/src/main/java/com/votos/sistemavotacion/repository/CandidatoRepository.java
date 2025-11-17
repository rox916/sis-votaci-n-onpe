package com.votos.sistemavotacion.repository;
import com.votos.sistemavotacion.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository // Indica que esta interfaz es un componente de repositorio
// Extiende JpaRepository para obtener métodos CRUD listos para usar
public interface CandidatoRepository extends JpaRepository<Candidato, Integer> {

    // JPA Query Method (Método de consulta personalizada)
    // Spring Data JPA crea la consulta SQL automáticamente basándose en el nombre del método
    List<Candidato> findByCargoIn(List<String> cargos);

}