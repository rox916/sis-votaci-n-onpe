package com.votos.sistemavotacion.controller;

import com.votos.sistemavotacion.model.VotoEmitido;
import com.votos.sistemavotacion.model.Votante;
import com.votos.sistemavotacion.model.Candidato;
import com.votos.sistemavotacion.model.PartidoPolitico;
import com.votos.sistemavotacion.repository.VotoEmitidoRepository;
import com.votos.sistemavotacion.repository.VotanteRepository;
import com.votos.sistemavotacion.repository.CandidatoRepository;
import com.votos.sistemavotacion.repository.PartidoPoliticoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/votos")
public class VotoController {

    @Autowired
    private VotoEmitidoRepository votoEmitidoRepository;

    @Autowired
    private VotanteRepository votanteRepository;

    @Autowired
    private CandidatoRepository candidatoRepository;

    @Autowired
    private PartidoPoliticoRepository partidoPoliticoRepository;

    /**
     * Registra un voto individual (Presidente, Congresista, Parlamentario Andino)
     *
     * Body esperado:
     * {
     *   "dniVotante": "12345678",
     *   "idCandidato": 1,              // número del candidato, o 0 para voto nulo
     *   "cargoVotado": "Presidente"    // "Presidente", "Congresista", "Parlamentario Andino"
     * }
     *
     * @param votoRequest DTO con los datos del voto
     * @return ResponseEntity con resultado del registro
     */
    @PostMapping("/registrar")
    public ResponseEntity<Map<String, Object>> registrarVoto(@RequestBody VotoRequest votoRequest) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. VALIDACIONES BÁSICAS
            if (votoRequest.getDniVotante() == null || votoRequest.getDniVotante().trim().isEmpty()) {
                response.put("error", "DNI del votante es requerido");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (votoRequest.getCargoVotado() == null || votoRequest.getCargoVotado().trim().isEmpty()) {
                response.put("error", "Cargo votado es requerido");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 2. BUSCAR VOTANTE
            Optional<Votante> votanteOpt = votanteRepository.findByDni(votoRequest.getDniVotante());
            if (votanteOpt.isEmpty()) {
                response.put("error", "Votante no encontrado con DNI: " + votoRequest.getDniVotante());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            Votante votante = votanteOpt.get();

            // 3. PROCESAR CANDIDATO: Si es 0 → voto nulo; si > 0 → validar candidato
            Integer idCandidato = votoRequest.getIdCandidato();
            Candidato candidato = null;
            String nombreCandidato = null;
            String nombrePartido = null;
            boolean esVotoNulo = false;

            if (idCandidato == null || idCandidato == 0) {
                // VOTO NULO
                esVotoNulo = true;
                idCandidato = null;
                nombreCandidato = null;
                nombrePartido = null;
                votoRequest.setCargoVotado(null);  // Guardar cargo como null
                System.out.println("✓ VOTO NULO registrado para DNI: " + votoRequest.getDniVotante() +
                        " | Cargo: " + votoRequest.getCargoVotado());
            } else if (idCandidato > 0) {
                // VOTO VÁLIDO: Buscar candidato en BD
                Optional<Candidato> candidatoOpt = candidatoRepository.findById(idCandidato);
                if (candidatoOpt.isEmpty()) {
                    response.put("error", "Candidato no encontrado con ID: " + idCandidato);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                }

                candidato = candidatoOpt.get();
                nombreCandidato = candidato.getNombreCompleto();

                // Obtener nombre del partido si existe
                if (candidato.getIdPartido() != null) {
                    Optional<PartidoPolitico> parOptional = partidoPoliticoRepository.findById(candidato.getIdPartido());
                    if (parOptional.isPresent()) {
                        nombrePartido = parOptional.get().getNombre();
                    }
                }

                System.out.println("✓ VOTO VÁLIDO registrado para DNI: " + votoRequest.getDniVotante() +
                        " | Candidato: " + nombreCandidato +
                        " | Cargo: " + votoRequest.getCargoVotado());
            } else {
                response.put("error", "ID de candidato inválido: " + idCandidato);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 4. CREAR VOTO EMITIDO
            VotoEmitido votoEmitido = new VotoEmitido();
            votoEmitido.setDniVotante(votoRequest.getDniVotante());
            votoEmitido.setIdCandidato(idCandidato); // null si es voto nulo
            votoEmitido.setCandidatoNombre(nombreCandidato);
            votoEmitido.setCargoVotado(votoRequest.getCargoVotado());
            votoEmitido.setPartidoNombre(nombrePartido);

            // Capturar datos de ubicación del votante
            votoEmitido.setDepartamento(votante.getDepartamento());
            votoEmitido.setProvincia(votante.getProvincia());
            votoEmitido.setDistrito(votante.getDistrito());

            votoEmitido.setFechaRegistro(LocalDateTime.now());

            // 5. GUARDAR EN BD
            VotoEmitido votoGuardado = votoEmitidoRepository.save(votoEmitido);

            // 6. RESPUESTA EXITOSA
            response.put("success", true);
            response.put("mensaje", esVotoNulo ? "Voto nulo registrado correctamente" : "Voto registrado correctamente");
            response.put("votoId", votoGuardado.getIdVoto());
            response.put("dniVotante", votoGuardado.getDniVotante());
            response.put("cargoVotado", votoGuardado.getCargoVotado());
            response.put("candidato", nombreCandidato);
            response.put("esNulo", esVotoNulo);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.err.println("❌ Error al registrar voto: " + e.getMessage());
            e.printStackTrace();
            response.put("error", "Error interno al registrar voto");
            response.put("details", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * DTO para recibir datos de voto desde el frontend
     */
    public static class VotoRequest {
        private String dniVotante;
        private Integer idCandidato;  // null, 0 (voto nulo), o id válido (> 0)
        private String cargoVotado;

        // Getters y Setters
        public String getDniVotante() {
            return dniVotante;
        }

        public void setDniVotante(String dniVotante) {
            this.dniVotante = dniVotante;
        }

        public Integer getIdCandidato() {
            return idCandidato;
        }

        public void setIdCandidato(Integer idCandidato) {
            this.idCandidato = idCandidato;
        }

        public String getCargoVotado() {
            return cargoVotado;
        }

        public void setCargoVotado(String cargoVotado) {
            this.cargoVotado = cargoVotado;
        }
    }
}