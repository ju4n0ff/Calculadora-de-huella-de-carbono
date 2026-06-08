package com.simulador.calculadora.controller;



import com.simulador.calculadora.model.Administrador;
import com.simulador.calculadora.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/administradores")
@CrossOrigin(origins = "*") // Permite la comunicación con el frontend
public class AdminController {

    @Autowired
    private AdministradorRepository administradorRepository;

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Administrador loginRequest) {
        return administradorRepository.findByUsuarioAndClave(loginRequest.getUsuario(), loginRequest.getClave())
                .map(admin -> {
                    // Por seguridad, limpiamos la clave en la respuesta
                    admin.setClave(null);
                    return ResponseEntity.ok(admin);
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()); // Retorna 401 si falla
    }
}