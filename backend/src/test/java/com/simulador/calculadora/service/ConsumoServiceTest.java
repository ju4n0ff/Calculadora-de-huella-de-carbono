package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Cliente;
import com.simulador.calculadora.model.Consumo;
import com.simulador.calculadora.model.Tarifa;
import com.simulador.calculadora.model.Suministro;
import com.simulador.calculadora.repository.ConsumoRepository;
import com.simulador.calculadora.service.Impl.ConsumoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ConsumoServiceTest {

    @Mock
    private ConsumoRepository consumoRepository;

    @InjectMocks
    private ConsumoServiceImpl consumoService;

    private Consumo consumo;

    @BeforeEach
    void setUp() {
        Cliente cliente = new Cliente(1, "Juan Pérez", "12345678", "Av. Principal 123", null);
        Suministro suministro = new Suministro();
        suministro.setIdSuministro(1);

        consumo = new Consumo();
        consumo.setIdConsumo(1);
        consumo.setCliente(cliente);
        consumo.setSuministro(suministro);
        consumo.setTotalKwh(150.0);
        consumo.setCostoTotal(75.0);
        consumo.setHuellaCarbono(45.0);
        consumo.setFecha(LocalDate.now());
    }

    @Test
    void deberiaGuardarConsumo() {
        when(consumoRepository.save(consumo)).thenReturn(consumo);
        Consumo resultado = consumoService.guardar(consumo);
        assertNotNull(resultado);
        assertEquals(150.0, resultado.getTotalKwh());
        verify(consumoRepository).save(consumo);
    }

    @Test
    void deberiaLanzarExcepcionSiTotalKwhEsCero() {
        consumo.setTotalKwh(0.0);
        assertThrows(IllegalArgumentException.class, () -> consumoService.guardar(consumo));
    }

    @Test
    void deberiaLanzarExcepcionSiConsumoEsNulo() {
        assertThrows(NullPointerException.class, () -> consumoService.guardar(null));
    }

    @Test
    void deberiaObtenerConsumosPorCliente() {
        when(consumoRepository.findByClienteIdCliente(1)).thenReturn(List.of(consumo));
        List<Consumo> resultado = consumoService.obtenerPorClienteId(1);
        assertEquals(1, resultado.size());
        verify(consumoRepository).findByClienteIdCliente(1);
    }

    @Test
    void deberiaLanzarExcepcionSiIdClienteEsNulo() {
        assertThrows(NullPointerException.class, () -> consumoService.obtenerPorClienteId(null));
    }
}
