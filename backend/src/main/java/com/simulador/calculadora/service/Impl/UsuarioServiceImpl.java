package com.simulador.calculadora.service.Impl;

import com.simulador.calculadora.model.Usuario;
import com.simulador.calculadora.model.Rol;
import com.simulador.calculadora.repository.UsuarioRepository;
import com.simulador.calculadora.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public Usuario obtenerOPorDefecto(String email, String nombre, Rol rol) {
        return usuarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Usuario nuevo = new Usuario();
                    nuevo.setNombre(nombre);
                    nuevo.setEmail(email);
                    nuevo.setRol(rol != null ? rol : Rol.CLIENTE); // Si no se envía rol, por defecto es CLIENTE
                    nuevo.setActivo(true);
                    return usuarioRepository.save(nuevo);
                });
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarPorRol(Rol rol) {
        return usuarioRepository.findByRol(rol);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> obtenerTodosLosUsuarios() {
        return usuarioRepository.findAll();
    }
}