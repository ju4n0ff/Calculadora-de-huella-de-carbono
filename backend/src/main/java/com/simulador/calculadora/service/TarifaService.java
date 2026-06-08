package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Tarifa;
import java.util.List;
import java.util.Optional;

public interface TarifaService {
    List<Tarifa> listarTodas();
    Optional<Tarifa> buscarPorId(Integer id);
    Tarifa guardar(Tarifa tarifa);
    Tarifa actualizar(Integer id, Tarifa datos);
    void eliminar(Integer id);
}
