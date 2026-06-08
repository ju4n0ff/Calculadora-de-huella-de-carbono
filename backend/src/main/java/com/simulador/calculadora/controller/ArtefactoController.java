package com.simulador.calculadora.controller;

import com.simulador.calculadora.model.Artefacto;
import com.simulador.calculadora.service.ArtefactoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/artefactos")
@CrossOrigin(origins = "*")
public class ArtefactoController {

    @Autowired
    private ArtefactoService artefactoService;

    @GetMapping
    public ResponseEntity<List<Artefacto>> listarTodos() {
        return ResponseEntity.ok(artefactoService.obtenerTodos());
    }
}
