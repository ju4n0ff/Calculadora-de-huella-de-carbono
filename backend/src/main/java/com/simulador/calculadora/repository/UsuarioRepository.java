package com.simulador.calculadora.repository;

import com.simulador.calculadora.model.Usuario;
import com.simulador.calculadora.model.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // Buscar usuario por su correo electrónico institucional o personal
    Optional<Usuario> findByEmail(String email);
    
    // Listar usuarios filtrados por su rol (CLIENTE o ADMINISTRADOR)
    List<Usuario> findByRol(Rol rol);
}