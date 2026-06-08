package com.simulador.calculadora.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "artefactos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Artefacto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private Double wattsBase;

    @Column(length = 50)
    private String categoria; // Ejemplo: 'Linea Blanca', 'Entretenimiento', 'Computo'

    @Column(name = "horas_promedio_uso")
    private Double horasPromedioUso;
}