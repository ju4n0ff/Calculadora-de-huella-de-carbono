package com.simulador.calculadora.repository; 


import com.simulador.calculadora.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    Optional<Administrador> findByUsuarioAndClave(String usuario, String clave);
    Optional<Administrador> findByUsuario(String usuario);
}