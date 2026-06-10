package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Usuario;
import com.simulador.calculadora.model.Rol;
import com.simulador.calculadora.repository.UsuarioRepository;
import com.simulador.calculadora.service.UsuarioService;
import com.google.common.base.Preconditions;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/** Implementación del servicio de Usuario con logging y validación. */
@Service
public class UsuarioServiceImpl implements UsuarioService {

    private static final Logger log = LoggerFactory.getLogger(UsuarioServiceImpl.class);

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public Usuario obtenerOPorDefecto(String email, String nombre, Rol rol) {
        Preconditions.checkArgument(StringUtils.isNotBlank(email), "El email es obligatorio");
        log.info("Obteniendo o creando usuario con email: {}", email);
        return usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Usuario nuevo = new Usuario();
                    nuevo.setNombre(nombre);
                    nuevo.setEmail(email);
                    nuevo.setRol(rol != null ? rol : Rol.CLIENTE);
                    nuevo.setActivo(true);
                    log.info("Creando nuevo usuario: {} con rol {}", email, nuevo.getRol());
                    return usuarioRepository.save(nuevo);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorId(Long id) {
        Preconditions.checkNotNull(id, "El ID del usuario no puede ser nulo");
        log.debug("Buscando usuario por ID: {}", id);
        return usuarioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarPorRol(Rol rol) {
        Preconditions.checkNotNull(rol, "El rol no puede ser nulo");
        log.debug("Listando usuarios con rol: {}", rol);
        return usuarioRepository.findByRol(rol);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> obtenerTodosLosUsuarios() {
        log.debug("Obteniendo todos los usuarios");
        return usuarioRepository.findAll();
    }
}
