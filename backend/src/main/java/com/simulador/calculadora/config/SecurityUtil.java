package com.simulador.calculadora.config;

import org.apache.commons.lang3.StringUtils;

/** Utilidad para saneamiento básico de entradas y prevención de XSS. */
public final class SecurityUtil {

    private SecurityUtil() {
        throw new UnsupportedOperationException("Clase utilitaria");
    }

    /** Elimina caracteres peligrosos para prevenir XSS en cadenas de texto. */
    public static String sanitizar(String input) {
        if (input == null) return null;
        return input
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;")
                .replace("&", "&amp;");
    }

    /** Valida que un string no esté vacío después de recortar espacios, o lanza excepción. */
    public static String requerirNoVacio(String valor, String mensaje) {
        if (StringUtils.isBlank(valor)) {
            throw new IllegalArgumentException(mensaje);
        }
        return valor.trim();
    }
}
