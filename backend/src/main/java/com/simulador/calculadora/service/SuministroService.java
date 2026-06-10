package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Suministro;
import java.util.List;

/** Servicio que define las operaciones de negocio para la entidad Suministro. */
public interface SuministroService {

    /** Retorna todos los suministros registrados. */
    List<Suministro> listarTodos();

    /** Retorna los suministros de un cliente específico. */
    List<Suministro> obtenerPorClienteId(Integer idCliente);

    /** Guarda un nuevo suministro. */
    Suministro guardar(Suministro suministro);

    /** Actualiza el estado de un suministro existente. */
    Suministro actualizarEstado(Integer id, String estado);
}
