package com.simulador.calculadora.controller;

import com.simulador.calculadora.model.Consumo;
import com.simulador.calculadora.service.ConsumoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/consumos")
@CrossOrigin(origins = "*")
public class ConsumoController {

    @Autowired
    private ConsumoService consumoService;

    @PostMapping
    public ResponseEntity<?> registrarConsumo(@RequestBody Consumo consumo) {
        try {
            Consumo nuevo = consumoService.guardar(consumo);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<Consumo>> listarTodos() {
        return ResponseEntity.ok(consumoService.obtenerTodas());
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Consumo>> listarPorCliente(@PathVariable Integer idCliente) {
        return ResponseEntity.ok(consumoService.obtenerPorClienteId(idCliente));
    }
}
