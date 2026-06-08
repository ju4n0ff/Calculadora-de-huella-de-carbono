package com.simulador.calculadora.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tarifas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Tarifa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tarifa")
    private Integer idTarifa;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "precio_kwh", nullable = false)
    private Double precioKwh;

    @Column(length = 255)
    private String descripcion;
}
