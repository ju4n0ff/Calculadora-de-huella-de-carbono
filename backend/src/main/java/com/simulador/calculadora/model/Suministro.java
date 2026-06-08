package com.simulador.calculadora.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "suministros")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Suministro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_suministro")
    private Integer idSuministro;

    @Column(name = "codigo_medidor", length = 50)
    private String codigoMedidor;

    @Column(name = "tipo_conexion", length = 50)
    private String tipoConexion;

    @Column(name = "fuente_energia", length = 50)
    private String fuenteEnergia;

    @Column(length = 20)
    private String estado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;
}
