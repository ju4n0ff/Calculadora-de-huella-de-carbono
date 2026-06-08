package com.simulador.calculadora.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "simulaciones_consumo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimulacionConsumo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación ManyToOne con Usuario para conectar el mappedBy
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "tipo_persona", nullable = false)
    private String tipoPersona;

    @Column(name = "tipo_medidor", nullable = false)
    private String tipoMedidor;

    @Column(name = "carga_kw", nullable = false)
    private Double cargaKw;

    @Column(name = "energia_kwh", nullable = false)
    private Double energiaKwh;

    @Column(name = "costo_soles", nullable = false)
    private Double costoSoles;

    @Column(name = "co2_kg", nullable = false)
    private Double co2Kg;

    @Column(name = "fecha_registro", nullable = false)
    private LocalDateTime fechaRegistro;

    @PrePersist
    protected void onCreate() {
        this.fechaRegistro = LocalDateTime.now();
    }
}