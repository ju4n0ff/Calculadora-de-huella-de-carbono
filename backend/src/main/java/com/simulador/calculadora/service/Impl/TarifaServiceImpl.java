package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Tarifa;
import com.simulador.calculadora.repository.TarifaRepository;
import com.simulador.calculadora.service.TarifaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TarifaServiceImpl implements TarifaService {

    @Autowired
    private TarifaRepository tarifaRepository;

    @Override
    public List<Tarifa> listarTodas() {
        return tarifaRepository.findAll();
    }

    @Override
    public Optional<Tarifa> buscarPorId(Integer id) {
        return tarifaRepository.findById(id);
    }

    @Override
    public Tarifa guardar(Tarifa tarifa) {
        return tarifaRepository.save(tarifa);
    }

    @Override
    public Tarifa actualizar(Integer id, Tarifa datos) {
        return tarifaRepository.findById(id)
                .map(t -> {
                    t.setNombre(datos.getNombre());
                    t.setPrecioKwh(datos.getPrecioKwh());
                    t.setDescripcion(datos.getDescripcion());
                    return tarifaRepository.save(t);
                })
                .orElseThrow(() -> new RuntimeException("Tarifa no encontrada"));
    }

    @Override
    public void eliminar(Integer id) {
        if (!tarifaRepository.existsById(id)) {
            throw new RuntimeException("Tarifa no encontrada");
        }
        tarifaRepository.deleteById(id);
    }
}
