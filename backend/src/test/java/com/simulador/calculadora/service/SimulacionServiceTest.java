package com.simulador.calculadora.service;

import com.simulador.calculadora.model.SimulacionConsumo;
import com.simulador.calculadora.model.Usuario;
import com.simulador.calculadora.model.Rol;
import com.simulador.calculadora.repository.SimulacionConsumoRepository;
import com.simulador.calculadora.service.Impl.SimulacionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SimulacionServiceTest {

    @Mock
    private SimulacionConsumoRepository simulacionRepository;

    @InjectMocks
    private SimulacionServiceImpl simulacionService;

    private SimulacionConsumo simulacion;

    @BeforeEach
    void setUp() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setNombre("Admin");
        usuario.setEmail("admin@test.com");
        usuario.setRol(Rol.ADMINISTRADOR);
        usuario.setActivo(true);

        simulacion = new SimulacionConsumo();
        simulacion.setId(1L);
        simulacion.setUsuario(usuario);
        simulacion.setTipoPersona("natural");
        simulacion.setTipoMedidor("monofasico");
        simulacion.setCargaKw(5.5);
        simulacion.setEnergiaKwh(120.0);
        simulacion.setCostoSoles(60.0);
        simulacion.setCo2Kg(36.0);
    }

    @Test
    void deberiaGuardarSimulacion() {
        when(simulacionRepository.save(simulacion)).thenReturn(simulacion);
        SimulacionConsumo resultado = simulacionService.guardarSimulacion(simulacion);
        assertNotNull(resultado);
        assertEquals(5.5, resultado.getCargaKw());
        verify(simulacionRepository).save(simulacion);
    }

    @Test
    void deberiaLanzarExcepcionSiCargaKwEsCero() {
        simulacion.setCargaKw(0.0);
        assertThrows(IllegalArgumentException.class, () -> simulacionService.guardarSimulacion(simulacion));
    }

    @Test
    void deberiaLanzarExcepcionSiTipoPersonaEsVacio() {
        simulacion.setTipoPersona("");
        assertThrows(IllegalArgumentException.class, () -> simulacionService.guardarSimulacion(simulacion));
    }

    @Test
    void deberiaLanzarExcepcionSiSimulacionEsNula() {
        assertThrows(NullPointerException.class, () -> simulacionService.guardarSimulacion(null));
    }

    @Test
    void deberiaObtenerTodasLasSimulaciones() {
        when(simulacionRepository.findAll()).thenReturn(List.of(simulacion));
        List<SimulacionConsumo> resultado = simulacionService.obtenerTodas();
        assertEquals(1, resultado.size());
        verify(simulacionRepository).findAll();
    }
}
