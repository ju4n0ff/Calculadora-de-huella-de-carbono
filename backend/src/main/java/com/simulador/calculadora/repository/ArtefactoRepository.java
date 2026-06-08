package com.simulador.calculadora.repository;

import com.simulador.calculadora.model.Artefacto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtefactoRepository extends JpaRepository<Artefacto, Long> {
}