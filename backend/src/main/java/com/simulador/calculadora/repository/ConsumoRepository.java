package com.simulador.calculadora.repository;

import com.simulador.calculadora.model.Consumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ConsumoRepository extends JpaRepository<Consumo, Integer> {
    List<Consumo> findByClienteIdCliente(Integer idCliente);
    List<Consumo> findAllByOrderByFechaDesc();
}
