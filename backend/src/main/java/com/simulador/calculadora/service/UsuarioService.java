package com.simulador.calculadora.service;

import com.simulador.calculadora.model.Usuario;
import com.simulador.calculadora.model.Rol;
import java.util.List;
import java.util.Optional;

/** Servicio que define las operaciones de negocio para la entidad Usuario. */
public interface UsuarioService {

    /** Obtiene un usuario por email, o lo crea con el rol especificado si no existe. */
    Usuario obtenerOPorDefecto(String email, String nombre, Rol rol);

    /** Busca un usuario por su ID. */
    Optional<Usuario> buscarPorId(Long id);

    /** Lista todos los usuarios con un rol específico. */
    List<Usuario> listarPorRol(Rol rol);

    /** Retorna todos los usuarios registrados. */
    List<Usuario> obtenerTodosLosUsuarios();
}
