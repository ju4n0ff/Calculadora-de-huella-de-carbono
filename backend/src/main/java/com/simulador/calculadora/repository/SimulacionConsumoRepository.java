package com.simulador.calculadora.repository;

import com.simulador.calculadora.model.SimulacionConsumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SimulacionConsumoRepository extends JpaRepository<SimulacionConsumo, Long> {
}