package com.votos.sistemavotacion.controller;

import com.votos.sistemavotacion.model.Candidato;
import com.votos.sistemavotacion.model.PartidoPolitico;
import com.votos.sistemavotacion.repository.CandidatoRepository;
import com.votos.sistemavotacion.repository.PartidoPoliticoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/candidatos")
public class CandidatoController {

    @Autowired
    private CandidatoRepository candidatoRepository;

    @Autowired
    private PartidoPoliticoRepository partidoPoliticoRepository;

    /**
     * Enriquece un candidato con datos de su partido político
     */
    private Map<String, Object> enriquecerCandidato(Candidato candidato) {
        Map<String, Object> resultado = convertirCandidatoAMapa(candidato);

        // Obtener datos del partido si existe
        if (candidato.getIdPartido() != null) {
            Optional<PartidoPolitico> parOptional = partidoPoliticoRepository.findById(candidato.getIdPartido());
            if (parOptional.isPresent()) {
                PartidoPolitico partido = parOptional.get();
                resultado.put("partidoNombre", partido.getNombre());
                resultado.put("partidoSimbolo", partido.getSimbolo());
            } else {
                resultado.put("partidoNombre", "Sin partido");
                resultado.put("partidoSimbolo", "");
            }
        } else {
            resultado.put("partidoNombre", "Sin partido");
            resultado.put("partidoSimbolo", "");
        }

        return resultado;
    }

    /**
     * Convierte un candidato a un mapa de datos (para compatibilidad JSON)
     * CORREGIDO: Usa HashMap en lugar de Map.ofEntries para aceptar null values
     */
    private Map<String, Object> convertirCandidatoAMapa(Candidato candidato) {
        Map<String, Object> mapa = new HashMap<>();
        mapa.put("idCandidato", candidato.getIdCandidato());
        mapa.put("idPartido", candidato.getIdPartido());
        mapa.put("nombreCompleto", candidato.getNombreCompleto());
        mapa.put("biografia", candidato.getBiografia() != null ? candidato.getBiografia() : "");
        mapa.put("propuestas", candidato.getPropuestas() != null ? candidato.getPropuestas() : new ArrayList<>());
        mapa.put("cargo", candidato.getCargo());
        mapa.put("distrito", candidato.getDistrito() != null ? candidato.getDistrito() : "");
        mapa.put("foto", candidato.getFoto() != null ? candidato.getFoto() : "");
        mapa.put("estado", candidato.getEstado());
        return mapa;
    }

    /**
     * Endpoint para Presidentes y Vicepresidentes
     * URL: /api/candidatos/presidencial
     * Retorna candidatos ENRIQUECIDOS con datos del partido
     */
    @GetMapping("/presidencial")
    public ResponseEntity<List<Map<String, Object>>> obtenerPresidenciales() {
        List<String> cargos = Arrays.asList("Presidente", "Vicepresidente");
        List<Candidato> listaCandidatos = candidatoRepository.findByCargoIn(cargos);

        // Enriquecer cada candidato con datos del partido
        List<Map<String, Object>> candidatosEnriquecidos = listaCandidatos.stream()
                .map(this::enriquecerCandidato)
                .collect(Collectors.toList());

        return ResponseEntity.ok(candidatosEnriquecidos);
    }

    /**
     * Endpoint para Congresistas
     * URL: /api/candidatos/congresistas
     * Retorna candidatos ENRIQUECIDOS con datos del partido
     */
    @GetMapping("/congresistas")
    public ResponseEntity<List<Map<String, Object>>> obtenerCongresistas() {
        List<String> cargos = Arrays.asList("Congresista");
        List<Candidato> listaCandidatos = candidatoRepository.findByCargoIn(cargos);

        // Enriquecer cada candidato con datos del partido
        List<Map<String, Object>> candidatosEnriquecidos = listaCandidatos.stream()
                .map(this::enriquecerCandidato)
                .collect(Collectors.toList());

        return ResponseEntity.ok(candidatosEnriquecidos);
    }

    /**
     * Endpoint para Parlamentarios Andinos
     * URL: /api/candidatos/andinos
     * Retorna candidatos ENRIQUECIDOS con datos del partido
     */
    @GetMapping("/andinos")
    public ResponseEntity<List<Map<String, Object>>> obtenerParlamentariosAndinos() {
        List<String> cargos = Arrays.asList("Parlamentario Andino");
        List<Candidato> listaCandidatos = candidatoRepository.findByCargoIn(cargos);

        // Enriquecer cada candidato con datos del partido
        List<Map<String, Object>> candidatosEnriquecidos = listaCandidatos.stream()
                .map(this::enriquecerCandidato)
                .collect(Collectors.toList());

        return ResponseEntity.ok(candidatosEnriquecidos);
    }

    /**
     * Obtener todos los candidatos
     * URL: /api/candidatos
     */
    @GetMapping
    public List<Candidato> getAllCandidatos() {
        return candidatoRepository.findAll();
    }

    /**
     * Crear nuevo candidato
     * URL: /api/candidatos (POST)
     */
    @PostMapping
    public ResponseEntity<Candidato> crearCandidato(@RequestBody Candidato candidato) {
        Candidato nuevoCandidato = candidatoRepository.save(candidato);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoCandidato);
    }

    /**
     * Actualizar candidato existente
     * URL: /api/candidatos/{id} (PUT)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Candidato> actualizarCandidato(
            @PathVariable Integer id,
            @RequestBody Candidato detallesCandidato) {
        return candidatoRepository.findById(id)
                .map(candidatoExistente -> {
                    candidatoExistente.setIdPartido(detallesCandidato.getIdPartido());
                    candidatoExistente.setNombreCompleto(detallesCandidato.getNombreCompleto());
                    candidatoExistente.setBiografia(detallesCandidato.getBiografia());
                    candidatoExistente.setPropuestas(detallesCandidato.getPropuestas());
                    candidatoExistente.setCargo(detallesCandidato.getCargo());
                    candidatoExistente.setDistrito(detallesCandidato.getDistrito());
                    candidatoExistente.setFoto(detallesCandidato.getFoto());
                    candidatoExistente.setEstado(detallesCandidato.getEstado());

                    Candidato candidatoActualizado = candidatoRepository.save(candidatoExistente);
                    return ResponseEntity.ok(candidatoActualizado);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Eliminar candidato
     * URL: /api/candidatos/{id} (DELETE)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarCandidato(@PathVariable Integer id) {
        return candidatoRepository.findById(id)
                .map(candidato -> {
                    candidatoRepository.delete(candidato);
                    return ResponseEntity.noContent().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
