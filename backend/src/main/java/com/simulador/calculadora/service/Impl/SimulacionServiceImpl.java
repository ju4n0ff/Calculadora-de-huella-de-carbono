package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.SimulacionConsumo;
import com.simulador.calculadora.repository.SimulacionConsumoRepository;
import com.simulador.calculadora.service.SimulacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SimulacionServiceImpl implements SimulacionService {

    @Autowired
    private SimulacionConsumoRepository simulacionRepository;

    @Override
    @Transactional
    public SimulacionConsumo guardarSimulacion(SimulacionConsumo simulacion) {
        if (simulacion.getCargaKw() == null || simulacion.getCargaKw() <= 0) {
            throw new IllegalArgumentException("La potencia de carga debe ser mayor a cero.");
        }
        return simulacionRepository.save(simulacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SimulacionConsumo> obtenerTodas() {
        return simulacionRepository.findAll();
    }
}