package co.com.claro.myit.db;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


import java.io.Serializable;

@Getter
@Setter
@ToString
@Entity
@Table(name = "PRIORIDAD_INCIDENTES")
@XmlRootElement
public class PrioridadIncidentesEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @Column(name = "ID_PRIORIDAD_INCIDENTES")
    private String id;
    @Column(name = "URGENCIA")
    private String urgencia;
    @Column(name = "IMPACTO")
    private String impacto;
    @Column(name = "PRIORIDAD_INCIDENTES")
    private String prioridad;
}
