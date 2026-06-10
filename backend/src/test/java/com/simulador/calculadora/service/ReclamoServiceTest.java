package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Administrador;
import com.simulador.calculadora.model.Cliente;
import com.simulador.calculadora.model.Reclamo;
import com.simulador.calculadora.repository.AdministradorRepository;
import com.simulador.calculadora.repository.ReclamoRepository;
import com.simulador.calculadora.service.Impl.ReclamoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReclamoServiceTest {

    @Mock
    private ReclamoRepository reclamoRepository;

    @Mock
    private AdministradorRepository administradorRepository;

    @InjectMocks
    private ReclamoServiceImpl reclamoService;

    private Reclamo reclamo;
    private Cliente cliente;

    @BeforeEach
    void setUp() {
        cliente = new Cliente(1, "Juan Pérez", "12345678", "Av. Principal 123", 1);
        reclamo = new Reclamo();
        reclamo.setIdReclamo(1);
        reclamo.setCliente(cliente);
        reclamo.setDescripcion("Problema con la facturación");
        reclamo.setFecha(LocalDate.now());
        reclamo.setEstado("pendiente");
    }

    @Test
    void deberiaGuardarReclamo() {
        when(reclamoRepository.save(reclamo)).thenReturn(reclamo);
        Reclamo resultado = reclamoService.guardar(reclamo);
        assertNotNull(resultado);
        assertEquals("Problema con la facturación", resultado.getDescripcion());
        verify(reclamoRepository).save(reclamo);
    }

    @Test
    void deberiaLanzarExcepcionSiDescripcionEsVacia() {
        reclamo.setDescripcion("");
        assertThrows(IllegalArgumentException.class, () -> reclamoService.guardar(reclamo));
    }

    @Test
    void deberiaResponderReclamoComoResuelto() {
        Administrador admin = new Administrador();
        admin.setIdAdministrador(1);

        when(reclamoRepository.findById(1)).thenReturn(Optional.of(reclamo));
        when(reclamoRepository.save(any(Reclamo.class))).thenReturn(reclamo);

        Reclamo resultado = reclamoService.responder(1, "Gracias por su reporte", 1, "resuelto");
        assertEquals("resuelto", resultado.getEstado());
        assertEquals("Gracias por su reporte", resultado.getRespuestaAdmin());
        verify(reclamoRepository).findById(1);
    }

    @Test
    void deberiaResponderReclamoComoEnProceso() {
        Administrador admin = new Administrador();
        admin.setIdAdministrador(1);

        when(reclamoRepository.findById(1)).thenReturn(Optional.of(reclamo));
        when(reclamoRepository.save(any(Reclamo.class))).thenReturn(reclamo);

        Reclamo resultado = reclamoService.responder(1, "Estamos revisando", 1, "en_proceso");
        assertEquals("en_proceso", resultado.getEstado());
        verify(reclamoRepository).findById(1);
    }

    @Test
    void deberiaLanzarExcepcionSiRespuestaEsVacia() {
        assertThrows(IllegalArgumentException.class, () -> reclamoService.responder(1, "", 1, "resuelto"));
    }

    @Test
    void deberiaListarReclamosPorCliente() {
        when(reclamoRepository.findByClienteIdClienteOrderByFechaDesc(1))
                .thenReturn(List.of(reclamo));
        List<Reclamo> resultado = reclamoService.obtenerPorClienteId(1);
        assertEquals(1, resultado.size());
        verify(reclamoRepository).findByClienteIdClienteOrderByFechaDesc(1);
    }
}
