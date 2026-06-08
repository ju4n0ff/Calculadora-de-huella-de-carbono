package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Administrador;
import com.simulador.calculadora.model.Reclamo;
import com.simulador.calculadora.repository.AdministradorRepository;
import com.simulador.calculadora.repository.ReclamoRepository;
import com.simulador.calculadora.service.ReclamoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ReclamoServiceImpl implements ReclamoService {

    @Autowired
    private ReclamoRepository reclamoRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Override
    public List<Reclamo> listarTodos() {
        return reclamoRepository.findAllByOrderByFechaDesc();
    }

    @Override
    public Optional<Reclamo> buscarPorId(Integer id) {
        return reclamoRepository.findById(id);
    }

    @Override
    public List<Reclamo> obtenerPorClienteId(Integer idCliente) {
        return reclamoRepository.findByClienteIdClienteOrderByFechaDesc(idCliente);
    }

    @Override
    public Reclamo guardar(Reclamo reclamo) {
        return reclamoRepository.save(reclamo);
    }

    @Override
    public Reclamo responder(Integer id, String respuesta, Integer idAdmin) {
        return reclamoRepository.findById(id)
                .map(r -> {
                    r.setRespuestaAdmin(respuesta);
                    r.setEstado("respondido");
                    Administrador admin = new Administrador();
                    admin.setIdAdministrador(idAdmin);
                    r.setAdministrador(admin);
                    return reclamoRepository.save(r);
                })
                .orElseThrow(() -> new RuntimeException("Reclamo no encontrado"));
    }
}
