package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Administrador;
import com.simulador.calculadora.model.Reclamo;
import com.simulador.calculadora.repository.AdministradorRepository;
import com.simulador.calculadora.repository.ReclamoRepository;
import com.simulador.calculadora.service.ReclamoService;
import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/** Implementación del servicio de Reclamo con logging y validación. */
@Service
public class ReclamoServiceImpl implements ReclamoService {

    private static final Logger log = LoggerFactory.getLogger(ReclamoServiceImpl.class);

    @Autowired
    private ReclamoRepository reclamoRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Override
    public List<Reclamo> listarTodos() {
        log.debug("Listando todos los reclamos");
        return reclamoRepository.findAllByOrderByFechaDesc();
    }

    @Override
    public Optional<Reclamo> buscarPorId(Integer id) {
        Preconditions.checkNotNull(id, "El ID del reclamo no puede ser nulo");
        log.debug("Buscando reclamo por ID: {}", id);
        return reclamoRepository.findById(id);
    }

    @Override
    public List<Reclamo> obtenerPorClienteId(Integer idCliente) {
        Preconditions.checkNotNull(idCliente, "El ID del cliente no puede ser nulo");
        log.debug("Obteniendo reclamos del cliente ID: {}", idCliente);
        return reclamoRepository.findByClienteIdClienteOrderByFechaDesc(idCliente);
    }

    @Override
    public Reclamo guardar(Reclamo reclamo) {
        Preconditions.checkNotNull(reclamo, "El reclamo no puede ser nulo");
        Preconditions.checkArgument(StringUtils.isNotBlank(reclamo.getDescripcion()),
                "La descripción del reclamo es obligatoria");
        log.info("Guardando reclamo del cliente ID: {}", reclamo.getCliente().getIdCliente());
        return reclamoRepository.save(reclamo);
    }

    @Override
    public Reclamo responder(Integer id, String respuesta, Integer idAdmin) {
        Preconditions.checkNotNull(id, "El ID del reclamo no puede ser nulo");
        Preconditions.checkArgument(StringUtils.isNotBlank(respuesta), "La respuesta no puede estar vacía");
        Preconditions.checkNotNull(idAdmin, "El ID del administrador no puede ser nulo");
        log.info("Respondiendo reclamo ID: {} por admin ID: {}", id, idAdmin);
        return reclamoRepository.findById(id)
                .map(r -> {
                    r.setRespuestaAdmin(respuesta);
                    r.setEstado("respondido");
                    Administrador admin = new Administrador();
                    admin.setIdAdministrador(idAdmin);
                    r.setAdministrador(admin);
                    return reclamoRepository.save(r);
                })
                .orElseThrow(() -> new RuntimeException("Reclamo no encontrado con ID: " + id));
    }
}
