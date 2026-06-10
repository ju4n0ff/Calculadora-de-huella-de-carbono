package com.simulador.calculadora.controller;

import com.simulador.calculadora.model.Tarifa;
import com.simulador.calculadora.service.TarifaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/tarifas")
public class TarifaController {

    @Autowired
    private TarifaService tarifaService;

    @GetMapping
    public ResponseEntity<List<Tarifa>> listarTodas() {
        return ResponseEntity.ok(tarifaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarifa> buscarPorId(@PathVariable Integer id) {
        return tarifaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Tarifa> crear(@RequestBody Tarifa tarifa) {
        Tarifa nueva = tarifaService.guardar(tarifa);
        return new ResponseEntity<>(nueva, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarifa> actualizar(@PathVariable Integer id, @RequestBody Tarifa tarifa) {
        return ResponseEntity.ok(tarifaService.actualizar(id, tarifa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        tarifaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
