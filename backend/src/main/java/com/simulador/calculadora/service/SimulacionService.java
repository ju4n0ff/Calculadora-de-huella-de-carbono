package com.simulador.calculadora.service;

import com.simulador.calculadora.model.SimulacionConsumo;
import java.util.List;

/** Servicio que define las operaciones de negocio para las simulaciones de consumo. */
public interface SimulacionService {

    /** Guarda una nueva simulación de consumo energético. */
    SimulacionConsumo guardarSimulacion(SimulacionConsumo simulacion);

    /** Retorna el historial completo de simulaciones. */
    List<SimulacionConsumo> obtenerTodas();
}
