package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Artefacto;
import java.util.List;
import java.util.Optional;

/** Servicio que define las operaciones de negocio para la entidad Artefacto. */
public interface ArtefactoService {

    /** Retorna todos los artefactos registrados. */
    List<Artefacto> obtenerTodos();

    /** Busca un artefacto por su ID. */
    Optional<Artefacto> buscarPorId(Long id);

    /** Guarda un nuevo artefacto. */
    Artefacto guardarArtefacto(Artefacto artefacto);

    /** Elimina un artefacto por su ID. */
    void eliminarArtefacto(Long id);
}
