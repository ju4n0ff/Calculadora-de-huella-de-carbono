package com.simulador.calculadora.config;

import com.simulador.calculadora.model.Administrador;
import com.simulador.calculadora.repository.AdministradorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private AdministradorRepository administradorRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        for (Administrador admin : administradorRepository.findAll()) {
            String clave = admin.getClave();
            if (clave != null && !clave.startsWith("$2a$") && !clave.startsWith("$2b$")) {
                log.info("Hashando contraseña en texto plano para admin: {}", admin.getUsuario());
                admin.setClave(passwordEncoder.encode(clave));
                administradorRepository.save(admin);
            }
        }
    }
}
