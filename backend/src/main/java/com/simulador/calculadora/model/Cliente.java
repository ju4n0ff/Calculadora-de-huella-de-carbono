package com.simulador.calculadora.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Integer idCliente;

    private String nombre;
    private String dni;
    private String direccion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_tarifa")
    private Tarifa tarifa;

    // Constructor adicional útil
    public Cliente(Integer idCliente, String nombre) {
        this.idCliente = idCliente;
        this.nombre = nombre;
    }
}