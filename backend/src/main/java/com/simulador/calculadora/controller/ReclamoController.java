package com.simulador.calculadora.controller;

import com.simulador.calculadora.model.Reclamo;
import com.simulador.calculadora.service.ReclamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/reclamos")
public class ReclamoController {

    @Autowired
    private ReclamoService reclamoService;

    @GetMapping
    public ResponseEntity<List<Reclamo>> listarTodos() {
        return ResponseEntity.ok(reclamoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reclamo> buscarPorId(@PathVariable Integer id) {
        return reclamoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Reclamo>> listarPorCliente(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(reclamoService.obtenerPorClienteId(idCliente));
    }

    @PostMapping
    public ResponseEntity<Reclamo> crear(@RequestBody Reclamo reclamo) {
        if (reclamo.getFecha() == null) {
            reclamo.setFecha(java.time.LocalDate.now());
        }
        if (reclamo.getEstado() == null) {
            reclamo.setEstado("pendiente");
        }
        Reclamo nuevo = reclamoService.guardar(reclamo);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/responder")
    public ResponseEntity<?> responder(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        try {
            String respuesta = (String) body.get("respuesta");
            Integer idAdmin = Integer.valueOf(body.get("idAdministrador").toString());
            String nuevoEstado = (String) body.getOrDefault("estado", "resuelto");
            Reclamo actualizado = reclamoService.responder(id, respuesta, idAdmin, nuevoEstado);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
