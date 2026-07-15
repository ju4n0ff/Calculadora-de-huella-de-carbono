package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.SimulacionConsumo;
import com.simulador.calculadora.repository.SimulacionConsumoRepository;
import com.simulador.calculadora.service.SimulacionService;
import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/** Implementación del servicio de Simulación con validación y logging. */
@Service
public class SimulacionServiceImpl implements SimulacionService {

    private static final Logger log = LoggerFactory.getLogger(SimulacionServiceImpl.class);

    @Autowired
    private SimulacionConsumoRepository simulacionRepository;

    @Override
    @Transactional
    public SimulacionConsumo guardarSimulacion(SimulacionConsumo simulacion) {
        Preconditions.checkNotNull(simulacion, "La simulación no puede ser nula");
        Preconditions.checkArgument(simulacion.getCargaKw() != null && simulacion.getCargaKw() > 0,
                "La potencia de carga debe ser mayor a cero");
        Preconditions.checkArgument(StringUtils.isNotBlank(simulacion.getTipoPersona()),
                "El tipo de persona es obligatorio");
        log.info("Guardando simulación - carga: {} kW, tipo: {}", simulacion.getCargaKw(), simulacion.getTipoPersona());
        return simulacionRepository.save(simulacion);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SimulacionConsumo> obtenerTodas() {
        log.debug("Obteniendo todas las simulaciones");
        return simulacionRepository.findAll();
    }
}
