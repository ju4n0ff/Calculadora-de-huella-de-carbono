package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Consumo;
import java.util.List;

/** Servicio que define las operaciones de negocio para la entidad Consumo. */
public interface ConsumoService {

    /** Guarda un nuevo registro de consumo eléctrico. */
    Consumo guardar(Consumo consumo);

    /** Retorna todos los consumos registrados. */
    List<Consumo> obtenerTodas();

    /** Retorna los consumos asociados a un cliente específico. */
    List<Consumo> obtenerPorClienteId(Integer idCliente);
}
