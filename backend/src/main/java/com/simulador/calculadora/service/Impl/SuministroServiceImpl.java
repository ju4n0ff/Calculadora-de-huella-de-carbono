package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Suministro;
import com.simulador.calculadora.repository.SuministroRepository;
import com.simulador.calculadora.service.SuministroService;
import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/** Implementación del servicio de Suministro con logging y validación. */
@Service
public class SuministroServiceImpl implements SuministroService {

    private static final Logger log = LoggerFactory.getLogger(SuministroServiceImpl.class);

    @Autowired
    private SuministroRepository suministroRepository;

    @Override
    public List<Suministro> listarTodos() {
        log.debug("Listando todos los suministros");
        return suministroRepository.findAll();
    }

    @Override
    public List<Suministro> obtenerPorClienteId(Integer idCliente) {
        Preconditions.checkNotNull(idCliente, "El ID del cliente no puede ser nulo");
        log.debug("Obteniendo suministros del cliente ID: {}", idCliente);
        return suministroRepository.findByClienteIdCliente(idCliente);
    }

    @Override
    public Suministro guardar(Suministro suministro) {
        Preconditions.checkNotNull(suministro, "El suministro no puede ser nulo");
        Preconditions.checkArgument(StringUtils.isNotBlank(suministro.getCodigoMedidor()),
                "El código del medidor es obligatorio");
        log.info("Guardando suministro con medidor: {}", suministro.getCodigoMedidor());
        return suministroRepository.save(suministro);
    }

    @Override
    public Suministro actualizarEstado(Integer id, String estado) {
        Preconditions.checkNotNull(id, "El ID del suministro no puede ser nulo");
        Preconditions.checkArgument(StringUtils.isNotBlank(estado), "El estado no puede estar vacío");
        log.info("Actualizando estado del suministro ID: {} a {}", id, estado);
        return suministroRepository.findById(id)
                .map(s -> {
                    s.setEstado(estado);
                    return suministroRepository.save(s);
                })
                .orElseThrow(() -> new RuntimeException("Suministro no encontrado con ID: " + id));
    }
}
