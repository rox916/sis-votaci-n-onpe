package com.votos.sistemavotacion.controller;

import com.votos.sistemavotacion.model.Votante;
import com.votos.sistemavotacion.repository.VotanteRepository;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/votantes")

public class VotanteController {
    @Autowired
    private VotanteRepository votanteRepository;

    // DTO para la consulta y login por DNI
    @Data
    public static class DniRequest {
        private String dni;
    }

    // DTO para la actualización de ubicación
    @Data
    public static class UbicacionUpdateRequest {
        private String departamento;
        private String provincia;
        private String distrito;
    }

    // 1. MÉTODO DE CONTROL (CRUD): Listar todos los votantes
    // URL: GET /api/votantes
    @GetMapping
    public List<Votante> getAllVotantes() {
        return votanteRepository.findAll();
    }

    // ----------------------------------------------------
    // MÉTODOS CLAVE PARA EL FLUJO DE VOTACIÓN
    // ----------------------------------------------------

    // 2. VALIDACIÓN/LOGIN: Obtener datos de votante por DNI
    // URL: GET /api/votantes/consulta/{dni}
    @GetMapping("/consulta/{dni}")
    public ResponseEntity<Votante> getVotanteByDni(@PathVariable String dni) {
        return votanteRepository.findByDni(dni)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build()); // 404 si no existe
    }

    // 3. ACTUALIZACIÓN: Actualizar ubicación (departamento, provincia, distrito)
    // URL: PUT /api/votantes/ubicacion/{dni}
    @PutMapping("/ubicacion/{dni}")
    public ResponseEntity<Votante> updateUbicacion(@PathVariable String dni, @RequestBody UbicacionUpdateRequest updateRequest) {
        return votanteRepository.findByDni(dni)
                .map(votanteExistente -> {
                    // Solo actualizamos los campos permitidos
                    votanteExistente.setDepartamento(updateRequest.getDepartamento());
                    votanteExistente.setProvincia(updateRequest.getProvincia());
                    votanteExistente.setDistrito(updateRequest.getDistrito());

                    Votante votanteActualizado = votanteRepository.save(votanteExistente);
                    return ResponseEntity.ok(votanteActualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. FINALIZAR VOTO: Cambiar estado a 'Votó'
    // URL: POST /api/votantes/finalizar/{dni}
    @PostMapping("/finalizar/{dni}")
    public ResponseEntity<Votante> finalizarVoto(@PathVariable String dni) {
        return votanteRepository.findByDni(dni)
                .map(votanteExistente -> {
                    if (!"Votó".equals(votanteExistente.getEstado())) {
                        votanteExistente.setEstado("Votó");
                        votanteExistente.setFechaAcceso(LocalDateTime.now()); // Marca la hora del voto final
                        Votante votanteFinalizado = votanteRepository.save(votanteExistente);
                        return ResponseEntity.ok(votanteFinalizado);
                    }
                    // Si ya votó, retorna 409 Conflict
                    return ResponseEntity.status(HttpStatus.CONFLICT).body(votanteExistente);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
