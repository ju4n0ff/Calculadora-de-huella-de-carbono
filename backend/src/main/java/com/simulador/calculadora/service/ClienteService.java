package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Cliente;
import com.simulador.calculadora.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Optional<Cliente> buscarPorId(Integer idCliente) {
        return clienteRepository.findById(idCliente);
    }

    public Optional<Cliente> buscarPorDni(String dni) {
        return clienteRepository.findByDni(dni);
    }

    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    public Cliente actualizar(Integer idCliente, Cliente datosActualizados) {
        return clienteRepository.findById(idCliente)
                .map(cliente -> {
                    cliente.setNombre(datosActualizados.getNombre());
                    cliente.setDireccion(datosActualizados.getDireccion());
                    cliente.setIdTarifa(datosActualizados.getIdTarifa());
                    return clienteRepository.save(cliente);
                })
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
    }

    public void eliminar(Integer idCliente) {
        if (!clienteRepository.existsById(idCliente)) {
            throw new RuntimeException("Cliente no encontrado");
        }
        clienteRepository.deleteById(idCliente);
    }
}