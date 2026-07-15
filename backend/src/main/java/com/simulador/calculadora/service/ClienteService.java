package com.simulador.calculadora.service;

import com.simulador.calculadora.exception.ResourceNotFoundException;
import com.simulador.calculadora.model.Cliente;
import com.simulador.calculadora.model.Tarifa;
import com.simulador.calculadora.repository.ClienteRepository;
import com.simulador.calculadora.repository.TarifaRepository;
import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/** Servicio que gestiona la lógica de negocio para la entidad Cliente. */
@Service
public class ClienteService {

    private static final Logger log = LoggerFactory.getLogger(ClienteService.class);

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private TarifaRepository tarifaRepository;

    /** Retorna todos los clientes registrados. */
    public List<Cliente> listarTodos() {
        log.info("Listando todos los clientes");
        return clienteRepository.findAll();
    }

    /** Busca un cliente por su ID. */
    public Optional<Cliente> buscarPorId(Integer idCliente) {
        Preconditions.checkNotNull(idCliente, "El ID del cliente no puede ser nulo");
        log.debug("Buscando cliente por ID: {}", idCliente);
        return clienteRepository.findById(idCliente);
    }

    /** Busca un cliente por su número de DNI. */
    public Optional<Cliente> buscarPorDni(String dni) {
        Preconditions.checkArgument(StringUtils.isNotBlank(dni), "El DNI no puede estar vacío");
        log.debug("Buscando cliente por DNI: {}", dni);
        return clienteRepository.findByDni(dni);
    }

    /** Resuelve la referencia a Tarifa si viene solo con idTarifa. */
    private void resolverTarifa(Cliente cliente) {
        if (cliente.getTarifa() != null && cliente.getTarifa().getIdTarifa() != null) {
            Integer id = cliente.getTarifa().getIdTarifa();
            if (id > 0) {
                Tarifa tarifa = tarifaRepository.findById(id)
                        .orElseThrow(() -> new RuntimeException("Tarifa no encontrada con ID: " + id));
                cliente.setTarifa(tarifa);
            } else {
                cliente.setTarifa(null);
            }
        }
    }

    /** Guarda un nuevo cliente. */
    public Cliente guardar(Cliente cliente) {
        Preconditions.checkNotNull(cliente, "El cliente no puede ser nulo");
        Preconditions.checkArgument(StringUtils.isNotBlank(cliente.getNombre()), "El nombre del cliente es obligatorio");
        resolverTarifa(cliente);
        log.info("Guardando cliente: {}", cliente.getNombre());
        return clienteRepository.save(cliente);
    }

    /** Actualiza los datos de un cliente existente. */
    public Cliente actualizar(Integer idCliente, Cliente datosActualizados) {
        Preconditions.checkNotNull(idCliente, "El ID del cliente no puede ser nulo");
        Preconditions.checkNotNull(datosActualizados, "Los datos actualizados no pueden ser nulos");
        log.info("Actualizando cliente ID: {}", idCliente);
        resolverTarifa(datosActualizados);
        return clienteRepository.findById(idCliente)
                .map(cliente -> {
                    cliente.setNombre(datosActualizados.getNombre());
                    cliente.setDireccion(datosActualizados.getDireccion());
                    cliente.setTarifa(datosActualizados.getTarifa());
                    return clienteRepository.save(cliente);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", idCliente));
    }

    /** Elimina un cliente por su ID. */
    public void eliminar(Integer idCliente) {
        Preconditions.checkNotNull(idCliente, "El ID del cliente no puede ser nulo");
        if (!clienteRepository.existsById(idCliente)) {
            throw new ResourceNotFoundException("Cliente", idCliente);
        }
        log.warn("Eliminando cliente ID: {}", idCliente);
        clienteRepository.deleteById(idCliente);
    }
}
