package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Consumo;
import com.simulador.calculadora.repository.ConsumoRepository;
import com.simulador.calculadora.service.ConsumoService;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/** Implementación del servicio de Consumo con validación y logging. */
@Service
public class ConsumoServiceImpl implements ConsumoService {

    private static final Logger log = LoggerFactory.getLogger(ConsumoServiceImpl.class);

    @Autowired
    private ConsumoRepository consumoRepository;

    @Override
    public Consumo guardar(Consumo consumo) {
        Preconditions.checkNotNull(consumo, "El consumo no puede ser nulo");
        Preconditions.checkArgument(consumo.getTotalKwh() != null && consumo.getTotalKwh() > 0,
                "El consumo total debe ser mayor a cero");
        Preconditions.checkNotNull(consumo.getCliente(), "El cliente asociado al consumo es obligatorio");
        log.info("Registrando consumo: {} kWh para cliente ID: {}",
                consumo.getTotalKwh(), consumo.getCliente().getIdCliente());
        return consumoRepository.save(consumo);
    }

    @Override
    public List<Consumo> obtenerTodas() {
        log.debug("Obteniendo todos los consumos");
        return consumoRepository.findAllByOrderByFechaDesc();
    }

    @Override
    public List<Consumo> obtenerPorClienteId(Integer idCliente) {
        Preconditions.checkNotNull(idCliente, "El ID del cliente no puede ser nulo");
        log.debug("Obteniendo consumos del cliente ID: {}", idCliente);
        return consumoRepository.findByClienteIdCliente(idCliente);
    }
}
