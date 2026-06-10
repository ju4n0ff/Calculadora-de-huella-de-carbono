package com.simulador.calculadora.controller;

import com.simulador.calculadora.model.SimulacionConsumo;
import com.simulador.calculadora.service.SimulacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/simulaciones")
public class SimulacionController {

    @Autowired
    private SimulacionService simulacionService;

    @PostMapping
    public ResponseEntity<?> registrarSimulacion(@RequestBody SimulacionConsumo simulacion) {
        Map<String, Object> respuesta = new HashMap<>();
        try {
            SimulacionConsumo nuevaSimulacion = simulacionService.guardarSimulacion(simulacion);
            respuesta.put("mensaje", "Simulación almacenada correctamente.");
            respuesta.put("data", nuevaSimulacion);
            return new ResponseEntity<>(respuesta, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            respuesta.put("error", e.getMessage());
            return new ResponseEntity<>(respuesta, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            respuesta.put("error", "Error interno en el servidor.");
            return new ResponseEntity<>(respuesta, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<List<SimulacionConsumo>> listarHistorial() {
        List<SimulacionConsumo> lista = simulacionService.obtenerTodas();
        return new ResponseEntity<>(lista, HttpStatus.OK);
    }
}