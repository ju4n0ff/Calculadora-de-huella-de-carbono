package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Cliente;
import com.simulador.calculadora.model.Tarifa;
import com.simulador.calculadora.repository.ClienteRepository;
import com.simulador.calculadora.repository.TarifaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private TarifaRepository tarifaRepository;

    @InjectMocks
    private ClienteService clienteService;

    private Cliente cliente;

    @BeforeEach
    void setUp() {
        cliente = new Cliente(1, "Juan Pérez", "12345678", "Av. Principal 123", null);
    }

    @Test
    void deberiaListarTodosLosClientes() {
        when(clienteRepository.findAll()).thenReturn(List.of(cliente));
        List<Cliente> resultado = clienteService.listarTodos();
        assertEquals(1, resultado.size());
        verify(clienteRepository).findAll();
    }

    @Test
    void deberiaBuscarClientePorId() {
        when(clienteRepository.findById(1)).thenReturn(Optional.of(cliente));
        Optional<Cliente> resultado = clienteService.buscarPorId(1);
        assertTrue(resultado.isPresent());
        assertEquals("Juan Pérez", resultado.get().getNombre());
    }

    @Test
    void deberiaLanzarExcepcionSiIdEsNulo() {
        assertThrows(NullPointerException.class, () -> clienteService.buscarPorId(null));
    }

    @Test
    void deberiaGuardarCliente() {
        when(clienteRepository.save(cliente)).thenReturn(cliente);
        Cliente resultado = clienteService.guardar(cliente);
        assertNotNull(resultado);
        verify(clienteRepository).save(cliente);
    }

    @Test
    void deberiaLanzarExcepcionSiClienteEsNulo() {
        assertThrows(NullPointerException.class, () -> clienteService.guardar(null));
    }

    @Test
    void deberiaEliminarCliente() {
        when(clienteRepository.existsById(1)).thenReturn(true);
        doNothing().when(clienteRepository).deleteById(1);
        clienteService.eliminar(1);
        verify(clienteRepository).deleteById(1);
    }

    @Test
    void deberiaLanzarExcepcionAlEliminarClienteInexistente() {
        when(clienteRepository.existsById(99)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> clienteService.eliminar(99));
    }
}
