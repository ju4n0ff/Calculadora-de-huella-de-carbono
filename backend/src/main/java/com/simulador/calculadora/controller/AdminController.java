package com.simulador.calculadora.controller;

import com.simulador.calculadora.model.Administrador;
import com.simulador.calculadora.repository.AdministradorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/administradores")
public class AdminController {

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody Administrador loginRequest) {
        java.util.Optional<Administrador> adminOpt = administradorRepository.findByUsuario(loginRequest.getUsuario());
        if (adminOpt.isPresent() && passwordEncoder.matches(loginRequest.getClave(), adminOpt.get().getClave())) {
            Administrador admin = adminOpt.get();
            admin.setClave(null);
            return ResponseEntity.ok(admin);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Datos incorrectos");
    }
}
