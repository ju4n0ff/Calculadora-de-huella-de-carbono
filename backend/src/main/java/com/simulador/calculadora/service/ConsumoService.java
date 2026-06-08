package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Consumo;
import java.util.List;

public interface ConsumoService {
    Consumo guardar(Consumo consumo);
    List<Consumo> obtenerTodas();
    List<Consumo> obtenerPorClienteId(Integer idCliente);
}
