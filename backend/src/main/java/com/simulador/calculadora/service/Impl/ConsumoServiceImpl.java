package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Consumo;
import com.simulador.calculadora.repository.ConsumoRepository;
import com.simulador.calculadora.service.ConsumoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConsumoServiceImpl implements ConsumoService {

    @Autowired
    private ConsumoRepository consumoRepository;

    @Override
    public Consumo guardar(Consumo consumo) {
        if (consumo.getTotalKwh() == null || consumo.getTotalKwh() <= 0) {
            throw new IllegalArgumentException("El consumo total debe ser mayor a cero.");
        }
        return consumoRepository.save(consumo);
    }

    @Override
    public List<Consumo> obtenerTodas() {
        return consumoRepository.findAllByOrderByFechaDesc();
    }

    @Override
    public List<Consumo> obtenerPorClienteId(Integer idCliente) {
        return consumoRepository.findByClienteIdCliente(idCliente);
    }
}
