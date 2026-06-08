package com.simulador.calculadora.service;

import com.simulador.calculadora.model.SimulacionConsumo;
import java.util.List;

public interface SimulacionService {
    SimulacionConsumo guardarSimulacion(SimulacionConsumo simulacion);
    List<SimulacionConsumo> obtenerTodas();
}