package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Tarifa;
import com.simulador.calculadora.repository.TarifaRepository;
import com.simulador.calculadora.service.TarifaService;
import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/** Implementación del servicio de Tarifa con logging y validación. */
@Service
public class TarifaServiceImpl implements TarifaService {

    private static final Logger log = LoggerFactory.getLogger(TarifaServiceImpl.class);

    @Autowired
    private TarifaRepository tarifaRepository;

    @Override
    public List<Tarifa> listarTodas() {
        log.debug("Listando todas las tarifas");
        return tarifaRepository.findAll();
    }

    @Override
    public Optional<Tarifa> buscarPorId(Integer id) {
        Preconditions.checkNotNull(id, "El ID de la tarifa no puede ser nulo");
        log.debug("Buscando tarifa por ID: {}", id);
        return tarifaRepository.findById(id);
    }

    @Override
    public Tarifa guardar(Tarifa tarifa) {
        Preconditions.checkNotNull(tarifa, "La tarifa no puede ser nula");
        Preconditions.checkArgument(StringUtils.isNotBlank(tarifa.getNombre()), "El nombre de la tarifa es obligatorio");
        Preconditions.checkArgument(tarifa.getPrecioKwh() != null && tarifa.getPrecioKwh() > 0,
                "El precio por kWh debe ser mayor a cero");
        log.info("Guardando tarifa: {} (S/ {})", tarifa.getNombre(), tarifa.getPrecioKwh());
        return tarifaRepository.save(tarifa);
    }

    @Override
    public Tarifa actualizar(Integer id, Tarifa datos) {
        Preconditions.checkNotNull(id, "El ID de la tarifa no puede ser nulo");
        Preconditions.checkNotNull(datos, "Los datos actualizados no pueden ser nulos");
        log.info("Actualizando tarifa ID: {}", id);
        return tarifaRepository.findById(id)
                .map(t -> {
                    t.setNombre(datos.getNombre());
                    t.setPrecioKwh(datos.getPrecioKwh());
                    t.setDescripcion(datos.getDescripcion());
                    return tarifaRepository.save(t);
                })
                .orElseThrow(() -> new RuntimeException("Tarifa no encontrada con ID: " + id));
    }

    @Override
    public void eliminar(Integer id) {
        Preconditions.checkNotNull(id, "El ID de la tarifa no puede ser nulo");
        if (!tarifaRepository.existsById(id)) {
            throw new RuntimeException("Tarifa no encontrada con ID: " + id);
        }
        log.warn("Eliminando tarifa ID: {}", id);
        tarifaRepository.deleteById(id);
    }
}
