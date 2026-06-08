package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Usuario;
import com.simulador.calculadora.model.Rol;
import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    // Obtiene el usuario si existe, o lo crea con un rol específico si es nuevo
    Usuario obtenerOPorDefecto(String email, String nombre, Rol rol);
    
    Optional<Usuario> buscarPorId(Long id);
    
    List<Usuario> listarPorRol(Rol rol);
    
    List<Usuario> obtenerTodosLosUsuarios();
}