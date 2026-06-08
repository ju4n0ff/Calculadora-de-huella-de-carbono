package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Suministro;
import java.util.List;

public interface SuministroService {
    List<Suministro> listarTodos();
    List<Suministro> obtenerPorClienteId(Integer idCliente);
    Suministro guardar(Suministro suministro);
    Suministro actualizarEstado(Integer id, String estado);
}
