package co.com.claro.myit.db;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;
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
