package com.simulador.calculadora.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "consumos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Consumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consumo")
    private Integer idConsumo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_suministro", nullable = false)
    private Suministro suministro;

    @Column(name = "horas_uso")
    private Double horasUso;

    @Column(name = "dias")
    private Integer dias;

    @Column(name = "total_kwh")
    private Double totalKwh;

    @Column(name = "costo_total")
    private Double costoTotal;

    @Column(name = "huella_carbono")
    private Double huellaCarbono;

    @Column(name = "fecha")
    private LocalDate fecha;
}
