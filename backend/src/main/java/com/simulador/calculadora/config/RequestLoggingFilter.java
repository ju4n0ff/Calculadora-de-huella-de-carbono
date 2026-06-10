package com.simulador.calculadora.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.io.IOException;

/** Filtro simple que registra todas las peticiones HTTP entrantes por seguridad y auditoría. */
@Component
public class RequestLoggingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        long inicio = System.currentTimeMillis();
        chain.doFilter(request, response);
        long duracion = System.currentTimeMillis() - inicio;

        log.info("{} {} -> {} ({} ms)",
                req.getMethod(),
                req.getRequestURI(),
                res.getStatus(),
                duracion);
    }
}
