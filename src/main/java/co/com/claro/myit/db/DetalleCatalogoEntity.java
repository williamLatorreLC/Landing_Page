/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.db;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;


/**
 * @author JD
 */
@Getter
@Setter
@ToString
@Entity
@Table(name = "LANADM.DET_CATALOGO_MYIT")
@XmlRootElement
@NamedQueries({
        @NamedQuery(name = "getGroup",
                query = "SELECT a.id as id,a.grupoN1 as grupoN1,a.grupoN2 as grupoN2,a.automatico as automatico FROM DetalleCatalogoEntity a WHERE a.id=:id")
})
public class DetalleCatalogoEntity implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "C536870918")
    private String id;

    @Column(name = "NIVEL_1_MYIT")
    private String grupoN1;

    @Column(name = "NIVEL_2_MYIT")
    private String grupoN2;

    @Column(name = "ASIGNACION_AUTOMATICA")
    private String automatico;

    @Column(name = "BIA")
    private String bia;
}
