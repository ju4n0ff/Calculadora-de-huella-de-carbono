package com.simulador.calculadora.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Object id) {
        super(resource + " no encontrado con ID: " + id);
    }
}
