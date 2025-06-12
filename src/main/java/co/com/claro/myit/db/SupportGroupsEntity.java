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
import java.io.Serializable;


/**
 *
 * @author JD
 */
@Entity
@Table(name = "ARADMIN.T1059")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "Soporte.listOrganizations",
            query = "SELECT DISTINCT a.organizacion as organizacion FROM SupportGroupsEntity a WHERE a.estado=1"),
    @NamedQuery(name = "Soporte.findByOrganization",
            query = "SELECT DISTINCT a.grupo as grupo,a.id as id FROM SupportGroupsEntity a WHERE a.organizacion IS NOT NULL AND a.organizacion = :organizacion AND a.estado=1")
})
public class SupportGroupsEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "C1")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;

    @Column(name = "C7")
    private int estado;

    @Column(name = "C1000000014")
    private String organizacion;

    @Column(name = "C1000000015")
    private String grupo;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrganizacion() {
        return organizacion;
    }

    public void setOrganizacion(String organizacion) {
        this.organizacion = organizacion;
    }

    public String getGrupo() {
        return grupo;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public int getEstado() {
        return estado;
    }

    public void setEstado(int estado) {
        this.estado = estado;
    }
    

    @Override
    public String toString() {
        return "co.com.claro.myit.db.SupportGroupsEntity[ id=" + id + " ]";
    }

}
