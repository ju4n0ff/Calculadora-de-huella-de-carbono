package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Suministro;
import com.simulador.calculadora.repository.SuministroRepository;
import com.simulador.calculadora.service.SuministroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SuministroServiceImpl implements SuministroService {

    @Autowired
    private SuministroRepository suministroRepository;

    @Override
    public List<Suministro> obtenerPorClienteId(Integer idCliente) {
        return suministroRepository.findByClienteIdCliente(idCliente);
    }

    @Override
    public Suministro guardar(Suministro suministro) {
        return suministroRepository.save(suministro);
    }
}
