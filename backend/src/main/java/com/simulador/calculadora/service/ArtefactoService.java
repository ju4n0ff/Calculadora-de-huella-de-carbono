package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Artefacto;
import java.util.List;
import java.util.Optional;

public interface ArtefactoService {
    List<Artefacto> obtenerTodos();
    Optional<Artefacto> buscarPorId(Long id);
    Artefacto guardarArtefacto(Artefacto artefacto);
    void eliminarArtefacto(Long id);
}