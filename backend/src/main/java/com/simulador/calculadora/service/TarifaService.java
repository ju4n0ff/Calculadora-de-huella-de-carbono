package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Tarifa;
import java.util.List;
import java.util.Optional;

/** Servicio que define las operaciones de negocio para la entidad Tarifa. */
public interface TarifaService {

    /** Retorna todas las tarifas registradas. */
    List<Tarifa> listarTodas();

    /** Busca una tarifa por su ID. */
    Optional<Tarifa> buscarPorId(Integer id);

    /** Guarda una nueva tarifa. */
    Tarifa guardar(Tarifa tarifa);

    /** Actualiza los datos de una tarifa existente. */
    Tarifa actualizar(Integer id, Tarifa datos);

    /** Elimina una tarifa por su ID. */
    void eliminar(Integer id);
}
