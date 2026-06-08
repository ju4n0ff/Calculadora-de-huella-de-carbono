package com.simulador.calculadora.repository;

import com.simulador.calculadora.model.Reclamo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReclamoRepository extends JpaRepository<Reclamo, Integer> {
    List<Reclamo> findByClienteIdClienteOrderByFechaDesc(Integer idCliente);
    List<Reclamo> findAllByOrderByFechaDesc();
}
