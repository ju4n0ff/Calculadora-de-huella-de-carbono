package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Artefacto;
import com.simulador.calculadora.repository.ArtefactoRepository;
import com.simulador.calculadora.service.ArtefactoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ArtefactoServiceImpl implements ArtefactoService {

    @Autowired
    private ArtefactoRepository artefactoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Artefacto> obtenerTodos() {
        return artefactoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Artefacto> buscarPorId(Long id) {
        return artefactoRepository.findById(id);
    }

    @Override
    @Transactional
    public Artefacto guardarArtefacto(Artefacto artefacto) {
        if (artefacto.getWattsBase() == null || artefacto.getWattsBase() <= 0) {
            throw new IllegalArgumentException("Los Watts base del artefacto deben ser mayores a cero.");
        }
        return artefactoRepository.save(artefacto);
    }

    @Override
    @Transactional
    public void eliminarArtefacto(Long id) {
        artefactoRepository.deleteById(id);
    }
}