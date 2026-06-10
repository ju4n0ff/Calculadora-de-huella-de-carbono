package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Artefacto;
import com.simulador.calculadora.repository.ArtefactoRepository;
import com.simulador.calculadora.service.ArtefactoService;
import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/** Implementación del servicio de Artefacto con logging, validación y seguridad. */
@Service
public class ArtefactoServiceImpl implements ArtefactoService {

    private static final Logger log = LoggerFactory.getLogger(ArtefactoServiceImpl.class);

    @Autowired
    private ArtefactoRepository artefactoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Artefacto> obtenerTodos() {
        log.info("Obteniendo todos los artefactos");
        return artefactoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Artefacto> buscarPorId(Long id) {
        Preconditions.checkNotNull(id, "El ID del artefacto no puede ser nulo");
        log.debug("Buscando artefacto por ID: {}", id);
        return artefactoRepository.findById(id);
    }

    @Override
    @Transactional
    public Artefacto guardarArtefacto(Artefacto artefacto) {
        Preconditions.checkNotNull(artefacto, "El artefacto no puede ser nulo");
        Preconditions.checkArgument(StringUtils.isNotBlank(artefacto.getNombre()), "El nombre del artefacto es obligatorio");
        Preconditions.checkArgument(artefacto.getWattsBase() != null && artefacto.getWattsBase() > 0,
                "Los Watts base del artefacto deben ser mayores a cero");
        log.info("Guardando artefacto: {} ({}W)", artefacto.getNombre(), artefacto.getWattsBase());
        return artefactoRepository.save(artefacto);
    }

    @Override
    @Transactional
    public void eliminarArtefacto(Long id) {
        Preconditions.checkNotNull(id, "El ID del artefacto no puede ser nulo");
        log.warn("Eliminando artefacto ID: {}", id);
        artefactoRepository.deleteById(id);
    }
}
