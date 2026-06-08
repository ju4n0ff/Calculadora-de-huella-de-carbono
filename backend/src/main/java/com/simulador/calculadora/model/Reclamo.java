package com.simulador.calculadora.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "reclamos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Reclamo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reclamo")
    private Integer idReclamo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_suministro")
    private Suministro suministro;

    @Column(nullable = false, length = 500)
    private String descripcion;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(length = 20)
    private String estado;

    @Column(name = "respuesta_admin", length = 500)
    private String respuestaAdmin;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_administrador")
    private Administrador administrador;
}
