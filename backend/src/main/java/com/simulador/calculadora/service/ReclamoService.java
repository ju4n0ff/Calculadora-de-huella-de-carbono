package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Reclamo;
import java.util.List;
import java.util.Optional;

public interface ReclamoService {
    List<Reclamo> listarTodos();
    Optional<Reclamo> buscarPorId(Integer id);
    List<Reclamo> obtenerPorClienteId(Integer idCliente);
    Reclamo guardar(Reclamo reclamo);
    Reclamo responder(Integer id, String respuesta, Integer idAdmin);
}
