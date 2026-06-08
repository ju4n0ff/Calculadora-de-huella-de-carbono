package com.simulador.calculadora.repository;

import com.simulador.calculadora.model.Suministro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SuministroRepository extends JpaRepository<Suministro, Integer> {
    List<Suministro> findByClienteIdCliente(Integer idCliente);
}
