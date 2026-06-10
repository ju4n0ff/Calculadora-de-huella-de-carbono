package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Artefacto;
import com.simulador.calculadora.repository.ArtefactoRepository;
import com.simulador.calculadora.service.Impl.ArtefactoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ArtefactoServiceTest {

    @Mock
    private ArtefactoRepository artefactoRepository;

    @InjectMocks
    private ArtefactoServiceImpl artefactoService;

    private Artefacto artefacto;

    @BeforeEach
    void setUp() {
        artefacto = new Artefacto();
        artefacto.setId(1L);
        artefacto.setNombre("Refrigeradora");
        artefacto.setWattsBase(350.0);
        artefacto.setCategoria("Linea Blanca");
        artefacto.setHorasPromedioUso(24.0);
    }

    @Test
    void deberiaGuardarArtefacto() {
        when(artefactoRepository.save(artefacto)).thenReturn(artefacto);
        Artefacto resultado = artefactoService.guardarArtefacto(artefacto);
        assertNotNull(resultado);
        assertEquals("Refrigeradora", resultado.getNombre());
        verify(artefactoRepository).save(artefacto);
    }

    @Test
    void deberiaLanzarExcepcionSiWattsBaseEsCero() {
        artefacto.setWattsBase(0.0);
        assertThrows(IllegalArgumentException.class, () -> artefactoService.guardarArtefacto(artefacto));
    }

    @Test
    void deberiaLanzarExcepcionSiNombreEsVacio() {
        artefacto.setNombre("");
        assertThrows(IllegalArgumentException.class, () -> artefactoService.guardarArtefacto(artefacto));
    }

    @Test
    void deberiaBuscarPorId() {
        when(artefactoRepository.findById(1L)).thenReturn(Optional.of(artefacto));
        Optional<Artefacto> resultado = artefactoService.buscarPorId(1L);
        assertTrue(resultado.isPresent());
        assertEquals("Refrigeradora", resultado.get().getNombre());
    }

    @Test
    void deberiaLanzarExcepcionSiIdEsNulo() {
        assertThrows(NullPointerException.class, () -> artefactoService.buscarPorId(null));
    }
}
