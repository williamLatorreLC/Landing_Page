/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package co.com.claro.myit.db;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author JD
 */
@Entity
@Table(name = "ARADMIN.T4079")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "LineaServicios.listUniques",
            query = "SELECT DISTINCT a.lineaServicio as lineaServicio FROM CatalogoEntity a WHERE a.estadoClrID=1"),
     @NamedQuery(name = "Servicios.findByServiceLine",
            query = "SELECT DISTINCT a.servicio as servicio FROM CatalogoEntity a WHERE  a.lineaServicio = :lineaServicio AND  a.estadoClrID=1"),
    @NamedQuery(name = "Aplicaciones.findByServiceLineAndService",
            query = "SELECT DISTINCT a.aplicacion as aplicacion FROM CatalogoEntity a WHERE a.aplicacion IS NOT NULL  AND a.lineaServicio=:lineaServicio AND a.servicio = :servicio AND  a.estadoClrID=1"),
    @NamedQuery(name = "Aplicaciones.findByServiceLine",
            query = "SELECT DISTINCT a.aplicacion as aplicacion,a.prerequisitos as prerequisitos FROM CatalogoEntity a WHERE a.aplicacion IS NOT NULL AND a.lineaServicio=:lineaServicio AND  a.estadoClrID=1"),
    @NamedQuery(name = "TipoOperaciones.findAll",
            query = "SELECT DISTINCT a.tipoOperacion as tipoOperacion FROM CatalogoEntity a"),
    @NamedQuery(name = "TipoFalla.findByAplicacionServiceAndServiceLine",
            query = "SELECT DISTINCT a.tipoFalla as tipoFalla FROM CatalogoEntity a WHERE a.aplicacion = :aplicacion AND a.lineaServicio=:lineaServicio AND a.servicio = :servicio AND a.estadoClrID=1"),
    @NamedQuery(name = "getCLRID",
            query = "SELECT a.clrID as clrID FROM CatalogoEntity a WHERE a.aplicacion = :aplicacion AND a.lineaServicio=:lineaServicio AND a.servicio = :servicio AND a.tipoFalla=:tipoFalla AND a.estadoClrID=1"),
     @NamedQuery(name = "gerPrerequisitesAMX",
            query = "SELECT a.prerequisitosAMX as prerequisitosAMX,a.prerequisitos as prerequisitos FROM CatalogoEntity a WHERE a.aplicacion = :aplicacion AND a.lineaServicio=:lineaServicio AND a.servicio = :servicio AND a.tipoFalla=:tipoFalla  AND a.estadoClrID=1"),
    @NamedQuery(name = "TipoUsuarios.findAll",
            query = "SELECT DISTINCT a.tipoUsuario as tipoUsuario FROM CatalogoEntity a")
})
public class CatalogoEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "C1")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private String id;
    
    @Column(name = "C7")
    private String estado;
    
    @Column(name = "C536870919")
    private String estadoClrID;

    @Column(name = "C1000000063")
    private String lineaServicio;

    @Column(name = "C1000000064")
    private String servicio;

    @Column(name = "C240001002")
    private String aplicacion;

    @Column(name = "C536870915")
    private String prerequisitos;
    
    @Column(name = "C536870932")
    private String prerequisitosAMX;

    @Column(name = "C536870920")
    private String tipoOperacion;

    @Column(name = "C1000000065")
    private String tipoFalla;

    @Column(name = "C536870929")
    private String tipoUsuario;

    @Column(name = "C536870918")
    private String clrID;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
    

    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }

    public String getLineaServicio() {
        return lineaServicio;
    }

    public void setLineaServicio(String lineaServicio) {
        this.lineaServicio = lineaServicio;
    }
    
    public String getAplicacion() {
        return aplicacion;
    }

    public void setAplicacion(String aplicacion) {
        this.aplicacion = aplicacion;
    }

    public String getPrerequisitos() {
        return prerequisitos;
    }

    public void setPrerequisitos(String prerequisitos) {
        this.prerequisitos = prerequisitos;
    }

    public String getTipoOperacion() {
        return tipoOperacion;
    }

    public void setTipoOperacion(String tipoOperacion) {
        this.tipoOperacion = tipoOperacion;
    }

    public String getTipoFalla() {
        return tipoFalla;
    }

    public void setTipoFalla(String tipoFalla) {
        this.tipoFalla = tipoFalla;
    }

    public String getTipoUsuario() {
        return tipoUsuario;
    }

    public void setTipoUsuario(String tipoUsuario) {
        this.tipoUsuario = tipoUsuario;
    }

    public String getClrID() {
        return clrID;
    }

    public void setClrID(String clrID) {
        this.clrID = clrID;
    }

    public String getPrerequisitosAMX() {
        return prerequisitosAMX;
    }

    public void setPrerequisitosAMX(String prerequisitosAMX) {
        this.prerequisitosAMX = prerequisitosAMX;
    }

    public String getEstadoClrID() {
        return estadoClrID;
    }

    public void setEstadoClrID(String estadoClrID) {
        this.estadoClrID = estadoClrID;
    }
    
    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof CatalogoEntity)) {
            return false;
        }
        CatalogoEntity other = (CatalogoEntity) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "co.com.claro.myit.db.CatalogEntity[ id=" + id + " ]";
    }

}
