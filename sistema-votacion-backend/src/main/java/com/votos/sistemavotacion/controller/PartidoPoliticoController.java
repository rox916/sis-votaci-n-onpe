package com.votos.sistemavotacion.controller;

import com.votos.sistemavotacion.model.PartidoPolitico;
import com.votos.sistemavotacion.repository.PartidoPoliticoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/partidos") // Prefijo de la URL: /api/partidos
public class PartidoPoliticoController {
    @Autowired
    private PartidoPoliticoRepository partidoPoliticoRepository;

    // 1. READ (GET) - Obtener todos los partidos
    // URL: GET /api/partidos
    @GetMapping
    public List<PartidoPolitico> getAllPartidos() {
        return partidoPoliticoRepository.findAll();
    }

    // 2. READ (GET) - Obtener un partido por ID
    // URL: GET /api/partidos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PartidoPolitico> getPartidoById(@PathVariable Integer id) {
        return partidoPoliticoRepository.findById(id)
                .map(ResponseEntity::ok) // Si existe, retorna 200 OK con el cuerpo
                .orElseGet(() -> ResponseEntity.notFound().build()); // Si no, retorna 404 Not Found
    }

    // 3. CREATE (POST) - Crear un nuevo partido
    // URL: POST /api/partidos
    @PostMapping
    public ResponseEntity<PartidoPolitico> createPartido(@RequestBody PartidoPolitico partido) {
        PartidoPolitico nuevoPartido = partidoPoliticoRepository.save(partido);
        // Retorna 201 Created con el objeto creado
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPartido);
    }

    // 4. UPDATE (PUT) - Actualizar un partido existente
    // URL: PUT /api/partidos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PartidoPolitico> updatePartido(@PathVariable Integer id, @RequestBody PartidoPolitico detallesPartido) {
        return partidoPoliticoRepository.findById(id)
                .map(partidoExistente -> {
                    // Actualizamos los campos con los nuevos detalles
                    partidoExistente.setNombre(detallesPartido.getNombre());
                    partidoExistente.setSimbolo(detallesPartido.getSimbolo());

                    // Guardamos la entidad actualizada
                    PartidoPolitico partidoActualizado = partidoPoliticoRepository.save(partidoExistente);
                    return ResponseEntity.ok(partidoActualizado); // Retorna 200 OK
                })
                .orElseGet(() -> ResponseEntity.notFound().build()); // Si no existe, 404
    }

    // 5. DELETE (DELETE) - Eliminar un partido
    // URL: DELETE /api/partidos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePartido(@PathVariable Integer id) {
        return partidoPoliticoRepository.findById(id)
                .map(partido -> {
                    partidoPoliticoRepository.delete(partido);
                    return ResponseEntity.noContent().build(); // Retorna 204 No Content (eliminación exitosa)
                })
                .orElseGet(() -> ResponseEntity.notFound().build()); // Si no existe, 404
    }
}
