package com.simulador.calculadora.controller;

import com.simulador.calculadora.model.Suministro;
import com.simulador.calculadora.service.SuministroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/suministros")
@CrossOrigin(origins = "*")
public class SuministroController {

    @Autowired
    private SuministroService suministroService;

    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<List<Suministro>> obtenerPorCliente(@PathVariable Integer idCliente) {
        List<Suministro> lista = suministroService.obtenerPorClienteId(idCliente);
        return ResponseEntity.ok(lista);
    }
}
