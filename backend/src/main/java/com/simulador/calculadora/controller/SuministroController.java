package com.simulador.calculadora.controller;

import com.simulador.calculadora.model.Suministro;
import com.simulador.calculadora.service.SuministroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/suministros")
public class SuministroController {

    @Autowired
    private SuministroService suministroService;

    @GetMapping
    public ResponseEntity<List<Suministro>> listarTodos() {
        return ResponseEntity.ok(suministroService.listarTodos());
    }

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Suministro>> obtenerPorCliente(@PathVariable Integer idCliente) {
        List<Suministro> lista = suministroService.obtenerPorClienteId(idCliente);
        return ResponseEntity.ok(lista);
    }

    @PostMapping
    public ResponseEntity<Suministro> crear(@RequestBody Suministro suministro) {
        if (suministro.getEstado() == null) {
            suministro.setEstado("pendiente");
        }
        Suministro nuevo = suministroService.guardar(suministro);
        return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Suministro> actualizarEstado(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        try {
            String estado = body.get("estado");
            return ResponseEntity.ok(suministroService.actualizarEstado(id, estado));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
