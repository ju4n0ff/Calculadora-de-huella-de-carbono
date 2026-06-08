package com.simulador.calculadora.repository;

import com.simulador.calculadora.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {

    Optional<Cliente> findByDni(String dni);
    
    // Para login simple por ID (útil para tu frontend)
    Optional<Cliente> findByIdCliente(Integer idCliente);
}