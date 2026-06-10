package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Reclamo;
import java.util.List;
import java.util.Optional;

/** Servicio que define las operaciones de negocio para la entidad Reclamo. */
public interface ReclamoService {

    /** Retorna todos los reclamos registrados. */
    List<Reclamo> listarTodos();

    /** Busca un reclamo por su ID. */
    Optional<Reclamo> buscarPorId(Integer id);

    /** Retorna los reclamos asociados a un cliente específico. */
    List<Reclamo> obtenerPorClienteId(Integer idCliente);

    /** Guarda un nuevo reclamo. */
    Reclamo guardar(Reclamo reclamo);

    /** Responde un reclamo y lo marca como respondido. */
    Reclamo responder(Integer id, String respuesta, Integer idAdmin);
}
